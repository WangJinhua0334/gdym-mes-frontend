<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref, reactive } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import {formReportEquipEvaluateSchema, formReportEquipRepairSchema} from '../EamEquipRepair.data';
import {
  reportEquipEvaluate,
  reportEquipRepair,
  update
} from '../EamEquipRepair.api';
// Emits声明
const emit = defineEmits(['register', 'success']);
const formDisabled = ref(false);
const refKeys = ref(['eamEquipRepairParts']);
const activeKey = ref('eamEquipRepairParts');
const eamEquipRepairParts = ref();
const tableRefs = { eamEquipRepairParts };
//表单配置
const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
  //labelWidth: 150,
  schemas: formReportEquipEvaluateSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 12 },
});
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //重置表单
  await reset();
  setModalProps({
    confirmLoading: false,
    showCancelBtn: data?.showFooter,
    showOkBtn: data?.showFooter,
  });
  formDisabled.value = !data?.showFooter;
  await setFieldsValue({
    ...data.record,
  });
  // 隐藏底部时禁用整个表单
  setProps({ disabled: !data?.showFooter });
});
//设置标题
const title = computed(() => "维修评价");

async function reset() {
  await resetFields();
}

//表单提交事件
async function handleSubmit() {
  try {
    let values = await validate();
    setModalProps({ confirmLoading: true });
    //提交表单
    await reportEquipEvaluate(values);
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
