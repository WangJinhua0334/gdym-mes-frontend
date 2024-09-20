<template>
  <BasicModal v-bind="$attrs" @register="registerBomSelectModal" destroyOnClose :title="'BOM选择'" @ok="handleSubmit" :width="896">
    <BasicForm @register="registerBomSelectForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, bomProdId } from './ProductBomSelect.data';

  const emit = defineEmits(['register', 'callBack']);

  //表单配置
  const [registerBomSelectForm, { resetFields, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerBomSelectModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    bomProdId.value = data.bomProdId;
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
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('callBack', values);
    } catch (error) {
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped></style>
