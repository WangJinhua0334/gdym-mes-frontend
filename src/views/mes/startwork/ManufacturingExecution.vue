<script setup lang="ts" name="mo-ManufacturingExecution">
import { getFormSchema } from './ManufacturingExecution.ts';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "@/views/mes/startwork/ManufacturingExecution.api";
import {useMessage} from "@/hooks/web/useMessage";

// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);

//表单配置
const [registerForm,{validate}] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});

// 添加 handleSubmit 方法
async function handleSubmit() {
  try {
    // 验证表单
    const values = await validate();
    // 调用提交方法
    await requestAddOrEdit(values);
  } catch (error) {
    // 处理验证错误
    console.log('表单验证失败:', error);
  }
}
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    //提交表单
    await saveOrUpdate(values);
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
    <div class="custom-form-wrapper">
      <BasicForm @register="registerForm" :width="896"/>
      <a-button @click="handleSubmit" type="primary" >扫码开工</a-button>
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
