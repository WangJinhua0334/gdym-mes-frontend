<template>
  <BasicModal 
    v-bind="$attrs" 
    @register="registerModal" 
    destroyOnClose 
    :title="'编辑记录'" 
    :width="1200" 
    :minHeight="600" 
    :canFullscreen="true"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { editFormSchema } from '../CoilProdReport.data';
  import { coilProdReportEdit } from '../CoilProdReport.api';

  const emit = defineEmits(['register', 'success']);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 140,
    schemas: editFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('useModalInner callback called', data);
    try {
      await resetFields();
      setModalProps({ 
        confirmLoading: false, 
        showCancelBtn: !!data?.showFooter, 
        showOkBtn: !!data?.showFooter,
        open: true  // 确保弹窗打开
      });
      if (unref(data?.isUpdate) && data?.record) {
        // 转换数字类型的 ID 为字符串，以兼容 JSearchSelectCustom 组件
        const record = { ...data.record };
        // JSearchSelectCustom 组件期望 value 是字符串或数组
        if (record.startTeamId != null) {
          record.startTeamId = String(record.startTeamId);
        }
        if (record.endTeamId != null) {
          record.endTeamId = String(record.endTeamId);
        }
        if (record.warehouseId != null) {
          record.warehouseId = String(record.warehouseId);
        }
        if (record.oldMaterialId != null) {
          record.oldMaterialId = String(record.oldMaterialId);
        }
        if (record.newMaterialId != null) {
          record.newMaterialId = String(record.newMaterialId);
        }
        await setFieldsValue(record);
      }
      console.log('Modal opened successfully');
    } catch (error) {
      console.error('Error in useModalInner callback:', error);
    }
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      // 将字符串类型的 ID 转换回数字，以匹配后端期望的数据类型
      const submitValues = { ...values };
      if (submitValues.startTeamId != null && typeof submitValues.startTeamId === 'string') {
        submitValues.startTeamId = Number(submitValues.startTeamId);
      }
      if (submitValues.endTeamId != null && typeof submitValues.endTeamId === 'string') {
        submitValues.endTeamId = Number(submitValues.endTeamId);
      }
      if (submitValues.warehouseId != null && typeof submitValues.warehouseId === 'string') {
        submitValues.warehouseId = Number(submitValues.warehouseId);
      }
      setModalProps({ confirmLoading: true });
      await coilProdReportEdit(submitValues);
      closeModal();
      emit('success');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleCancel() {
    console.log('handleCancel called');
    // 使用 closeModal 来关闭弹窗，它会通过 setModalProps 设置 open: false
    closeModal();
  }
</script>

<style scoped lang="less"></style>
