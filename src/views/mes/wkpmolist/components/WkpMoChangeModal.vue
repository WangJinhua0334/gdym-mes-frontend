<template>
  <BasicModal v-bind="$attrs" @register="registerCompleteModal" destroyOnClose :title="'绑定工位任务'" :width="800">
    <WkpMoChange @success="emit('success')" :wkpId="wkpId" @close="closeModal" @setModalProps="setModalProps" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import WkpMoChange from './WkpMoChange.vue';
  const emit = defineEmits(['success']);
  const wkpId = ref('');
  const [registerCompleteModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
    wkpId.value = data?.record?.wkpId;
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
