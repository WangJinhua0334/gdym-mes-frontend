<template>
  <div class="receive-page oriented-receive-page">
    <!-- 与车牌/生产编号 Input 的 list 属性配合，提供历史候选（不依赖 AutoComplete，避免 reset 后值被清空） -->
    <datalist id="mes-incoming-oriented-dl-license">
      <option v-for="(v, i) in licenseHistoryList" :key="'lp-' + i + '-' + v" :value="v"></option>
    </datalist>
    <datalist id="mes-incoming-oriented-dl-product">
      <option v-for="(v, i) in productHistoryList" :key="'pn-' + i + '-' + v" :value="v"></option>
    </datalist>
    <div class="receive-form-wrapper">
      <BasicForm @register="registerForm" name="MesOrientedReceiveForm" />
      <div class="form-actions">
        <a-button type="primary" :loading="saveLoading" :disabled="submitLoading" preIcon="ant-design:save-outlined" @click="handleSave"
          >确定
        </a-button>
        <a-button v-if="editingRowId" style="margin-left: 8px" @click="cancelEdit">取消</a-button>
      </div>
    </div>
    <a-divider class="incoming-divider-separator" orientation="left">收料列表</a-divider>
    <div class="incoming-table-wrapper">
      <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
      <div class="table-actions">
        <a-button type="primary" :loading="submitLoading" preIcon="ant-design:check-outlined" @click="handleSubmit"> 提交 </a-button>
      </div>
    </div>
    <section v-if="result" class="receipt-result" aria-live="polite">
      <a-divider orientation="left">本次收料结果</a-divider>
      <div class="receipt-result-header">
        <span
          >采购入库单号：<strong>{{ result.billNo }}</strong> · 共 {{ result.items.length }} 卷</span
        >
        <a-button type="primary" :loading="printing" :disabled="submitLoading" preIcon="ant-design:printer-outlined" @click="handlePrint"
          >打印标签</a-button
        >
      </div>
      <a-table :columns="resultColumns" :data-source="result.items" row-key="internalCoilNumber" :pagination="false" bordered size="middle" />
    </section>
  </div>
</template>

