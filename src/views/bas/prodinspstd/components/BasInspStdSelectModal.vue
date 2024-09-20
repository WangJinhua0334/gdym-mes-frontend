<template>
  <BasicModal v-bind="$attrs" @register="registerStdSelectModal" destroyOnClose :title="'通用检验标准选择'" @ok="handleSubmit" :width="896">
    <BasicForm @register="registerStdSelectForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { inspStdSelectFormSchema } from '../BasProdInspStd.data';

  const emit = defineEmits(['register']);

  const callBack = ref();

  //表单配置
  const [registerStdSelectForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: inspStdSelectFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerStdSelectModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    //接收回调方法
    callBack.value = data.callBack;

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: false });
  });

  async function reset() {
    await resetFields();
  }

  //表单提交事件
  async function handleSubmit(v) {
    let values = await validate();

    //关闭弹窗
    closeModal();

    // 回调
    if (unref(callBack)) {
      unref(callBack)(values.stdId);
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
