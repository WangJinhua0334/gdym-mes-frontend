<script setup lang="ts">
import {ref, reactive, unref} from 'vue';
import { getFormSchema } from './ManufacturingExecution.ts';
import {BasicForm, useForm} from "@/components/Form";
import {workflowId} from "@/views/bas/workflow/BasWorkflowStation.data";
import {BasicModal} from "@/components/Modal";

//表单配置
const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
// 表单数据模型
const formModel = reactive({});
// 重置表单

/**
 * 提交领料开工
 */
async function handleSubmit() {

}
</script>

<template>
    <div class="custom-form-wrapper">
      <BasicForm @register="registerForm" />
      <a-button @click="handleSubmit" type="primary" :loading="loading">领料开工</a-button>
    </div>
</template>

<style scoped>.custom-form-wrapper{
  background-color: white; /* 设置背景颜色 */
  padding: 20px; /* 可选：添加内边距 */
  border-radius: 4px; /* 可选：添加圆角 */
  min-height: calc(100vh - 40px);
  box-sizing: border-box;
  overflow: hidden; /* 隐藏溢出内容 */
}

</style>
