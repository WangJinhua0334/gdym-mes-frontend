<script setup lang="ts" name="mo-StaticPullStartwork">
import { getFormSchema } from './StaticPullStartwork.data';
import { BasicForm, useForm } from '@/components/Form';
import { saveOrUpdate } from './StaticPullStartwork.api';
import { useMessage } from '@/hooks/web/useMessage';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';

// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);

const loading = ref(false);

onMounted(() => {
  // 延迟一点时间确保表单完全初始化
  setTimeout(() => {
    setFieldsValue({
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }, 100);
});

//表单配置
const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields }] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
/*//效验方法
function verification() {
// 获取当前表单值
const values = getFieldsValue();
// 检查实际重量是否有值
if (!values.actualWeight) {
  $message.createWarningModal({
    title: '提示',
    content: '请先填写实际重量',
    onOk: () => {
      console.log('请填写实际重量确认');
    }
  });
  return; // 阻止继续执行
}
// 获取标签重和范围值
const exceptedWeight = parseFloat(values.exceptedWeight || 0);
const rangeValue = parseFloat(values.rangeValue || 0);
const actualWeight = parseFloat(values.actualWeight  || 0);
// 将范围值转换为小数（千分比转小数）
const rangeDecimal = rangeValue / 1000;
// 计算限定占比：标签重 × (1 + 范围值)
const limitedProportion = exceptedWeight * (1 + rangeDecimal);
// 设置限定占比字段的值
setFieldsValue({
  limitedProportion: limitedProportion.toFixed(2) // 保留两位小数
});
// 比较实际重量和限定占比，如果实际重量小于限定占比，则提示通过，否则提示警告
if (actualWeight < limitedProportion) {
  // 使用 createSuccessModal 替代 createConfirm
  $message.createSuccessModal({
    title: '提示',
    content: '效验通过！',
    onOk: () => {
      console.log('效验通过确认');
    }
  });
} else {
  // 使用 createWarningModal 替代 createConfirm
  $message.createWarningModal({
    title: '警告',
    content: '不在有效范围值内，需要检查核实，权限放行，原料标签不可进行工序领用生产',
    onOk: () => {
      console.log('警告确认');
    }
  });
}
}*/
// 添加 handleSubmit 方法
async function handleSubmit() {
  loading.value = true;
  try {
    // 验证表单
    const values = await validate();
    await requestAddOrEdit(values);
    await resetFields();
    setFieldsValue({
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
  } catch (error) {
    // 处理验证错误
    console.log('验证失败:', error);
  }finally {
    loading.value = false;
  }
}
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    //提交表单
    await saveOrUpdate(values);
    //清空表单数据
    await resetFields();
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="custom-form-wrapper">
    <BasicForm @register="registerForm" :width="896" />
    <div class="button-container">
      <!--      <a-button @click="verification" type="primary">效验</a-button>-->
      <a-button @click="handleSubmit" :loading = "loading" type="primary">打码开工</a-button>
    </div>
  </div>
</template>

<style scoped>
.custom-form-wrapper {
  background-color: white; /* 设置背景颜色 */
  padding: 20px; /* 可选：添加内边距 */
  border-radius: 4px; /* 可选：添加圆角 */
  min-height: calc(100vh - 40px);
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
