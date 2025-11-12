<script setup lang="ts" name="mo-AnnealingStartwork">
  import { getFormSchema } from './AnnealingStartwork.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModal } from '@/components/Modal';
  import { saveOrUpdate } from './AnnealingStartwork.api';
  import { useMessage } from '@/hooks/web/useMessage';
  import { onMounted, ref, watch, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { defHttp } from '@/utils/http/axios';

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const loading = ref(false);
  
  // 称重校验状态标志
  const isWeightVerified = ref(false);
  
  // 权限放行弹窗相关
  const authUsername = ref('');
  const authPassword = ref('');
  const authLoading = ref(false);
  const warningModalInstance = ref<any>(null); // 存储警告弹窗实例
  // 用于防止浏览器自动填充的随机名称
  const randomNameSuffix = ref(Math.random().toString(36).substring(2, 15));
  
  // 权限放行弹窗注册
  const [registerAuthModal, { openModal: openAuthModal, closeModal: closeAuthModal }] = useModal();
  
  // 打开权限放行弹窗的函数，确保每次打开时输入框为空
  async function handleOpenAuthModal() {
    // 每次打开弹窗时，先清空用户名和密码，确保输入框为空
    authUsername.value = '';
    authPassword.value = '';
    authLoading.value = false;
    // 生成新的随机名称后缀，防止浏览器自动填充
    randomNameSuffix.value = Math.random().toString(36).substring(2, 15);
    // 打开弹窗
    openAuthModal();
    // 使用 nextTick 确保在弹窗完全打开后再次清空，防止浏览器自动填充
    await nextTick();
    // 再次清空，防止浏览器自动填充
    authUsername.value = '';
    authPassword.value = '';
  }
  
  //表单配置
  const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: getFormSchema(),
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });

  // 计算限定占比的函数（当范围值改变时调用）
  function calculateLimitedProportion() {
    const values = getFieldsValue();
    const exceptedWeight = parseFloat(values.exceptedWeight || 0);
    const rangeValue = parseFloat(values.rangeValue || 3); // 默认范围值为3
    
    // 如果标签重有值，计算限定占比
    if (exceptedWeight && exceptedWeight > 0 && rangeValue >= 0) {
      // 将范围值转换为小数（千分比转小数）
      const rangeDecimal = rangeValue / 1000;
      // 计算限定占比：标签重 × (1 + 范围值)
      const limitedProportion = exceptedWeight * (1 - rangeDecimal);
      // 设置限定占比字段的值
      setFieldsValue({
        limitedProportion: parseFloat(limitedProportion.toFixed(2)), // 保留两位小数
      });
    } else if (!exceptedWeight || exceptedWeight <= 0) {
      // 如果标签重为空，清空限定占比
      setFieldsValue({
        limitedProportion: undefined,
      });
    }
  }

  // 监听重量和标签重的变化，重置校验状态
  let isInitialized = false;
  watch(
    () => {
      try {
        const values = getFieldsValue();
        return {
          weight: values?.weight,
          exceptedWeight: values?.exceptedWeight,
          rangeValue: values?.rangeValue,
          oldCoilNo: values?.oldCoilNo,
        };
      } catch (e) {
        return null;
      }
    },
    (newVal, oldVal) => {
      // 跳过初始化时的第一次调用
      if (!isInitialized) {
        isInitialized = true;
        return;
      }
      // 如果新值为空，不处理
      if (!newVal) {
        return;
      }
      // 如果标签重或范围值发生变化，重新计算限定占比
      if (
        oldVal &&
        (newVal.exceptedWeight !== oldVal.exceptedWeight ||
          newVal.rangeValue !== oldVal.rangeValue)
      ) {
        calculateLimitedProportion();
      }
      // 如果重量、标签重、范围值或钢卷号发生变化，重置校验状态
      if (
        oldVal &&
        (newVal.weight !== oldVal.weight ||
          newVal.exceptedWeight !== oldVal.exceptedWeight ||
          newVal.rangeValue !== oldVal.rangeValue ||
          newVal.oldCoilNo !== oldVal.oldCoilNo)
      ) {
        isWeightVerified.value = false;
      }
    },
    { deep: true, immediate: false }
  );

  onMounted(() => {
    // 延迟一点时间确保表单完全初始化
    setTimeout(() => {
      setFieldsValue({
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      
      // 为范围值字段添加 onChange 事件（用户手动修改范围值时，需要重新计算限定占比）
      updateSchema([
        {
          field: 'rangeValue',
          componentProps: {
            onChange: () => {
              // 范围值改变时，重新计算限定占比
              calculateLimitedProportion();
            },
          },
        },
        // 为实际重量字段添加 onInput 和 onBlur 事件
        {
          field: 'weight',
          componentProps: {
            onInput: () => {
              // 输入时重置校验状态（因为输入改变了）
              isWeightVerified.value = false;
            },
            onBlur: () => {
              // 失去焦点时，格式化数字（保留两位小数）并触发验证
              nextTick(() => {
                const values = getFieldsValue();
                const currentWeight = values.weight;
                
                if (currentWeight !== null && currentWeight !== undefined && currentWeight !== '') {
                  let strValue = String(currentWeight).trim();
                  // 处理以小数点结尾的情况，如 "10." -> "10"
                  if (strValue.endsWith('.')) {
                    strValue = strValue.slice(0, -1);
                  }
                  // 检查是否是有效的数字（只允许数字和小数点，不允许字母或负号）
                  // 正则表达式允许：纯数字、数字+小数点、数字+小数点+数字
                  const numberRegex = /^\d+(\.\d*)?$/;
                  // 只有通过验证的有效数字才格式化，如果包含字母或其他无效字符，不格式化
                  if (numberRegex.test(strValue) && strValue !== '.' && strValue !== '') {
                    const numValue = parseFloat(strValue);
                    if (!isNaN(numValue) && isFinite(numValue) && numValue >= 0) {
                      // 格式化为两位小数，直接使用 toFixed(2) 返回的字符串
                      const formattedValue = numValue.toFixed(2);
                      // 只有当格式化后的值与当前值不同时才更新
                      if (formattedValue !== strValue && formattedValue !== String(currentWeight)) {
                        // 更新表单值
                        setFieldsValue({
                          weight: formattedValue,
                        });
                      }
                    }
                  } else {
                    // 如果输入的不是有效数字（包含字母等），不清空也不格式化
                    // 让验证规则来处理错误提示
                    // 这里不做任何处理，验证规则会在 trigger: ['change', 'blur'] 时触发
                  }
                }
              });
            },
          },
        },
      ]);
    }, 100);
  });
  //效验方法
  function verification() {
    // 获取当前表单值
    const values = getFieldsValue();
    // 检查实际重量是否有值（字段名是 weight）
    if (!values.weight || values.weight === '') {
      $message.createWarningModal({
        title: '提示',
        content: '请先填写实际重量',
        onOk: () => {
          console.log('请填写实际重量确认');
        },
      });
      return; // 阻止继续执行
    }
    // 将实际重量转换为字符串并验证格式
    const weightStr = String(values.weight).trim();
    // 只允许数字和小数点，不允许字母、负号或其他字符
    const numberRegex = /^\d+(\.\d+)?$/;
    if (!numberRegex.test(weightStr)) {
      // 检查是否包含字母
      if (/[a-zA-Z]/.test(weightStr)) {
        $message.createWarningModal({
          title: '提示',
          content: '请输入有效的数字，不能包含字母',
          onOk: () => {
            console.log('请输入有效数字确认');
          },
        });
      } else if (weightStr.includes('-')) {
        $message.createWarningModal({
          title: '提示',
          content: '实际重量不能为负数',
          onOk: () => {
            console.log('请输入有效数字确认');
          },
        });
      } else {
        $message.createWarningModal({
          title: '提示',
          content: '请输入有效的数字，不能包含特殊字符',
          onOk: () => {
            console.log('请输入有效数字确认');
          },
        });
      }
      return; // 阻止继续执行
    }
    // 获取标签重和范围值
    const exceptedWeight = parseFloat(values.exceptedWeight || 0);
    const rangeValue = parseFloat(values.rangeValue || 0);
    // 使用正确的字段名 weight，转换为数字
    const actualWeight = parseFloat(weightStr);
    // 检查转换后的数字是否有效
    if (isNaN(actualWeight) || !isFinite(actualWeight)) {
      $message.createWarningModal({
        title: '提示',
        content: '请输入有效的数字',
        onOk: () => {
          console.log('请输入有效数字确认');
        },
      });
      return; // 阻止继续执行
    }
    // 将范围值转换为小数（千分比转小数）
    const rangeDecimal = rangeValue / 1000;
    // 计算限定占比：标签重 × (1 - 范围值)，只保留两位小数
    const limitedProportion = parseFloat((exceptedWeight * (1 - rangeDecimal)).toFixed(2));

    // 设置限定占比字段的值
    setFieldsValue({
      limitedProportion: limitedProportion,
    });
    // 使用精度比较浮点数，处理浮点数精度问题
    // 校验规则：限定占比 <= 实际重量（包括等于的情况）

    // 比较实际重量和限定占比，如果实际重量 >= 限定占比，则提示通过，否则提示警告
    if (limitedProportion <= actualWeight) {
      // 校验通过，设置标志位
      isWeightVerified.value = true;
      // 使用 createSuccessModal 替代 createConfirm
      $message.createSuccessModal({
        title: '提示',
        content: '效验通过！',
        onOk: () => {
          console.log('效验通过确认');
        },
      });
    } else {
      // 校验未通过，重置标志位
      isWeightVerified.value = false;
      // 显示警告弹窗，包含两个按钮：确认、权限放行
      showWarningModal();
    }
  }

  // 显示警告弹窗
  function showWarningModal() {
    // 使用 createConfirm 创建自定义弹窗
    warningModalInstance.value = $message.createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '不在有效范围值内，需要检查核实，权限放行，原料标签不可进行工序领用生产',
      centered: true,
      maskClosable: false,
      okText: '权限放行',
      cancelText: '确认',
      okType: 'primary',
      onOk: () => {
        // 点击权限放行，打开权限放行弹窗
        // 返回 false 来阻止弹窗关闭（保持弹窗打开）
        handleOpenAuthModal();
        return false;
      },
      onCancel: () => {
        // 点击确认，关闭弹窗
        warningModalInstance.value = null;
      },
    });
  }

  // 权限放行弹窗 - 取消
  function handleAuthCancel() {
    closeAuthModal();
    // 清空输入框
    authUsername.value = '';
    authPassword.value = '';
  }

  // 权限放行弹窗 - 确认
  async function handleAuthConfirm() {
    if (!authUsername.value) {
      $message.createMessage.warning('请输入用户账户');
      return;
    }
    if (!authPassword.value) {
      $message.createMessage.warning('请输入账户密码');
      return;
    }

    authLoading.value = true;
    try {
      // 发送 POST 请求到后端接口
      const response = await defHttp.post({
        url: '/etl/receiptMaterial/login',
        params: {
          username: authUsername.value,
          password: authPassword.value,
        },
      }, { isTransformResponse: false });

      // 校验成功 - 根据实际后端返回的数据结构判断
      // 如果后端返回 { success: true } 或 { code: 200 } 或直接返回 true
      const isSuccess = (response && (
        response.success === true || 
        response.code === 200 || 
        response === true ||
        (typeof response === 'object' && Object.keys(response).length === 0) // 空对象也可能表示成功
      ));

      if (isSuccess) {
        // 权限放行成功，设置校验通过标志
        isWeightVerified.value = true;
        $message.createMessage.success('称重放权成功');
        // 关闭权限放行弹窗
        closeAuthModal();
        // 关闭警告弹窗
        if (warningModalInstance.value) {
          warningModalInstance.value.destroy();
          warningModalInstance.value = null;
        }
        // 清空输入框
        authUsername.value = '';
        authPassword.value = '';
      } else {
        // 校验失败
        const errorMsg = response?.message || response?.msg || '用户名或密码错误';
        $message.createMessage.error(errorMsg);
        // 不刷新输入框，只清空密码
        authPassword.value = '';
      }
    } catch (error: any) {
      // 处理错误
      console.error('权限放行失败:', error);
      const errorMsg = error?.response?.data?.message || error?.message || '用户名或密码错误';
      $message.createMessage.error(errorMsg);
      // 不刷新输入框，只清空密码
      authPassword.value = '';
    } finally {
      authLoading.value = false;
    }
  }

  // 添加 handleSubmit 方法（参考冷轧开工的实现）
  async function handleSubmit() {
    loading.value = true;
    try {
      // 验证表单
      const values = await validate();
      
      // 检查是否已通过称重校验
      if (!isWeightVerified.value) {
        $message.createWarningModal({
          title: '提示',
          content: '请先进行称重校验，校验通过后才能进行扫码开工',
          onOk: () => {
            console.log('请先进行称重校验确认');
          },
        });
        loading.value = false;
        return; // 阻止继续执行
      }
      
      // 添加设备校验
      if (!values.equipmentId) {
        $message.createWarningModal({
          title: '提示',
          content: '请选择设备',
          onOk: () => {
            console.log('请先选择设备确认');
          },
        });
        loading.value = false;
        return; // 阻止继续执行
      }
      // 确保 weight 字段在提交前转换为数字类型（如果后端需要数字类型）
      const submitValues = {
        ...values,
        weight: parseFloat(String(values.weight || 0)),
      };
      await requestAddOrEdit(submitValues);
      // 提交成功后重置校验状态
      isWeightVerified.value = false;
      await resetFields();
      setFieldsValue({
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
    } catch (error) {
      // 处理验证错误
      console.log('验证失败:', error);
    } finally {
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
      <a-button @click="verification" type="primary">效验</a-button>
      <a-button @click="handleSubmit" :loading="loading" type="primary">扫码开工</a-button>
    </div>
    
    <!-- 权限放行弹窗 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerAuthModal"
      destroyOnClose
      title="详细信息"
      :width="400"
      :showOkBtn="true"
      :showCancelBtn="true"
      okText="确认"
      cancelText="取消"
      :confirmLoading="authLoading"
      @ok="handleAuthConfirm"
      @cancel="handleAuthCancel"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" autocomplete="off">
        <a-form-item label="用户账户" required>
          <a-input
            v-model:value="authUsername"
            placeholder="请输入用户账户"
            :disabled="authLoading"
            autocomplete="off"
            :name="`auth-username-${randomNameSuffix}`"
          />
        </a-form-item>
        <a-form-item label="账户密码" required>
          <a-input-password
            v-model:value="authPassword"
            placeholder="请输入账户密码"
            :disabled="authLoading"
            autocomplete="new-password"
            :name="`auth-password-${randomNameSuffix}`"
            @pressEnter="handleAuthConfirm"
          />
        </a-form-item>
      </a-form>
    </BasicModal>
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
