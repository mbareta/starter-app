<script>
import { Scene } from '@soulmachines/smwebsdk';
const apiKey = 'eyJzb3VsSWQiOiJkZG5hLW1hcmluLWJhcmV0YS1vcmc0N2I3LS1kaWdpdGFsLWNoaWVmLWV4cGUiLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV84YTlkMTQ5YS1mZjU0LTQ0ZGEtOWZjMy1mMWRiZTQ3ZGEzZjMifQ==';

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
    return scene.connect().then(sessionId => scene.startVideo());
  }
};
</script>

<template>
  <div>
    <video ref="video" width="640" height="640"></video>
  </div>
</template>
