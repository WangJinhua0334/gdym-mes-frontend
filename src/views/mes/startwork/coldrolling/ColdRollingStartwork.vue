<script setup lang="ts" name="mo-ColdRollingStartwork">
  import {
    getFormSchema,
    COLD_ROLLING_COIL_INPUT_ID,
    COLD_ROLLING_START_TIME_ID,
  } from './ColdRollingStartwork.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { saveOrUpdate } from './ColdRollingStartwork.api';
  import { useMessage } from '@/hooks/web/useMessage';
  import { onMounted, ref, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { defHttp } from '@/utils/http/axios';

  const $message = useMessage();
  const emit = defineEmits(['register', 'success']);
  const loading = ref(false);
  const previousQualityReport = ref('');
  let coilRequestId = 0;

  function focusInputById(id: string) {
    nextTick(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.focus();
      });
    });
  }

  const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields }] = useForm({
    labelWidth: 160,
    schemas: getFormSchema({
      onQueryCoil: queryCoilByNo,
      onCoilChange: handleCoilChange,
    }),
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });

  function clearCoilFields() {
    coilRequestId++;
    previousQualityReport.value = '';
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
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  function handleCoilChange(e: Event | string) {
    const v = typeof e === 'string' ? e : (e?.target as HTMLInputElement)?.value;
    if (v === undefined || v === null || String(v).trim() === '') {
      clearCoilFields();
      return;
    }
    coilRequestId++;
    previousQualityReport.value = '';
    setFieldsValue({
      flowCardId: undefined,
      materialId: undefined,
      materialNumber: undefined,
      materialName: undefined,
      modelNumber: undefined,
      updateTime: undefined,
      exceptedWeight: undefined,
      weight: undefined,
    });
  }

  /** GET /etl/rolling/start/getByCoilNo */
  async function queryCoilByNo() {
    const coilNo = String(getFieldsValue()?.oldCoilNo ?? '').trim();
    if (!coilNo) {
      $message.createMessage.warning('请输入钢卷号');
      return;
    }
    const requestId = ++coilRequestId;
    previousQualityReport.value = '';
    try {
      const d: any = await defHttp.get(
        {
          url: '/etl/rolling/start/getByCoilNo',
          params: { coilNo },
        },
        { successMessageMode: 'none' }
      );
      if (requestId !== coilRequestId || String(getFieldsValue()?.oldCoilNo ?? '').trim() !== coilNo) return;
      if (!d) {
        $message.createMessage.warning('未找到钢卷数据');
        return;
      }
      const endW = d.endWeight;
      await setFieldsValue({
        flowCardId: d.cardId,
        oldCoilNo: d.newCoilNo,
        materialId: d.newMaterialId,
        materialNumber: d.newMaterialNumber,
        materialName: d.newMaterialName,
        modelNumber: d.newModelNumber,
        updateTime: d.updateTime || d.createTime,
        exceptedWeight: endW,
        weight: endW,
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      if (requestId !== coilRequestId || String(getFieldsValue()?.oldCoilNo ?? '').trim() !== d.newCoilNo) return;
      previousQualityReport.value = d.qualityReport ?? '';
      $message.createMessage.success(`获取成功: ${d.newCoilNo}`);
      focusInputById(COLD_ROLLING_START_TIME_ID);
    } catch (error: any) {
      if (requestId !== coilRequestId || String(getFieldsValue()?.oldCoilNo ?? '').trim() !== coilNo) return;
      previousQualityReport.value = '';
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        '查询钢卷失败';
      $message.createMessage.error(msg);
    }
  }

  async function handleSubmit() {
    loading.value = true;
    try {
      const values = await validate();
      const w = values.weight ?? values.exceptedWeight;
      await requestAddOrEdit({
        ...values,
        weight: parseFloat(String(w ?? 0)),
      });
      await resetFields();
      coilRequestId++;
      previousQualityReport.value = '';
      setFieldsValue({
        startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      focusInputById(COLD_ROLLING_COIL_INPUT_ID);
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
    }, 100);
  });
</script>

<template>
  <div class="custom-form-wrapper mes-process-page-bold">
    <BasicForm @register="registerForm" :width="896" />
    <div class="previous-production-data">
      <div class="previous-production-label">上一道工序生产数据</div>
      <div class="previous-production-value">{{ previousQualityReport || '-' }}</div>
    </div>
    <div class="button-container">
      <a-button @click="handleSubmit" :loading="loading" type="primary">开工</a-button>
    </div>
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
  .previous-production-data {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    margin: 8px 0 16px;
    background: #fafafa;
    border-radius: 4px;
  }
  .previous-production-label {
    flex: 0 0 160px;
    font-weight: 600;
  }
  .previous-production-value {
    min-width: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
</style>
