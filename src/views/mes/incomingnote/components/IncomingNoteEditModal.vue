<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="'编辑收料记录'"
    :width="600"
    wrapClassName="incoming-note-edit-modal"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { editFormSchema } from '../IncomingNote.data';
  import { edit } from '../IncomingNote.api';

  const emit = defineEmits(['register', 'success']);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: editFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    try {
      await resetFields();
      setModalProps({
        confirmLoading: false,
        showCancelBtn: !!data?.showFooter,
        showOkBtn: !!data?.showFooter,
      });
      if (unref(data?.isUpdate) && data?.record) {
        const record = { ...data.record };
        if (record.supplierId != null) {
          record.supplierId = String(record.supplierId);
        }
        await setFieldsValue(record);
      }
    } catch (error) {
      console.error('Error in useModalInner callback:', error);
    }
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const submitValues = { ...values };
      setModalProps({ confirmLoading: true });
      await edit(submitValues);
      closeModal();
      emit('success');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleCancel() {
    closeModal();
  }
</script>

<style scoped lang="less"></style>

<!-- 弹窗内容通过 teleport 渲染，需用非 scoped 样式 + wrapClassName 限定作用域 -->
<style lang="less">
  .incoming-note-edit-modal {
    .ant-form-item-label > label {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    .ant-input,
    .ant-input-number-input,
    .ant-picker-input > input,
    .ant-select-selection-item,
    .ant-radio-button-wrapper {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    .ant-input-number.ant-input-number-disabled .ant-input-number-input {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.88);
    }
  }
</style>
