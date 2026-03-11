<template>
  <div class="receive-page">
    <div class="receive-form-wrapper">
      <BasicForm @register="registerForm" name="MesReceiveForm" />
      <div class="form-actions">
        <a-button type="primary" :loading="saveLoading" preIcon="ant-design:save-outlined" @click="handleSave">
          {{ editingRowId ? '保存修改' : '保存' }}
        </a-button>
        <a-button v-if="editingRowId" style="margin-left: 8px" @click="cancelEdit">取消编辑</a-button>
      </div>
    </div>
    <a-divider class="incoming-divider-separator" orientation="left">收料列表</a-divider>
    <div class="incoming-table-wrapper">
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <div class="table-actions">
      <a-button type="primary" :loading="submitLoading" preIcon="ant-design:check-outlined" @click="handleSubmit">
        提交
      </a-button>
    </div>
    </div>
  </div>
</template>

<script lang="ts" name="incoming-mesIncoming" setup>
  import { ref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import type { BasicColumn, ActionItem } from '/@/components/Table';
  import { formSchema } from './MesIncoming.data';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { saveOrUpdate } from './MesIncoming.api';
  import { useUserStore } from '/@/store/modules/user';

  const $message = useMessage();
  const userStore = useUserStore();
  const MATERIAL_DESC_CACHE_KEY = 'mes_incoming_material_desc';
  const saveLoading = ref(false);
  const submitLoading = ref(false);
  const editingRowId = ref<string | null>(null);
  let rowIdCounter = 0;

  const tableColumns: BasicColumn[] = [
    { title: '钢卷号', dataIndex: 'coilNo', key: 'coilNo', width: 180, align: 'center', fixed: 'left' },
    { title: '采购订单号', dataIndex: 'purchaseOrderNo', key: 'purchaseOrderNo', width: 180, align: 'center', fixed: 'left' },
    { title: '采购订单行号', dataIndex: 'purchaseOrderSeq', key: 'purchaseOrderSeq', width: 150, align: 'center' },
    { title: '物料代码', dataIndex: 'materialNumber', key: 'materialNumber', width: 180, align: 'center' },
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 180, align: 'center' },
    { title: '车牌号', dataIndex: 'licensePlateNumber', key: 'licensePlateNumber', width: 150, align: 'center' },
    { title: '牌号', dataIndex: 'brand', key: 'brand', width: 120, align: 'center' },
    { title: '重量', dataIndex: 'weight', key: 'weight', width: 120, align: 'center' },
    { title: '生产编号', dataIndex: 'productNumber', key: 'productNumber', width: 150, align: 'center' },
  ];

  const [registerTable, { setTableData, getDataSource }] = useTable({
    columns: tableColumns,
    dataSource: [],
    useSearchForm: false,
    pagination: false,
    showTableSetting: false,
    canResize: false,
    bordered: true,
    striped: false,
    scroll: { x: 1500 },
    rowKey: 'rowId',
    showActionColumn: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      slots: { customRender: 'action' },
    },
  });

  const [registerForm, { resetFields, setFieldsValue, validate, scrollToField, getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
  });

  async function initForm() {
    await resetFields();
    const savedMaterialDesc = sessionStorage.getItem(MATERIAL_DESC_CACHE_KEY) || '';
    await setFieldsValue({
      inStockTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      materialDesc: savedMaterialDesc,
    });
  }

  function saveMaterialDesc() {
    try {
      const formValues = getFieldsValue();
      const materialDesc = formValues?.materialDesc || '';
      sessionStorage.setItem(MATERIAL_DESC_CACHE_KEY, materialDesc);
    } catch (error) {
      console.error('保存物料说明失败:', error);
    }
  }

  async function handleSave() {
    try {
      const values = await validate();
      const currentData = getDataSource();
      const newPurchaseOrderNo = values?.purchaseOrderNo ?? '';

      // 表格中已有记录时，校验采购订单号是否一致
      const recordsToCheck = editingRowId.value
        ? currentData.filter((r) => r.rowId !== editingRowId.value)
        : currentData;
      if (recordsToCheck.length > 0) {
        const existingPurchaseOrderNo = recordsToCheck[0]?.purchaseOrderNo ?? '';
        if (newPurchaseOrderNo !== existingPurchaseOrderNo) {
          $message.createMessage.warning('当前钢卷和表格中的钢卷属于不同的采购订单，请先提交表格中的钢卷数据');
          return;
        }
      }

      saveLoading.value = true;

      const row = {
        rowId: editingRowId.value || `row_${++rowIdCounter}_${Date.now()}`,
        coilNo: values?.coilNo ?? '',
        purchaseOrderNo: values?.purchaseOrderNo ?? '',
        purchaseOrderSeq: values?.purchaseOrderSeq != null ? String(values.purchaseOrderSeq) : '',
        purchaseOrderFId: values?.purchaseOrderFId != null ? String(values.purchaseOrderFId) : '',
        purchaseOrderEntryId: values?.purchaseOrderEntryId != null ? String(values.purchaseOrderEntryId) : '',
        materialId: values?.materialId ?? '',
        materialNumber: values?.materialNumber ?? '',
        materialName: values?.materialName ?? '',
        modelNumber: values?.modelNumber ?? '',
        brand: values?.brand ?? '',
        weight: values?.weight != null ? String(values.weight) : '',
        supplierId: values?.supplierId ?? '',
        supplierNumber: values?.supplierNumber ?? '',
        stockUnitNumber: values?.stockUnitNumber ?? '',
        priceUnitNumber: values?.priceUnitNumber ?? '',
        purchaseUnitNumber: values?.purchaseUnitNumber ?? '',
        entryTaxRate: values?.entryTaxRate ?? '',
        licensePlateNumber: values?.licensePlateNumber ?? '',
        productNumber: values?.productNumber ?? '',
      };
      if (editingRowId.value) {
        const idx = currentData.findIndex((r) => r.rowId === editingRowId.value);
        if (idx >= 0) {
          const newData = [...currentData];
          newData[idx] = row;
          setTableData(newData);
        }
        editingRowId.value = null;
      } else {
        setTableData([...currentData, row]);
      }
      saveMaterialDesc();
      $message.createMessage.success('保存成功!');
      await initForm();
    } catch (error: unknown) {
      const err = error as { errorFields?: Array<{ name: string }> };
      const errorFields = err?.errorFields;
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          scrollToField(firstField.name, { behavior: 'smooth' });
        }
      }
      return Promise.reject(error);
    } finally {
      saveLoading.value = false;
    }
  }

  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '是否确认删除该记录?',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  function handleEdit(record: Recordable) {
    setFieldsValue({
      coilNo: record.coilNo,
      purchaseOrderNo: record.purchaseOrderNo,
      purchaseOrderSeq: record.purchaseOrderSeq,
      purchaseOrderFId: record.purchaseOrderFId,
      purchaseOrderEntryId: record.purchaseOrderEntryId,
      materialId: record.materialId,
      materialNumber: record.materialNumber,
      materialName: record.materialName,
      modelNumber: record.modelNumber,
      brand: record.brand,
      weight: record.weight,
      supplierId: record.supplierId,
      supplierNumber: record.supplierNumber,
      stockUnitNumber: record.stockUnitNumber,
      priceUnitNumber: record.priceUnitNumber,
      purchaseUnitNumber: record.purchaseUnitNumber,
      entryTaxRate: record.entryTaxRate,
      licensePlateNumber: record.licensePlateNumber,
      productNumber: record.productNumber,
    });
    editingRowId.value = record.rowId;
  }

  function handleDelete(record: Recordable) {
    const currentData = getDataSource();
    setTableData(currentData.filter((r) => r.rowId !== record.rowId));
    if (editingRowId.value === record.rowId) {
      editingRowId.value = null;
      initForm();
    }
    $message.createMessage.success('删除成功!');
  }

  function cancelEdit() {
    editingRowId.value = null;
    initForm();
  }

  async function handleSubmit() {
    if (submitLoading.value) return; // 防止重复提交
    submitLoading.value = true;
    const currentData = getDataSource();
    if (!currentData || currentData.length === 0) {
      $message.createMessage.warning('请先保存至少一条记录后再提交!');
      submitLoading.value = false;
      return;
    }
    try {
      const formValues = getFieldsValue();
      const firstOperation = formValues?.firstOperation ?? (userStore.getTenant === '1003' ? 'th' : 'sx');
      const productionTimeStr = formValues?.inStockTime ?? dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const items = currentData.map((r) => ({
        coilNo: r.coilNo,
        purchaseOrderNo: r.purchaseOrderNo ?? '',
        purchaseOrderFId: r.purchaseOrderFId ?? '',
        purchaseOrderSeq: r.purchaseOrderSeq ?? '',
        purchaseOrderEntryId: r.purchaseOrderEntryId ?? '',
        materialId: r.materialId ?? '',
        materialNumber: r.materialNumber ?? '',
        materialName: r.materialName ?? '',
        modelNumber: r.modelNumber ?? '',
        brand: r.brand ?? '',
        weight: r.weight ?? '',
        supplierId: r.supplierId ?? '',
        supplierNumber: r.supplierNumber ?? '',
        stockUnitNumber: r.stockUnitNumber ?? '',
        priceUnitNumber: r.priceUnitNumber ?? '',
        purchaseUnitNumber: r.purchaseUnitNumber ?? '',
        entryTaxRate: r.entryTaxRate ?? '',
        licensePlateNumber: r.licensePlateNumber ?? '',
        productNumber: r.productNumber ?? '',
        productionTime: productionTimeStr,
        firstOperation,
      }));
      const params = {
        items,
        operatorNumber: formValues?.operatorNumber ?? userStore.getUserInfo?.username ?? '',
        tenantId: Number(formValues?.tenantId ?? userStore.getTenant ?? 0),
      };
      await saveOrUpdate(params, false);
      setTableData([]);
      await initForm();
      $message.createMessage.success('提交成功!');
    } catch (error) {
      $message.createMessage.error('提交失败，请重试!');
      return Promise.reject(error);
    } finally {
      submitLoading.value = false;
    }
  }

  onMounted(() => {
    initForm();
  });
</script>

<style lang="less" scoped>
  .receive-page {
    padding: 16px;
    background: #fff;
    min-height: 400px;
  }

  .receive-form-wrapper {
    width: 100%;
  }

  .form-actions {
    margin-top: 24px;
    text-align: center;
  }

  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }

  .incoming-table-wrapper {
    margin-top: 16px;
  }

  .table-actions {
    margin-top: 24px;
    text-align: center;
  }

  /* 分隔线加粗，颜色与表单标签一致 */
  :deep(.incoming-divider-separator) {
    &.ant-divider-horizontal.ant-divider-with-text::before,
    &.ant-divider-horizontal.ant-divider-with-text::after {
      border-top-width: 2px;
      border-top-color: rgba(0, 0, 0, 0.88);
    }
    .ant-divider-inner-text {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
  }
</style>
