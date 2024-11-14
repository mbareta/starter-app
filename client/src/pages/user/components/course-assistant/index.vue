<script>
import request from 'user/helpers/request';

const Role = { ASSISTANT: 'ASSISTANT', USER: 'USER' };

export default {
  data() {
    return {
      isActivated: false,
      messages: [],
      streamingMessage: ''
    };
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatDisplay.scrollTop = this.$refs.chatDisplay.scrollHeight;
      });
    },
    sendQuery({ inputType, target }) {
      if (inputType !== 'insertLineBreak') return;
      const text = target.value;
      this.messages.push({ text, role: Role.USER });
      target.value = null;
      this.streamingMessage = '...';
      return request.post(
        'course-assistant',
        { text },
        { responseType: 'stream', adapter: 'fetch' }
      ).then(async response => {
        const reader = await response.data.getReader();
        const decoder = new TextDecoder();
        this.streamingMessage = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          this.streamingMessage += decoder.decode(value);
          this.scrollToBottom();
        }
        this.messages.push({
          text: this.streamingMessage, role: Role.ASSISTANT
        });
        this.streamingMessage = '';
      });
    }
  }
};
</script>

<template>
  <div class="assistant-container" :class="{ 'is-activated': isActivated }">
    <button v-if="!isActivated" @click="isActivated = true">
      🤖
    </button>
    <div v-if="isActivated" ref="chatDisplay" class="chat-display">
      <p>🎉 Welcome to your personal course assistant! 🎉</p>
      <div
        v-for="message in messages"
        :key="message.text"
        :class="`type-${message.role.toLowerCase()}`"
        class="message">
        {{ message.text }}
      </div>
      <div
        v-if="this.streamingMessage"
        class="message role-assistant is-streaming">
        {{ this.streamingMessage }}
      </div>
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
    }
  }

  .message {
    margin: 0.25rem;
    padding: 0.5rem;
    border: 1px solid var(--bulma-info);

    &.type-user {
      border: 1px solid var(--bulma-warning);
    }

    &.is-streaming {
      border-style: dashed;
    }
  }

  button {
    width: 4.75rem;
    height: 4.75rem;
    padding: $padding;
    line-height: 1;
    font-size: var(--bulma-size-2);
  }

  input {
    width: $width - 2 * $padding;
  }
}
</style>
