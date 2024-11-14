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
    sendQuery({ inputType, target }) {
      if (inputType !== 'insertLineBreak') return;
      const text = target.value;
      this.messages.push({ text, role: Role.USER });
      target.value = null;
      return request.post(
        'course-assistant',
        { text },
        { responseType: 'stream', adapter: 'fetch' }
      ).then(async response => {
        const reader = await response.data.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          this.streamingMessage += decoder.decode(value);
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
    <div v-if="isActivated" class="chat-display">
      Welcome!
      <div
        v-for="message in messages"
        :key="message.text"
        :class="`type-${message.role.toLowerCase()}`"
        class="message">
        {{ message.text }}
      </div>
      <div v-if="this.streamingMessage" class="message role-assistant">
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
$height: 20rem;
$width: 20rem;
$padding: 1rem;

.assistant-container {
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  width: 5rem;
  height: 5rem;
  border: 2px solid var(--bulma-primary);
  border-radius: 100%;
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
  }

  .message {
    margin: 0.25rem;
    padding: 0.5rem;
    border: 1px solid var(--bulma-info);

    &.type-user {
      border: 1px solid var(--bulma-warning);
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
