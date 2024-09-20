<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../MesMoCompleteKit.data';
  import { edit } from '../MesMoCompleteKit.api';

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const formDisabled = ref(false);

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    labelWidth: 160,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formDisabled.value = !data?.showFooter;
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: !unref(formDisabled) });

    //重置表单
    await reset();

    //表单赋值
    await setFieldsValue({
      ...data.record,
    });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: unref(formDisabled) });
  });

  //设置标题
  const title = computed(() => (unref(formDisabled) ? '详情' : '编辑'));

  async function reset() {
    await resetFields();
  }

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();

      setModalProps({ confirmLoading: true });

      //提交表单
      await edit(values);

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

  :deep(.ant-picker) {
    width: 100%;
  }
</style>
