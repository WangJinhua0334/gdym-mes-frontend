<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit" @cancel="handleCancel">
    <BasicForm @register="registerForm" name="MesReceiveForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../MesIncoming.data';
  import { saveOrUpdate } from '../MesIncoming.api';
  import dayjs from "dayjs";
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(false);
  
  // 物料说明缓存 key
  const MATERIAL_DESC_CACHE_KEY = 'mes_incoming_material_desc';
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, scrollToField, getFieldsValue }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    isDetail.value = !!data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    } else {
      // 新增模式：设置最新的入库时间和恢复物料说明
      const savedMaterialDesc = sessionStorage.getItem(MATERIAL_DESC_CACHE_KEY) || '';
      await setFieldsValue({
        inStockTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        materialDesc: savedMaterialDesc,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(isDetail) ? '详情' : '编辑'));
  
  /**
   * 更新时间字段
   */
  function updateTimeField() {
    // 更新入库时间字段
    setFieldsValue({
      inStockTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  
  /**
   * 保存物料说明到缓存
   */
  function saveMaterialDesc() {
    try {
      const formValues = getFieldsValue();
      const materialDesc = formValues?.materialDesc || '';
      // 无论是否有值都保存，这样清空后下次打开也是空的
      sessionStorage.setItem(MATERIAL_DESC_CACHE_KEY, materialDesc);
    } catch (error) {
      console.error('保存物料说明失败:', error);
    }
  }
  
  /**
   * 取消/关闭事件处理
   */
  function handleCancel() {
    // 在关闭前更新时间字段和保存物料说明
    updateTimeField();
    // 只在新增模式下保存物料说明
    if (!unref(isUpdate)) {
      saveMaterialDesc();
    }
  }
  
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      console.log(values)
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      // 打印标签

      // 在关闭前更新时间字段
      updateTimeField();
      
      // 提交成功后保存物料说明（新增模式下保留，编辑模式下不保留）
      if (!unref(isUpdate)) {
        saveMaterialDesc();
      }
      
      //关闭弹窗
      closeModal();
      //刷新列表，并传递钢卷号用于自动打印（仅新增模式下）
      const coilNumber = values?.coilNo || values?.internalCoilNumber;
      console.log('收料提交成功，表单数据:', values);
      console.log('提取的钢卷号:', coilNumber);
      console.log('是否为新增模式:', !unref(isUpdate));
      emit('success', !unref(isUpdate) && coilNumber ? { coilNumber } : null);
    } catch (error: any) {
      const errorFields = error?.errorFields;
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          scrollToField(firstField.name, { behavior: 'smooth' });
        }
      }
      return Promise.reject(error);
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
