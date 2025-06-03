<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" @submit="basicFormSubmit" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="设备保养项" key="eamEquipMaintainRecItem" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="eamEquipMaintainRecItem"
          :loading="eamEquipMaintainRecItemTable.loading"
          :columns="eamEquipMaintainRecItemTable.columns"
          :dataSource="eamEquipMaintainRecItemTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="false"
        >
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="正常"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="不正常"
              v-model:checked="record.value"
              @change="record.triggerChange"
              :disabled="formDisabled"
            />
          </template>
        </JVxeTable>
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
  import { formSchema, eamEquipMaintainRecItemJVxeColumns, formSchemaMaintain, eamMaintainRecItemJVxeColumns } from '../EamEquipMaintainPlan.data';
  import { saveOrUpdate, queryEamEquipMaintainRecItem, getEamEquipMaintainItemByCode, maintain } from '../EamEquipMaintainPlan.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  import { getSpotCheckRecItemByCode } from '/@/views/eam/equipspotcheckplan/EamEquipSpotCheckPlan.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['eamEquipMaintainRecItem']);
  const activeKey = ref('eamEquipMaintainRecItem');
  const eamEquipMaintainRecItem = ref();
  const tableRefs = { eamEquipMaintainRecItem };
  const eamEquipMaintainRecItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: eamMaintainRecItemJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchemaMaintain,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    isDetail.value = !!data?.isDetail;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate) || unref(isDetail)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      requestSubTableData(queryEamEquipMaintainRecItem, { planId: data?.record?.id }, eamEquipMaintainRecItemTable);
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
  const title = computed(() => (unref(isDetail) ? '详情' : unref(isUpdate) ? '保养' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'eamEquipMaintainRecItem';
    eamEquipMaintainRecItemTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      eamEquipMaintainRecItemList: allValues.tablesValue[0].tableData,
    };
  }

  async function basicFormSubmit(values) {
    const tableDataValues = eamEquipMaintainRecItem?.value?.getTableData();
    let snIndex = tableDataValues.findIndex((_) => _.code === values.maintainItem);
    if (snIndex === -1) {
      const v = await getEamEquipMaintainItemByCode({ code: values.maintainItem });
      eamEquipMaintainRecItem?.value?.addRows(v);
    }
  }
  //表单提交事件
  async function requestAddOrEdit(values) {
    console.log('values', values);
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await maintain(values);
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
