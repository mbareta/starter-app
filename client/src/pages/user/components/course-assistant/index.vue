<script>
import LoadingEllipsis from 'user/components/LoadingEllipsis.vue';
import markdownit from 'markdown-it';
import request from 'user/helpers/request';

const Role = { ASSISTANT: 'ASSISTANT', USER: 'USER' };

export default {
  components: { LoadingEllipsis },
  data() {
    return {
      isActivated: false,
      isLoading: false,
      messages: [],
      streamingMessage: '',
      threadId: null
    };
  },
  computed: {
    md() {
      return markdownit();
    }
  },
  methods: {
    pushStreamingMessage() {
      this.messages.push({
        text: this.streamingMessage, role: Role.ASSISTANT
      });
      this.streamingMessage = '';
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatDisplay.scrollTop = this.$refs.chatDisplay.scrollHeight;
      });
    },
    async sendQuery({ inputType, target }) {
      if (inputType !== 'insertLineBreak') return;
      if (!this.threadId) {
        const { data } = await request.post('course-assistant/thread');
        this.threadId = data.id;
      }
      const text = target.value;
      this.messages.push({ text, role: Role.USER });
      this.scrollToBottom();
      target.value = null;
      this.isLoading = true;
      return request.post(
        'course-assistant',
        { text, threadId: this.threadId },
        { responseType: 'stream', adapter: 'fetch' }
      ).then(async response => {
        const reader = await response.data.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          this.streamingMessage += decoder.decode(value);
          this.scrollToBottom();
        }
        this.pushStreamingMessage();
      }).finally(() => (this.isLoading = false));
    }
  }
};
</script>

<template>
  <div class="assistant-container" :class="{ 'is-activated': isActivated }">
    <button v-if="!isActivated" class="icon" @click="isActivated = true">
      🤖
    </button>
    <div v-if="isActivated" ref="chatDisplay" class="chat-display">
      <p>
        🎉 Welcome to your personal course assistant! 🎉
        <button
          v-if="isActivated"
          aria-label="close"
          class="modal-close is-large"
          @click="isActivated = false" />
      </p>
      <div
        v-for="message in messages"
        :key="message.text"
        :class="`type-${message.role.toLowerCase()}`"
        class="message"
        v-html="md.render(message.text)" />
      <div
        v-if="streamingMessage"
        class="message type-assistant"
        v-html="md.render(streamingMessage)" />
      <loading-ellipsis v-if="isLoading && !streamingMessage" />
    </div>
    <textarea
      v-if="isActivated"
      class="input"
      placeholder="Ask me anything..."
      @input="sendQuery" />
  </div>
</template>

<style lang="scss" scoped>
$height: 40rem;
$width: 30rem;
$padding: 1rem;

.assistant-container {
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  width: 5rem;
  height: 5rem;
  border: 2px solid var(--bulma-primary);
  border-radius: 100%;
  color: var(--bulma-info-dark-invert);
  background: var(--bulma-info-dark);
  overflow: hidden;
  // show on top of modal
  z-index: 100;
  transition: all 0.7s;

  &.is-activated {
    width: $width;
    height: $height;
    padding: $padding;
    border: 2px solid var(--bulma-primary);
    border-radius: var(--bulma-radius-medium);
  }

  .chat-display {
    width: $width - 2 * $padding;
    height: $height - 2 * $padding - 2.5rem; // take account for input height
    overflow-y: scroll;

    p {
      padding-bottom: 0.75rem;
      text-align: center;
      border-bottom: 2px solid var(--bulma-primary);

      button {
        margin: -0.25rem 0 0 1.5rem;
      }
    }
  }

  .message {
    margin: 0.5rem 0.25rem;
    padding: 0.5rem;

    &.type-assistant {
      margin-right: 3rem;
      color: var(--bulma-info-invert);
      background: var(--bulma-info);
    }

    &.type-user {
      margin-left: 3rem;
      color: var(--bulma-warning-invert);
      background: var(--bulma-warning);
      text-align: right;
    }
  }

  button.icon {
    width: 4.75rem;
    height: 4.75rem;
    padding: $padding;
    line-height: 1;
    font-size: var(--bulma-size-2);
  }
}

html[data-theme="light"] {
  .assistant-container {
    color: var(--bulma-info-invert);
    background: var(--bulma-info-light);
  }

  .modal-close {
    &::before, &::after {
      background-color: var(--bulma-info-dark);
    }
  }
}
</style>
