<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'上模'" :width="800">
    <UpMould @success="emit('success')" @close="closeModal" @setModalProps="setModalProps" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import UpMould from './UpMould.vue';
  const emit = defineEmits(['success']);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
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
