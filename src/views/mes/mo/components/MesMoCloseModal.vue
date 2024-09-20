<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'工单关闭'" @ok="handleSubmit" :width="896">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { close } from '../MesMo.api';
  import { formSchema } from './MesMoClose.data';

  const emit = defineEmits(['register', 'success']);

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setFieldsValue({ id: data.id.join(',') });
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: false });
  });

  async function reset() {
    await resetFields();
  }

  //表单提交事件
  async function handleSubmit(v) {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      let values = await validate();

      await close({ id: values.id, closeReason: values.closeReason }, () => {
        closeModal();
        emit('success');
      });
    } catch (error) {
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped></style>
