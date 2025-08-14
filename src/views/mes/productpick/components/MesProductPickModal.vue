<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="生产领料明细" key="mesProductPickDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesProductPickDetail"
          :loading="mesProductPickDetailTable.loading"
          :columns="mesProductPickDetailTable.columns"
          :dataSource="mesProductPickDetailTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="!formDisabled"
          :toolbar="!formDisabled"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: ['remove', 'clearSelection'] }"
        >
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddDetail" preIcon="ant-design:plus-outlined"> 新增</a-button>
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>

  <!--物料选择弹窗-->
  <MoBomProductSelectModal
    @register="registerMoBomProdSelectModal"
    :title="'工单BOM选择'"
    :code="moBomProdSelectModalProps.code"
    :groupId="moBomProdSelectModalProps.uniqGroupId"
    :multi="moBomProdSelectModalProps.multi"
    :sorter="moBomProdSelectModalProps.sorter"
    :param="moBomProdSelectModalProps.params"
    :columns="moBomProdSelectModalProps.columns"
    :queryInfo="moBomProdSelectModalProps.queryInfo"
    :method="moBomProdSelectModalProps.method"
    :url="moBomProdSelectModalProps.url"
    :options="moBomProdSelectModalProps.options"
    destroyOnClose
    @ok="moBomProdSelectCallBack"
  />
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, getDetailJVxeColumns } from '../MesProductPick.data';
  import { saveOrUpdate, mesProductPickDetailList } from '../MesProductPick.api';
  import MoBomProductSelectModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const detailJVxeColumns = computed(() => getDetailJVxeColumns(unref(formDisabled)));

  const refKeys = ref(['mesProductPickDetail']);
  const activeKey = ref('mesProductPickDetail');
  const mesProductPickDetail = ref();
  const tableRefs = { mesProductPickDetail };
  const mesProductPickDetailTable = reactive({
    loading: false,
    dataSource: [],
    columns: detailJVxeColumns,
  });

  /**工单BOM物料选择弹出配置 */
  const moBomProdSelectModalProps = computed(() => {
    const uniqGroupId = buildUUID();
    return {
      code: uniqGroupId,
      uniqGroupId: uniqGroupId,
      multi: true,
      sorter: '',
      params: {},
      columns: [
        {
          title: '工单',
          align: 'center',
          dataIndex: 'moId_dictText',
        },
        {
          title: '物料编码',
          align: 'center',
          dataIndex: 'prodId_dictText',
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'prodName_dictText',
        },
        {
          title: '需求数',
          align: 'center',
          dataIndex: 'requireQty',
        },
        {
          title: '已备料数',
          align: 'center',
          dataIndex: 'preparedQty',
        },
        {
          title: '已领料数',
          align: 'center',
          dataIndex: 'issuedQty',
        },
      ],
      queryInfo: [
        {
          field: 'moCode',
          label: '工单',
          mode: 'single',
          view: 'string',
        },
        {
          field: 'prodQuery',
          label: '物料',
          mode: 'single',
          view: 'string',
        },
      ],
      method: 'get',
      url: '/mo/mesMoBom/list',
      options: [],
    };
  });

  /**注册工单BOM物料选择弹窗 */
  const [registerMoBomProdSelectModal, { openModal: openMoBomProdSelectModal }] = useModal();

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    labelWidth: 120,
    baseColProps: { span: 8 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter, defaultFullscreen: true });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      requestSubTableData(mesProductPickDetailList, { mainId: data?.record?.id }, mesProductPickDetailTable);
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: unref(formDisabled) });
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
  const title = computed(() => (unref(formDisabled) ? '详情' : !unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'mesProductPickDetail';
    mesProductPickDetailTable.dataSource = [];
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      productPickDetailList: allValues.tablesValue[0].tableData,
    };
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
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

  /**新增领料单物料 */
  function handleAddDetail() {
    openMoBomProdSelectModal(true, {});
  }

  /**工单BOM物料选择回调 */
  function moBomProdSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const addRows: any[] = [];
      const tableRows = mesProductPickDetail.value.getTableData();
      for (let row of rows) {
        if (tableRows && tableRows.length > 0 && tableRows.findIndex((p) => p.prodId == row.id && (!p.whId || p.whId === '')) >= 0) {
          continue;
        }

        let addRow = {
          id: buildUUID(),
          moId: row.moId,
          moId_dictText: row.moId_dictText,
          moCode: row.moCode,
          prodId: row.prodId,
          prodId_dictText: row.prodId_dictText,
          prodName_dictText: row.prodName_dictText,
          qty: Number(row.requireQty) - Number(row.issuedQty ?? 0),
          pickedQty: Number(0),
          whId: null,
          unitId: row.unitId,
          erpLineNo: '',
        };

        addRows.push(addRow);
      }

      mesProductPickDetail.value.addRows([...addRows]);
      mesProductPickDetail.value.getXTable().updateData();
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

  :deep(.ant-picker) {
    width: 100%;
  }
</style>
