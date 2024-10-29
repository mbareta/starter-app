import { ref, watchEffect } from 'vue';
import request from 'user/helpers/request';

export function useAsyncImage(url) {
  const src = ref('');

  const fetchData = () => {
    if (!url) {
      return 'https://bulma.io/assets/images/placeholders/1280x960.png';
    }
    src.value = '';
    return request.get(`/courses/asset-url?path=${url.value}`)
      .then(({ data }) => (src.value = data));
  };

  watchEffect(() => fetchData());

  return { src }
}
