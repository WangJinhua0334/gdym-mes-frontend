<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="'编辑收料记录'"
    :width="800"
    :height="400"
    wrapClassName="incoming-note-edit-modal"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <datalist id="incoming-note-license-datalist">
      <option v-for="value in licenseHistoryList" :key="`license-${value}`" :value="value" />
    </datalist>
    <datalist id="incoming-note-product-datalist">
      <option v-for="value in productHistoryList" :key="`product-${value}`" :value="value" />
    </datalist>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { editFormSchema } from '../IncomingNote.data';
  import { edit } from '../IncomingNote.api';
  import { useUserStore } from '@/store/modules/user';

  const emit = defineEmits(['register', 'success']);
  const userStore = useUserStore();
  const INPUT_CACHE_KEY = 'incoming_note_last_input';
  const licenseHistoryList = ref<string[]>([]);
  const productHistoryList = ref<string[]>([]);

  function getInputCacheKey() {
    const tenant = String(userStore.getTenant || 'default');
    return `${INPUT_CACHE_KEY}:${tenant}`;
  }

  function loadInputCache() {
    licenseHistoryList.value = [];
    productHistoryList.value = [];
    try {
      const raw = localStorage.getItem(getInputCacheKey());
      if (!raw) return;
      const cached = JSON.parse(raw) as { licensePlateNumber?: unknown; materialDesc?: unknown };
      const licensePlateNumber = String(cached?.licensePlateNumber ?? '').trim();
      const materialDesc = String(cached?.materialDesc ?? '').trim();
      if (licensePlateNumber) licenseHistoryList.value = [licensePlateNumber];
      if (materialDesc) productHistoryList.value = [materialDesc];
    } catch (error) {
      console.warn('读取收料单输入缓存失败:', error);
    }
  }

  function cacheInputField(field: 'licensePlateNumber' | 'materialDesc', value: unknown) {
    const inputValue = String(value ?? '').trim();
    if (!inputValue) return;
    const cached = {
      licensePlateNumber: licenseHistoryList.value[0] ?? '',
      materialDesc: productHistoryList.value[0] ?? '',
    };
    cached[field] = inputValue;
    persistInputCache(cached);
  }

  function persistInputCache(cached: { licensePlateNumber: string; materialDesc: string }) {
    try {
      localStorage.setItem(getInputCacheKey(), JSON.stringify(cached));
    } catch (error) {
      console.warn('保存收料单输入缓存失败:', error);
    }
    licenseHistoryList.value = cached.licensePlateNumber ? [cached.licensePlateNumber] : [];
    productHistoryList.value = cached.materialDesc ? [cached.materialDesc] : [];
  }

  const formSchemaWithCache = editFormSchema.map((schema) => {
    if (schema.field !== 'licensePlateNumber' && schema.field !== 'materialDesc') return schema;
    const field = schema.field as 'licensePlateNumber' | 'materialDesc';
    const componentProps = (schema.componentProps || {}) as Record<string, unknown>;
    return {
      ...schema,
      componentProps: {
        ...componentProps,
        onBlur: (event: FocusEvent) => cacheInputField(field, (event.target as HTMLInputElement)?.value),
      },
    };
  });

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 200,
    schemas: formSchemaWithCache,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    try {
      loadInputCache();
      await resetFields();
      setModalProps({
        confirmLoading: false,
        showCancelBtn: !!data?.showFooter,
        showOkBtn: !!data?.showFooter,
      });
      if (unref(data?.isUpdate) && data?.record) {
        const record = { ...data.record };
        if (record.supplierId != null) {
          record.supplierId = String(record.supplierId);
        }
        if (record.firstOperationNumber != null && record.firstOperationNumber !== '') {
          record.firstOperationNumber = String(record.firstOperationNumber);
        }
        await setFieldsValue(record);
      }
    } catch (error) {
      console.error('Error in useModalInner callback:', error);
    }
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const submitValues = { ...values };
      setModalProps({ confirmLoading: true });
      await edit(submitValues);
      closeModal();
      emit('success');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleCancel() {
    closeModal();
  }
</script>

<style scoped lang="less"></style>

<!-- 弹窗内容通过 teleport 渲染，需用非 scoped 样式 + wrapClassName 限定作用域 -->
<style lang="less">
  .incoming-note-edit-modal {
    /* 长标签（如「收料后的第一道工序」）可换行，避免与控件横向挤压重叠 */
    .ant-form-item-label {
      white-space: normal;
      line-height: 1.45;
    }
    .ant-form-item-label > label {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
      height: auto;
      white-space: normal;
    }
    .ant-input,
    .ant-input-number-input,
    .ant-picker-input > input,
    .ant-select-selection-item,
    .ant-radio-button-wrapper {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    .ant-input-number.ant-input-number-disabled .ant-input-number-input {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.88);
    }
    input[list='incoming-note-license-datalist']::-webkit-calendar-picker-indicator,
    input[list='incoming-note-product-datalist']::-webkit-calendar-picker-indicator,
    input[list='incoming-note-license-datalist']::-webkit-list-button,
    input[list='incoming-note-product-datalist']::-webkit-list-button {
      display: none !important;
    }
  }
</style>
