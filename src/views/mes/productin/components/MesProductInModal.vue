<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'入库申请'" :width="1200">
    <MesProductInAdd @close="close" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import MesProductInAdd from './add/MesProductInAdd.vue';

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
  });
  function close() {
    closeModal();
    emit('success');
  }
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
