<template>
  <BasicForm @register="registerRepairDefectForm" ref="formRef"/>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, watch, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './DefectModal.data';
  const emit = defineEmits(['addRefs']);

  const formRef = ref();
  const props = defineProps({
    defect: {
      type: Object,
      default: undefined,
    },
  });
  onMounted(() => {
    if (props.defect) {
      setFieldsValue({ ...props.defect });
      emit('addRefs', formRef);
    }
  });

  //表单配置
  const [registerRepairDefectForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  function getFormValue() {
    console.log(666);
    console.log(formRef);
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
