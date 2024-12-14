<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" name="ModMouldRepairForm" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="模具维修配件表" key="modMouldRepairParts" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="modMouldRepairParts"
          :loading="modMouldRepairPartsTable.loading"
          :columns="modMouldRepairPartsTable.columns"
          :dataSource="modMouldRepairPartsTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { repairFormSchema, modMouldRepairPartsJVxeColumns, modDetailMouldRepairPartsJVxeColumns } from '../ModMouldRepair.data';
  import { endRepair, queryModMouldRepairParts } from '../ModMouldRepair.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['modMouldRepairParts']);
  const activeKey = ref('modMouldRepairParts');
  const modMouldRepairParts = ref();
  const tableRefs = { modMouldRepairParts };
  const modMouldRepairPartsTable = reactive({
    loading: false,
    dataSource: [],
    columns: modMouldRepairPartsJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    schemas: repairFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      if (formDisabled.value) {
        modMouldRepairPartsTable.columns = modDetailMouldRepairPartsJVxeColumns;
      }
      requestSubTableData(queryModMouldRepairParts, { id: data?.record?.id }, modMouldRepairPartsTable);
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '维修完成' : !unref(formDisabled) ? '维修完成' : '详情'));

  async function reset() {
    await resetFields();
    activeKey.value = 'modMouldRepairParts';
    modMouldRepairPartsTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      modMouldRepairPartsList: allValues.tablesValue[0].tableData,
    };
  }
  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await endRepair(values);
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
