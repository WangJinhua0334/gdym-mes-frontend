<template>
  <BasicModal v-bind="$attrs" @register="registerRejectModal" :title="'驳回'" destroyOnClose :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { rejectFormSchema } from '../MesAbnormal.data';
  import { reSend } from '../MesAbnormal.api';

  // Emits声明
  const emit = defineEmits(['register', 'success']);

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: rejectFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerRejectModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();

    setModalProps({ confirmLoading: false, showOkBtn: true, showCancelBtn: true });
    setFieldsValue({ ...data.record });
    //表单赋值

    // 隐藏底部时禁用整个表单
    setProps({ disabled: false });
  });

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });

      //提交表单
      await reSend(values);

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
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
