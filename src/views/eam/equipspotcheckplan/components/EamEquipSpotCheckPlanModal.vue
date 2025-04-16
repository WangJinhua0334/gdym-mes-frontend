<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="设备计划点检项" key="eamEquipSpotCheckRecItem" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="eamEquipSpotCheckRecItem"
          :loading="eamEquipSpotCheckRecItemTable.loading"
          :columns="eamEquipSpotCheckRecItemTable.columns"
          :dataSource="eamEquipSpotCheckRecItemTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
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
  import { formSchema, eamEquipSpotCheckRecItemColumns, eamEquipId } from '../EamEquipSpotCheckPlan.data';
  import {
    saveOrUpdate,
    eamEquipSpotCheckRecItemList,
    getSpotCheckRecItemByCode,
    listEamEquipSpotCheckItemByMainIdAll,
  } from '../EamEquipSpotCheckPlan.api';
  import { message } from 'ant-design-vue';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(false);
  const formDisabled = ref(false);
  const refKeys = ref(['eamEquipSpotCheckRecItem']);
  const activeKey = ref('eamEquipSpotCheckRecItem');
  const eamEquipSpotCheckRecItem = ref();
  const tableRefs = { eamEquipSpotCheckRecItem };
  const eamEquipSpotCheckRecItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: eamEquipSpotCheckRecItemColumns,
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
    setModalProps({
      confirmLoading: false,
      showCancelBtn: data?.showFooter,
      showOkBtn: data?.showFooter,
    });
    isUpdate.value = !!data?.isUpdate;
    isDetail.value = !!data?.isDetail;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate) || unref(isDetail)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      requestSubTableData(eamEquipSpotCheckRecItemList, { planId: data?.record?.id }, eamEquipSpotCheckRecItemTable);
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
  const title = computed(() => (unref(isDetail) ? '详情' : !unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'eamEquipSpotCheckRecItem';
    eamEquipSpotCheckRecItemTable.dataSource = [];
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      eamEquipSpotCheckRecItemList: allValues.tablesValue[0].tableData,
    };
  }

  watch(
    () => unref(eamEquipId),
    async () => {
      // 删除表格所有数据
      const tableDataValues = eamEquipSpotCheckRecItem?.value?.getTableData();
      let ids = tableDataValues?.map((_) => _.rowId);
      eamEquipSpotCheckRecItem?.value.removeRowsById(ids);
      //重新为表格赋值
      let res = await listEamEquipSpotCheckItemByMainIdAll({ equipId: unref(eamEquipId) });
      res.forEach((v) => {
        eamEquipSpotCheckRecItem?.value?.addRows({ rowId: v.id, ...v });
      });
    },
    { immediate: false, deep: true }
  );
  const handleDelete = (row) => {
    //console.log('row', row);
    eamEquipSpotCheckRecItem?.value?.removeRows(row.row);
  };
  // async function basicFormSubmit(values) {
  //   const tableDataValues = eamEquipSpotCheckRecItem?.value?.getTableData();
  //   let snIndex = tableDataValues.findIndex((_) => _.code === values.spotCheckRecItem);
  //   if (snIndex === -1) {
  //     const v = await getSpotCheckRecItemByCode({ code: values.spotCheckRecItem });
  //     eamEquipSpotCheckRecItem?.value?.addRows(v);
  //   }
  // }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      if (!values.eamEquipSpotCheckRecItemList || values.eamEquipSpotCheckRecItemList.length == 0) {
        message.error('请添加点检项目');
        return;
      }
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