<script lang="ts" name="incomingOriented-mesIncomingOriented" setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import type { BasicColumn, ActionItem } from '/@/components/Table';
  import { formSchema } from './MesIncomingOriented.data';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { submitReceipt, printReceiptLabels, type ReceiptResult } from './MesIncomingOriented.api';
  import { useUserStore } from '/@/store/modules/user';
  import { getPrintTemplateCode, getReportIdByTemplateCode } from '/@/utils/printTemplate';

  const $message = useMessage();
  const userStore = useUserStore();
  const MATERIAL_DESC_CACHE_KEY = 'mes_incoming_oriented_material_desc';
  const INPUT_CACHE_KEY = 'mes_incoming_oriented_last_input';
  const result = ref<ReceiptResult | null>(null);
  const printing = ref(false);
  const resultTenant = ref<number | null>(null);
  const saveLoading = ref(false);
  const submitLoading = ref(false);
  const editingRowId = ref<string | null>(null);
  const licenseHistoryList = ref<string[]>([]);
  const productHistoryList = ref<string[]>([]);
  let rowIdCounter = 0;

  function getInputCacheKey() {
    return `${INPUT_CACHE_KEY}:${String(userStore.getTenant || 'default')}`;
  }

  function loadInputCache() {
    licenseHistoryList.value = [];
    productHistoryList.value = [];
    try {
      const raw = localStorage.getItem(getInputCacheKey());
      if (!raw) return;
      const cached = JSON.parse(raw) as { licensePlateNumber?: unknown; productNumber?: unknown };
      const licensePlateNumber = String(cached?.licensePlateNumber ?? '').trim();
      const productNumber = String(cached?.productNumber ?? '').trim();
      if (licensePlateNumber) licenseHistoryList.value = [licensePlateNumber];
      if (productNumber) productHistoryList.value = [productNumber];
    } catch (error) {
      console.warn('读取来料单输入缓存失败:', error);
    }
  }

  function cacheInputField(field: 'licensePlateNumber' | 'productNumber', value: unknown) {
    const inputValue = String(value ?? '').trim();
    if (!inputValue) return;
    const cached = {
      licensePlateNumber: licenseHistoryList.value[0] ?? '',
      productNumber: productHistoryList.value[0] ?? '',
    };
    cached[field] = inputValue;
    try {
      localStorage.setItem(getInputCacheKey(), JSON.stringify(cached));
    } catch (error) {
      console.warn('保存来料单输入缓存失败:', error);
    }
    licenseHistoryList.value = cached.licensePlateNumber ? [cached.licensePlateNumber] : [];
    productHistoryList.value = cached.productNumber ? [cached.productNumber] : [];
  }

  const formSchemaWithCache = formSchema.map((schema) => {
    if (schema.field !== 'licensePlateNumber' && schema.field !== 'productNumber') return schema;
    const field = schema.field as 'licensePlateNumber' | 'productNumber';
    const componentProps = (schema.componentProps || {}) as Record<string, unknown>;
    return {
      ...schema,
      componentProps: {
        ...componentProps,
        onBlur: (event: FocusEvent) => cacheInputField(field, (event.target as HTMLInputElement)?.value),
      },
    };
  });

  const resultColumns = [
    { title: '源钢卷号', dataIndex: 'originalCoilNumber' },
    { title: '钢卷号', dataIndex: 'internalCoilNumber' },
    { title: '标签编号', dataIndex: 'labelNumber' },
  ];
  const tableColumns: BasicColumn[] = [
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 260, align: 'center', fixed: 'left' },
    { title: '源钢卷号', dataIndex: 'coilNo', key: 'coilNo', width: 220, align: 'center', fixed: 'left' },
    { title: '牌号', dataIndex: 'brand', key: 'brand', width: 140, align: 'center' },
    { title: '重量', dataIndex: 'weight', key: 'weight', width: 120, align: 'center' },
    { title: '生产编号', dataIndex: 'productNumber', key: 'productNumber', width: 140, align: 'center' },
    {
      title: '第一道工序',
      dataIndex: 'firstOperation',
      key: 'firstOperation',
      width: 120,
      align: 'center',
      customRender: ({ text }) => (String(text) === 'sx' ? '酸洗' : String(text) === 'th' ? '退火' : ''),
    },
    { title: '车牌号', dataIndex: 'licensePlateNumber', key: 'licensePlateNumber', width: 140, align: 'center' },
    { title: '物料编码', dataIndex: 'materialNumber', key: 'materialNumber', width: 200, align: 'center' },
    { title: '采购订单号', dataIndex: 'purchaseOrderNo', key: 'purchaseOrderNo', width: 200, align: 'center', fixed: 'right' },
    { title: '采购订单行号', dataIndex: 'purchaseOrderSeq', key: 'purchaseOrderSeq', width: 100, align: 'center' },
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
    labelAlign: 'right',
    rowProps: { gutter: [24, 12] },
    schemas: formSchemaWithCache,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
  });

  function syncExistCoilNoList(excludeRowId?: string) {
    const data = getDataSource();
    const list = (excludeRowId ? data.filter((r) => r.rowId !== excludeRowId) : data).map((r) => r.coilNo).filter((v) => v);
    setFieldsValue({ existCoilNoList: list });
  }

  async function initForm(firstOperation?: string) {
    await resetFields();
    const savedMaterialDesc = sessionStorage.getItem(`${MATERIAL_DESC_CACHE_KEY}:${userStore.getTenant}`) || '';
    await setFieldsValue({
      inStockTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      materialDesc: savedMaterialDesc,
      ...(firstOperation ? { firstOperation } : {}),
    });
    syncExistCoilNoList();
  }

  function saveMaterialDesc() {
    try {
      const formValues = getFieldsValue();
      const materialDesc = formValues?.materialDesc || '';
      sessionStorage.setItem(`${MATERIAL_DESC_CACHE_KEY}:${userStore.getTenant}`, materialDesc);
    } catch (error) {
      console.error('保存物料说明失败:', error);
    }
  }

  async function handleSave() {
    if (submitLoading.value) return;
    try {
      const values = await validate();
      if (values.resolvedCoilNo !== String(values.coilNo).trim() || !values.materialId) {
        $message.createMessage.warning('请先输入源钢卷号并回车查询成功后再保存');
        return;
      }
      const currentData = getDataSource();
      const newPurchaseOrderNo = values?.purchaseOrderNo ?? '';

      // 表格中已有记录时，校验采购订单号是否一致
      const recordsToCheck = editingRowId.value ? currentData.filter((r) => r.rowId !== editingRowId.value) : currentData;
      if (recordsToCheck.length > 0) {
        const existingPurchaseOrderNo = recordsToCheck[0]?.purchaseOrderNo ?? '';
        if (newPurchaseOrderNo !== existingPurchaseOrderNo) {
          $message.createMessage.warning('当前钢卷和表格中的钢卷属于不同的采购订单，请先提交表格中的钢卷数据');
          return;
        }
      }

      if (recordsToCheck.some((r) => r.coilNo === String(values.coilNo).trim())) {
        $message.createMessage.warning('该源钢卷已在待提交列表中');
        return;
      }
      saveLoading.value = true;

      const row = {
        rowId: editingRowId.value || `row_${++rowIdCounter}_${Date.now()}`,
        coilNo: String(values?.coilNo ?? '').trim(),
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
        entryTaxRate: values?.entryTaxRate != null ? String(values.entryTaxRate) : '',
        billNo: values?.billNo ?? '',
        taxPrice: values?.taxPrice != null ? String(values.taxPrice) : '',
        price: values?.price != null ? String(values.price) : '',
        amount: values?.amount != null ? String(values.amount) : '',
        amountLc: values?.amountLc != null ? String(values.amountLc) : '',
        entryTaxAmount: values?.entryTaxAmount != null ? String(values.entryTaxAmount) : '',
        taxAmountLc: values?.taxAmountLc != null ? String(values.taxAmountLc) : '',
        allAmount: values?.allAmount != null ? String(values.allAmount) : '',
        allAmountLc: values?.allAmountLc != null ? String(values.allAmountLc) : '',
        licensePlateNumber: values?.licensePlateNumber ?? '',
        productNumber: values?.productNumber ?? '',
        firstOperation: values?.firstOperation,
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
      await initForm(row.firstOperation);
      await nextTick();
      const coilInput = document.querySelector('.oriented-receive-page input[data-field="coilNo"]') as HTMLInputElement | null;
      coilInput?.focus();
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
        disabled: submitLoading.value,
      },
      {
        label: '删除',
        disabled: submitLoading.value,
        color: 'error',
        popConfirm: {
          title: '是否确认删除该记录?',
          getPopupContainer: () => document.body,
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  function handleEdit(record: Recordable) {
    setFieldsValue({
      coilNo: record.coilNo,
      resolvedCoilNo: record.coilNo,
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
      billNo: record.billNo,
      taxPrice: record.taxPrice,
      price: record.price,
      amount: record.amount,
      amountLc: record.amountLc,
      entryTaxAmount: record.entryTaxAmount,
      taxAmountLc: record.taxAmountLc,
      allAmount: record.allAmount,
      allAmountLc: record.allAmountLc,
      licensePlateNumber: record.licensePlateNumber,
      productNumber: record.productNumber,
      firstOperation: record.firstOperation,
      existCoilNoList: getDataSource()
        .filter((r) => r.rowId !== record.rowId)
        .map((r) => r.coilNo)
        .filter((v) => v),
    });
    editingRowId.value = record.rowId;
  }

  async function handleDelete(record: Recordable) {
    const currentData = getDataSource();
    setTableData(currentData.filter((r) => r.rowId !== record.rowId));
    if (editingRowId.value === record.rowId) {
      editingRowId.value = null;
      await initForm();
    } else {
      syncExistCoilNoList();
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
        billNo: r.billNo ?? '',
        taxPrice: r.taxPrice != null ? String(r.taxPrice) : '',
        price: r.price != null ? String(r.price) : '',
        amount: r.amount != null ? String(r.amount) : '',
        amountLc: r.amountLc != null ? String(r.amountLc) : '',
        entryTaxAmount: r.entryTaxAmount != null ? String(r.entryTaxAmount) : '',
        taxAmountLc: r.taxAmountLc != null ? String(r.taxAmountLc) : '',
        allAmount: r.allAmount != null ? String(r.allAmount) : '',
        allAmountLc: r.allAmountLc != null ? String(r.allAmountLc) : '',
        licensePlateNumber: r.licensePlateNumber ?? '',
        productNumber: r.productNumber ?? '',
        productionTime: productionTimeStr,
        firstOperation: r.firstOperation,
      }));
      const params = {
        items,
        operatorNumber: userStore.getUserInfo?.username ?? '',
        tenantId: Number(userStore.getTenant),
      };
      const tenantAtSubmit = Number(userStore.getTenant);
      const response = await submitReceipt(params);
      if (
        !response?.billNo ||
        response.items?.length !== currentData.length ||
        response.items.some((item) => !item.internalCoilNumber || !item.originalCoilNumber || !item.labelNumber)
      ) {
        $message.createMessage.error('收料结果不完整，请核对收料记录及 ERP 单据后处理');
        return;
      }
      if (Number(userStore.getTenant) !== tenantAtSubmit) return;
      result.value = response;
      resultTenant.value = tenantAtSubmit;
      setTableData([]);
      editingRowId.value = null;
      await initForm();
      $message.createMessage.success('提交成功，请点击打印标签');
    } catch (error) {
      $message.createMessage.error('提交未确认成功，请先核对收料记录及 ERP 单据，避免重复提交');
      return Promise.reject(error);
    } finally {
      submitLoading.value = false;
    }
  }

  async function handlePrint() {
    if (printing.value || !result.value || resultTenant.value !== Number(userStore.getTenant)) return;
    const printTenant = resultTenant.value;
    const numbers = result.value.items.map((item) => item.internalCoilNumber);
    printing.value = true;
    try {
      const templateCode = await getPrintTemplateCode();
      const reportId = await getReportIdByTemplateCode(templateCode, 'oriented_pick_material_sn');
      if (!reportId) throw new Error('未配置收料打印模板');
      if (Number(userStore.getTenant) !== printTenant) return;
      await printReceiptLabels(reportId, numbers, Number(printTenant));
      $message.createMessage.success('标签打印窗口已关闭');
    } catch (error) {
      console.error('取向收料标签打印失败', error);
      $message.createMessage.warning('打印失败，可重新点击打印标签或从收料记录补打');
    } finally {
      printing.value = false;
    }
  }

  watch(
    () => userStore.getTenant,
    () => {
      result.value = null;
      resultTenant.value = null;
      editingRowId.value = null;
      setTableData([]);
      loadInputCache();
      initForm();
    }
  );

  onMounted(() => {
    loadInputCache();
    initForm();
  });
</script>

<style lang="less" scoped>
  .receipt-result {
    margin-top: 24px;
    padding: 16px;
    border: 1px solid #b7eb8f;
    background: #f6ffed;
  }
  .receipt-result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }
  .receive-page {
    padding: 16px;
    background: #fff;
    min-height: 400px;
    /* 整页相对默认 14px 放大一档，便于现场查看 */
    font-size: 16px;
    line-height: 1.55;
  }

  .receive-form-wrapper {
    width: 100%;

    /* 保留输入建议，但隐藏 datalist 自带的下拉箭头 */
    :deep(input[list='mes-incoming-oriented-dl-license']::-webkit-calendar-picker-indicator),
    :deep(input[list='mes-incoming-oriented-dl-product']::-webkit-calendar-picker-indicator),
    :deep(input[list='mes-incoming-oriented-dl-license']::-webkit-list-button),
    :deep(input[list='mes-incoming-oriented-dl-product']::-webkit-list-button) {
      display: none !important;
    }

    /* 表单标题和内容样式与"信息输入"分隔栏一致 */
    :deep(.ant-form-item-label > label) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
      font-size: 16px;
    }
    :deep(.ant-input),
    :deep(.ant-input-number-input),
    :deep(.ant-picker-input > input),
    :deep(.ant-select-selection-item),
    :deep(.ant-radio-button-wrapper) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
      font-size: 16px;
    }
    /* 重量等禁用 InputNumber 需覆盖 -webkit-text-fill-color */
    :deep(.ant-input-number.ant-input-number-disabled .ant-input-number-input:not(:placeholder-shown)) {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.88);
    }
  }

  .form-actions {
    margin-top: 1px;
    text-align: center;
    .ant-btn {
      padding: 8px 24px;
      font-size: 17px;
      height: 44px;

      &.ant-btn-primary {
        font-weight: 500;
      }
    }
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
    :deep(.ant-table) {
      font-size: 16px;
    }
    :deep(.ant-table-thead > tr > th) {
      font-size: 16px;
    }
    /* 收料列表数据行加粗、黑色，便于扫读 */
    :deep(.ant-table-tbody > tr > td) {
      font-weight: 600;
      color: #000;
      font-size: 16px;
      a,
      .ant-btn-link {
        color: #000 !important;
        font-size: 16px;
      }
    }
  }

  .table-actions {
    margin-top: 24px;
    text-align: center;
    .ant-btn {
      padding: 8px 24px;
      font-size: 17px;
      height: 44px;

      &.ant-btn-primary {
        font-weight: 500;
      }
    }
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
      font-size: 16px;
    }
  }
</style>
