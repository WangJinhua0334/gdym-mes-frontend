<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <!-- 子表单区域 -->
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { detailReturnFormSchema } from '../MesProductReturn.data';
  import { returnDetail } from '../MesProductReturn.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, getFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: detailReturnFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true });

    console.log(data);

    //表单赋值
    await setFieldsValue({
      ...data,
    });
  });

  //设置标题
  const title = computed(() => '退料');

  async function reset() {
    await resetFields();
  }

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      let values = await validate();
      await returnDetail({ ...values }).then(() => {
        //关闭弹窗
        closeModal();

        //刷新列表
        emit('success');
      });
    } catch (error) {
      console.log(error.message);
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
