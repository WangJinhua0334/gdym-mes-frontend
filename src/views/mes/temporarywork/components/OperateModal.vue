<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { opFormSchema, operateType } from '../MesTemporaryWork.data';
  import { confirm, audit, cancelAudit, close } from '../MesTemporaryWork.api';

  // 任务ID列表
  let ids = ref(null);

  const emit = defineEmits(['register', 'success']);
  //表单配置
  const [registerForm, { setProps, resetFields, getFieldsValue, setFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: opFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    ids = data.ids;
    operateType.value = data.operateType;

    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  //设置标题
  const title = computed(() => {
    if (unref(operateType) === 'confirm') return '确认';
    else if (unref(operateType) === 'audit') return '审核';
    else if (unref(operateType) === 'cancelAudit') return '弃审';
    else if (unref(operateType) === 'close') return '关闭';
    else return '';
  });

  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      values.ids = ids;

      setModalProps({ confirmLoading: true });

      //提交表单
      if (unref(operateType) === 'confirm') await confirm(values);
      else if (unref(operateType) === 'audit') await audit(values);
      else if (unref(operateType) === 'cancelAudit') await cancelAudit(values);
      else if (unref(operateType) === 'close') await close(values);

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
