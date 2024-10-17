<script>
import { Scene } from '@soulmachines/smwebsdk';
const apiKey = import.meta.env.VITE_SOUL_MACHINE_API_KEY;

export default {
  mounted() {
    const scene = new Scene({
      apiKey,
      videoElement: this.$refs.video,
      requestedMediaDevices: { microphone: true, camera: true },
      requiredMediaDevices: {},
      sendMetadata: {
        pageUrl: true
      }
    });
    return scene.connect().then(() => scene.startVideo());
  }
};
</script>

<template>
  <div>
    <video ref="video" width="640" height="640" />
  </div>
</template>
