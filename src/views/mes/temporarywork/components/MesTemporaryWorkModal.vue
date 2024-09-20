<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :width="800" @ok="handleSubmit">
    <!-- <BasicForm @register="registerForm" /> -->
    <MesTemporaryWork ref="temporaryWorkRef" :componentData="viewData" @close="closeModal" @success="handleSubmit" />
  </BasicModal>
</template>

<script lang="ts" name="MesTemporaryWork" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  //import { BasicForm, useForm } from '/@/components/Form/index';
  import MesTemporaryWork from './MesTemporaryWork.vue';
  //import { formSchema, viewType } from '../MesTemporaryWork.data';
  //import { saveOrUpdate } from '../MesTemporaryWork.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const temporaryWorkRef = ref();
  const viewData: any = ref({});

  //表单配置
  /*const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });*/

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    //await resetFields();
    const title = unref(data.viewType) === 'add' ? '新增' : unref(data.viewType) === 'edit' ? '编辑' : '详情';
    setModalProps({ confirmLoading: false, title: title, showCancelBtn: false, showOkBtn: false, footer: null });

    viewData.value.viewType = data.viewType;
    viewData.value.isUpdate = !!data?.isUpdate;
    viewData.value.showFooter = !!data?.showFooter;

    if (!!data?.isUpdate) {
      viewData.value.record = data.record;
    }

    /*if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }*/

    // 隐藏底部时禁用整个表单
    //setProps({ disabled: !data?.showFooter });
  });

  //表单提交事件
  async function handleSubmit() {
    /*try {
      let values = await validate();
      values.startTime = getFieldsValue().startTime;
      values.completeTime = getFieldsValue().completeTime;

      setModalProps({ confirmLoading: true });

      //提交表单
      await saveOrUpdate(values, isUpdate.value);

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }*/

    closeModal();
    emit('success');
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
