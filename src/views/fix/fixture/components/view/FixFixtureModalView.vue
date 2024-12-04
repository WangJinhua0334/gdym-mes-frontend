<template>
  <BasicModal v-bind="$attrs" @register="registerViewModal" destroyOnClose :title="'查看'" :width="800">
    <BasicForm @register="registerViewForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { fixFixtureFormSchema } from './FixFixtureModalView.data';

  //接收主表id
  // Emits声明
  const isUpdate = ref(true);
  //表单配置
  const [registerViewForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: fixFixtureFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
    await setFieldsValue({
      ...data.record,
    });
    // 隐藏底部时禁用整个表单
    setProps({ disabled: true });
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
