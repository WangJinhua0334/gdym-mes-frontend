<template>
  <BasicModal v-bind="$attrs" @register="registerCompleteModal" destroyOnClose :title="'处理不良品'" :width="800">
    <MesLotDefectiveComplete @success="emit('success')" :defectiveCardSn="defectiveCardSn" @close="closeModal" @setModalProps="setModalProps" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import MesLotDefectiveComplete from './MesLotDefectiveComplete.vue';
  const emit = defineEmits(['success']);
  const defectiveCardSn = ref('');
  const [registerCompleteModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
    defectiveCardSn.value = data?.record?.lotSn;
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
