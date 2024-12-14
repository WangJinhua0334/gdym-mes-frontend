<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" name="ModMouldRepairForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { evaluateFormSchema } from '../ModMouldRepair.data';
  import { evaluate } from '../ModMouldRepair.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    schemas: evaluateFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '评价' : !unref(formDisabled) ? '评价' : '详情'));

  async function reset() {
    await resetFields();
  }
  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await evaluate(values);
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
