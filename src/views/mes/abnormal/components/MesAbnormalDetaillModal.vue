<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { detailFormSchema } from '../MesAbnormal.data';
  import { queryById } from '../MesAbnormal.api';

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue }] = useForm({
    labelWidth: 150,
    schemas: detailFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();

    setModalProps({ confirmLoading: false, showOkBtn: false, showCancelBtn: true, cancelText: '返回' });

    await queryById({ id: data.record.id }).then((res) => {
      //表单赋值
      setFieldsValue({
        ...res,
      });
    });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: true });
  });

  //设置标题
  const title = computed(() => '详情');
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
