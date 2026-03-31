<script setup lang="ts" name="mo-AnnealingStartwork">
  import {
    getFormSchema,
    ANNEALING_COIL_INPUT_ID,
    ANNEALING_WEIGHT_INPUT_ID,
  } from './AnnealingStartwork.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModal } from '@/components/Modal';
  import { saveOrUpdate } from './AnnealingStartwork.api';
  import { useMessage } from '@/hooks/web/useMessage';
  import { onMounted, ref, nextTick, watch } from 'vue';
  import dayjs from 'dayjs';
  import { defHttp } from '@/utils/http/axios';

  const $message = useMessage();
  const emit = defineEmits(['register', 'success']);
  const loading = ref(false);
  const isWeightVerified = ref(false);

  const authUsername = ref('');
  const authPassword = ref('');
  const authLoading = ref(false);
  const warningModalInstance = ref<any>(null);
  const randomNameSuffix = ref(Math.random().toString(36).substring(2, 15));

  const [registerAuthModal, { openModal: openAuthModal, closeModal: closeAuthModal }] = useModal();

  async function handleOpenAuthModal() {
    authUsername.value = '';
    authPassword.value = '';
    authLoading.value = false;
    randomNameSuffix.value = Math.random().toString(36).substring(2, 15);
    openAuthModal();
    await nextTick();
    authUsername.value = '';
    authPassword.value = '';
  }

  function focusInputById(id: string) {
    nextTick(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.focus();
      });
    });
  }

  const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: getFormSchema({
      onQueryCoil: queryCoilByNo,
      onCoilChange: handleCoilChange,
      onWeightPressEnter: () => {
        verification();
      },
      onWeightChange: () => {
        isWeightVerified.value = false;
      },
      onWeightBlur: () => {
        nextTick(() => {
          normalizeActualWeightToThreeDecimals();
        });
      },
    }),
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });

  function clearCoilFields() {
    setFieldsValue({
      flowCardId: undefined,
      oldCoilNo: '',
      materialId: undefined,
      materialNumber: undefined,
      materialName: undefined,
      modelNumber: undefined,
      updateTime: undefined,
      exceptedWeight: undefined,
      weight: undefined,
      limitedProportion: undefined,
      rangeValue: 3,
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    isWeightVerified.value = false;
  }

  function handleCoilChange(e: Event | string) {
    const v = typeof e === 'string' ? e : (e?.target as HTMLInputElement)?.value;
    if (v === undefined || v === null || String(v).trim() === '') {
      clearCoilFields();
    }
  }

  /** GET /etl/annealing/start/getByCoilNo */
  async function queryCoilByNo() {
    const coilNo = String(getFieldsValue()?.oldCoilNo ?? '').trim();
    if (!coilNo) {
      $message.createMessage.warning('请输入钢卷号');
      return;
    }
    try {
      const d: any = await defHttp.get(
        {
          url: '/etl/annealing/start/getByCoilNo',
          params: { coilNo },
        },
        { successMessageMode: 'none' }
      );
      if (!d) {
        $message.createMessage.warning('未找到钢卷数据');
        return;
      }
      const ew = parseFloat(String(d.endWeight ?? ''));
      const rangeVal = 3;
      const rangeDec = rangeVal / 1000;
      const limitedProportion =
        !isNaN(ew) && ew > 0 ? parseFloat((ew * (1 - rangeDec)).toFixed(3)) : undefined;

      await setFieldsValue({
        flowCardId: d.cardId,
        oldCoilNo: d.newCoilNo,
        materialId: d.newMaterialId,
        materialNumber: d.newMaterialNumber,
        materialName: d.newMaterialName,
        modelNumber: d.newModelNumber,
        updateTime: d.updateTime || d.createTime,
        exceptedWeight: d.endWeight,
        weight: undefined,
        rangeValue: 3,
        limitedProportion,
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      isWeightVerified.value = false;
      $message.createMessage.success(`获取成功: ${d.newCoilNo}`);
      focusInputById(ANNEALING_WEIGHT_INPUT_ID);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        '查询钢卷失败';
      $message.createMessage.error(msg);
    }
  }

  function calculateLimitedProportion() {
    const values = getFieldsValue();
    const exceptedWeight = parseFloat(String(values.exceptedWeight || 0));
    const rangeValue =
      values.rangeValue === null || values.rangeValue === undefined || values.rangeValue === ''
        ? 3
        : Number(values.rangeValue);

    if (exceptedWeight && exceptedWeight > 0 && rangeValue >= 0) {
      const rangeDecimal = rangeValue / 1000;
      const limitedProportion = exceptedWeight * (1 - rangeDecimal);
      setFieldsValue({
        limitedProportion: parseFloat(limitedProportion.toFixed(3)),
      });
    } else if (!exceptedWeight || exceptedWeight <= 0) {
      setFieldsValue({
        limitedProportion: undefined,
      });
    }
  }

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
      } catch {
        return null;
      }
    },
    (newVal, oldVal) => {
      if (!isInitialized) {
        isInitialized = true;
        return;
      }
      if (!newVal) return;
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

  function normalizeActualWeightToThreeDecimals() {
    const values = getFieldsValue();
    const w = values.weight;
    if (w === null || w === undefined || w === '') return;
    const numValue = typeof w === 'number' ? w : parseFloat(String(w).trim());
    if (isNaN(numValue) || !isFinite(numValue) || numValue < 0) return;
    setFieldsValue({
      weight: parseFloat(numValue.toFixed(3)),
    });
  }

  function verification() {
    normalizeActualWeightToThreeDecimals();

    const values = getFieldsValue();
    if (!values.weight || values.weight === '') {
      $message.createWarningModal({
        title: '提示',
        content: '请先填写实际重量',
      });
      return;
    }

    const weightStr =
      typeof values.weight === 'number'
        ? String(values.weight)
        : String(values.weight ?? '').trim();
    const numberRegex = /^\d+(\.\d+)?$/;
    if (!numberRegex.test(weightStr)) {
      if (/[a-zA-Z]/.test(weightStr)) {
        $message.createWarningModal({ title: '提示', content: '请输入有效的数字，不能包含字母' });
      } else if (weightStr.includes('-')) {
        $message.createWarningModal({ title: '提示', content: '实际重量不能为负数' });
      } else {
        $message.createWarningModal({ title: '提示', content: '请输入有效的数字，不能包含特殊字符' });
      }
      return;
    }

    const labelWeight = parseFloat(String(values.exceptedWeight || 0));
    const rangePerThousand =
      values.rangeValue === null || values.rangeValue === undefined || values.rangeValue === ''
        ? 3
        : Number(values.rangeValue);
    const actualWeight = parseFloat(weightStr);

    if (isNaN(actualWeight) || !isFinite(actualWeight)) {
      $message.createWarningModal({ title: '提示', content: '请输入有效的数字' });
      return;
    }

    const rangeDecimal = rangePerThousand / 1000;
    const threshold = labelWeight * (1 - rangeDecimal);
    setFieldsValue({
      limitedProportion: parseFloat(threshold.toFixed(3)),
    });

    if (actualWeight >= threshold - 1e-9) {
      isWeightVerified.value = true;
      $message.createSuccessModal({
        title: '提示',
        content: '效验通过！',
      });
    } else {
      isWeightVerified.value = false;
      showWarningModal();
    }
  }

  function showWarningModal() {
    warningModalInstance.value = $message.createConfirm({
      iconType: 'warning',
      title: '警告',
      content:
        '不在有效范围值内，需要检查核实，权限放行，原料标签不可进行工序领用生产，是否权限放行？',
      centered: true,
      maskClosable: false,
      okText: '权限放行',
      cancelText: '确认',
      okType: 'primary',
      onOk: () => {
        handleOpenAuthModal();
        return false;
      },
      onCancel: () => {
        warningModalInstance.value = null;
      },
    });
  }

  function handleAuthCancel() {
    closeAuthModal();
    authUsername.value = '';
    authPassword.value = '';
  }

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
      const response = await defHttp.post(
        {
          url: '/etl/receiptMaterial/login',
          params: {
            username: authUsername.value,
            password: authPassword.value,
          },
        },
        { isTransformResponse: false }
      );

      const isSuccess =
        response &&
        (response.success === true ||
          response.code === 200 ||
          response === true ||
          (typeof response === 'object' && Object.keys(response).length === 0));

      if (isSuccess) {
        isWeightVerified.value = true;
        $message.createMessage.success('称重放权成功');
        closeAuthModal();
        if (warningModalInstance.value) {
          warningModalInstance.value.destroy();
          warningModalInstance.value = null;
        }
        authUsername.value = '';
        authPassword.value = '';
      } else {
        const errorMsg = response?.message || response?.msg || '用户名或密码错误';
        $message.createMessage.error(errorMsg);
        authPassword.value = '';
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || '用户名或密码错误';
      $message.createMessage.error(errorMsg);
      authPassword.value = '';
    } finally {
      authLoading.value = false;
    }
  }

  async function handleSubmit() {
    loading.value = true;
    try {
      const values = await validate();

      if (!isWeightVerified.value) {
        $message.createWarningModal({
          title: '提示',
          content: '请先进行称重校验，校验通过后才能开工',
        });
        loading.value = false;
        return;
      }

      const submitValues = {
        ...values,
        weight: parseFloat(String(values.weight || 0)),
      };
      await requestAddOrEdit(submitValues);
      isWeightVerified.value = false;
      await resetFields();
      setFieldsValue({
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      focusInputById(ANNEALING_COIL_INPUT_ID);
    } catch (error) {
      console.log('验证失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function requestAddOrEdit(values) {
    try {
      await saveOrUpdate(values);
      emit('success');
      $message.createMessage.success('开工成功');
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      setFieldsValue({
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      updateSchema([
        {
          field: 'rangeValue',
          componentProps: {
            onChange: () => {
              calculateLimitedProportion();
            },
          },
        },
      ]);
    }, 100);
  });
</script>

<template>
  <div class="custom-form-wrapper mes-process-page-bold">
    <BasicForm @register="registerForm" :width="896" />
    <div class="button-container">
      <a-button @click="verification" type="primary">校验</a-button>
      <a-button @click="handleSubmit" :loading="loading" type="primary">开工</a-button>
    </div>

    <BasicModal
      v-bind="$attrs"
      @register="registerAuthModal"
      destroyOnClose
      title="权限放行"
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

<style scoped lang="less">
  @import url('../../styles/mesProcessPageBold.less');
  .custom-form-wrapper {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    min-height: calc(100vh - 40px);
  }
  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
</style>
