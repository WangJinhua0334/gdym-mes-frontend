<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="title"
    :defaultFullscreen="true"
    :showOkBtn="false"
    :cancelText="'关闭'"
  >
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
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  //设置标题
  const title = computed(() => '文件预览');
  //请求返回预览的地址
  const iframeSrc = ref('');
  //表单赋值
  const [registerModal, { setModalProps }] = useModalInner((data) => {
    console.log(data);
    iframeSrc.value = unref(data).data;
    setModalProps({ loading: false, showCancelBtn: true, showOkBtn: false });
  });
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
