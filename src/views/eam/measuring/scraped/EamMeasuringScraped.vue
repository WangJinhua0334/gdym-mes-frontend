<template>
  <BasicModal v-bind="$attrs" @register="registerMesMoCloseModal" destroyOnClose :title="'报废信息'" @ok="handleSubmit" :width="896">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema } from './EamMeasuringScraped.data';
import { scrap } from './EamMeasuringScraped.api';
const emit = defineEmits(['register', 'success']);

//表单配置
const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate, updateSchema }] = useForm({
  labelWidth: 120,
  schemas: formSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单赋值
const [registerMesMoCloseModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //重置表单
  setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: false });
   //表单赋值
  await setFieldsValue({
     typeId: data.typeId,
     id: data.id,
  });
});

//表单提交事件
async function handleSubmit(v) {
  try {
    let values = await validate();
    setModalProps({ confirmLoading: true });

    console.log(values);
    //提交表单
    await scrap(values);
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
