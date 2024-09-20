<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { unbindFormSchema } from '../ProductBind.data';
  import { unbind } from '../ProductBind.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  /**操作人 */
  const operateBy = ref<string>('');
  /**绑定ID */
  const bindId = ref<string>('');

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: unbindFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true });
    operateBy.value = data.operateBy;

    bindId.value = data.record.id;
    await setFieldsValue({ qty: data.record.qty });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: false });
  });

  //设置标题
  const title = computed(() => '解绑');

  /**解绑 */
  function handleUnbind(values) {
    unbind({
      bindId: unref(bindId),
      qty: values.qty,
      reason: values.reason,
      operateBy: unref(operateBy),
    });
  }

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });

      handleUnbind(values);

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
