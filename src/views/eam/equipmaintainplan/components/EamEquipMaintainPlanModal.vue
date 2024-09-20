<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="设备保养计划项" key="eamEquipMaintainRecItem" :forceRender="true">
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
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import {
    formSchema,
    eamEquipMaintainRecItemJVxeColumns,
    eamEquipId, eamMaintainRecItemJVxeColumns
  } from '../EamEquipMaintainPlan.data';
  import {
    saveOrUpdate,
    queryEamEquipMaintainRecItem,
    getEamEquipMaintainItemByCode,
    listEamEquipMaintainItemByMainIdAll
  } from '../EamEquipMaintainPlan.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  import { getSpotCheckRecItemByCode, listEamEquipSpotCheckItemByMainIdAll } from '/@/views/eam/equipspotcheckplan/EamEquipSpotCheckPlan.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(false);
  const formDisabled = ref(false);
  const refKeys = ref(['eamEquipMaintainRecItem']);
  const activeKey = ref('eamEquipMaintainRecItem');
  const eamEquipMaintainRecItem = ref();
  const tableRefs = { eamEquipMaintainRecItem };
  const eamEquipMaintainRecItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: eamEquipMaintainRecItemJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
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
    isDetail.value = !!data?.isDetail;

    if (unref(isUpdate)||unref(isDetail)) {
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
  const title = computed(() => (unref(isDetail)?'详情':!unref(isUpdate) ? '新增' : '编辑'));

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
  watch(
    () => {
      return unref(eamEquipId);
    },
    async () => {
      // 删除表格所有数据
      const tableDataValues = eamEquipMaintainRecItem?.value?.getTableData();
      let ids = tableDataValues?.map((_) => _.rowId);
      eamEquipMaintainRecItem?.value.removeRowsById(ids);
      //重新为表格赋值
      let res = await listEamEquipMaintainItemByMainIdAll({ equipId: unref(eamEquipId) });
      res.forEach((v) => {
        eamEquipMaintainRecItem?.value?.addRows({ rowId: v.id, ...v });
      });
    },
    { immediate: false, deep: true }
  );
  // async function basicFormSubmit(values) {
  //   const tableDataValues = eamEquipMaintainRecItem?.value?.getTableData();
  //   let snIndex = tableDataValues.findIndex((_) => _.code === values.maintainItem);
  //   if (snIndex === -1) {
  //     const v = await getEamEquipMaintainItemByCode({ code: values.maintainItem });
  //     eamEquipMaintainRecItem?.value?.addRows(v);
  //   }
  // }
  //表单提交事件
  async function requestAddOrEdit(values) {
    console.log('values', values);
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
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
