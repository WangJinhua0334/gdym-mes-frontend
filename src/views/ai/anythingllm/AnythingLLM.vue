<template>
  <iframe
    ref="iframeRef"
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    :src="iframeSrc"
    :key="iframeSrc"
    style="width: 100%; height: 100%"
    scrolling="auto"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, nextTick } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  const iframeSrc = ref('');
  onMounted(() => {
    defHttp
      .get({ url: '/ai/llm/getToken' })
      .then((res) => {
        console.log(res);
        if (res && res.url) {
          // 赋值 url
          iframeSrc.value = res.url + '/login?username=' + res.user.username + '&password=' + res.password;
          //iframeSrc.value = 'http://127.0.0.1:3000/login?username=' + res.user.username + '&password=' + res.password;
          console.log('iframeSrc updated to:', iframeSrc.value); // 检查 iframeSrc 是否正确更新
        }
      })
      .catch((error) => {
        console.error('Request failed:', error);
      });
  });
</script>

<style lang="less" scoped></style>
