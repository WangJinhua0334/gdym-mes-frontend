<template>
  <iframe
    ref="iframeRef"
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    :src="iframeSrc"
    style="width: 100%; height: 100%"
    scrolling="auto"
    frameborder="0"
  >
  </iframe>
</template>

<script lang="ts" setup name="file-Preview">
  import { ref, computed, unref, watch } from 'vue';

  let previewUrl = sessionStorage.getItem('previewUrl');

  //请求返回预览的地址
  const iframeSrc = ref('');

  watch(
    () => previewUrl,
    (newVal) => {
      if (newVal) {
        iframeSrc.value = newVal;
      }
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
