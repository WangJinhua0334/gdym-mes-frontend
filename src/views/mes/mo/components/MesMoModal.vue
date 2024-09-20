<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @cancel="handleCancel" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="工单BOM" key="mesMoBom" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoBom"
          :loading="mesMoBomTable.loading"
          :columns="mesMoBomTable.columns"
          :dataSource="mesMoBomTable.dataSource"
          @valueChange="bomTableValueChange"
          :height="340"
          :disabled="false"
          :rowNumber="true"
          :sortKey="'sequence'"
          :rowSelection="true"
          :toolbar="true"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: ['remove', 'clearSelection'] }"
        >
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddProd" preIcon="ant-design:plus-outlined"> 新增</a-button>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="handleImportFromProdBom"> 产品BOM导入</a-button>
          </template>
        </JVxeTable>
      </a-tab-pane>
      <a-tab-pane tab="工单工序" key="mesMoStation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoStation"
          :loading="mesMoStationTable.loading"
          :columns="mesMoStationTable.columns"
          :dataSource="mesMoStationTable.dataSource"
          :editConfig="mesMoStationTable.editConfig"
          :height="340"
          :disabled="false"
          :rowNumber="true"
          :sortKey="'sequence'"
          :rowSelection="false"
          :toolbar="false"
          ><template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
              disabled
            />
          </template>
          <template #writeSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
        </JVxeTable>
      </a-tab-pane>

      <a-tab-pane tab="工单工序BOM" key="mesMoStationBom" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoStationBom"
          :loading="mesMoStationBomTable.loading"
          :columns="mesMoStationBomTable.columns"
          :dataSource="mesMoStationBomTable.dataSource"
          :height="340"
          :disabled="false"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>

  <!--物料选择弹窗-->
  <ProductSelectModal
    @register="registerProdSelectModal"
    :title="'物料选择'"
    :code="prodSelectModalProps.code"
    :groupId="prodSelectModalProps.uniqGroupId"
    :multi="prodSelectModalProps.multi"
    :sorter="prodSelectModalProps.sorter"
    :param="prodSelectModalProps.params"
    :columns="prodSelectModalProps.columns"
    :queryInfo="prodSelectModalProps.queryInfo"
    :method="prodSelectModalProps.method"
    :url="prodSelectModalProps.url"
    :options="prodSelectModalProps.options"
    destroyOnClose
    @ok="prodSelectCallBack"
  />
  <!-- BOM选择弹窗-->
  <ProductBomSelectModal @register="registerBomSelectModal" destroyOnClose @callBack="bomSelectCallBack" />
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive, watch } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import {
    getFormSchema,
    mesMoBomJVxeColumns,
    mesMoStationJVxeColumns,
    mesMoStationBomJVxeColumns,
    moProdId,
    moWkfId,
    moQty,
    workflowList,
    moBomList,
    moStationList,
  } from '../MesMo.data';
  import {
    queryMesMoBom,
    queryMesMoStation,
    queryMesMoStationBom,
    defaultVerBomDetailListByProdId,
    bomDetailListByBomId,
    workFlowListByProdId,
    workFlowStationListByMainId,
    workFlowStationProductListByMainIds,
    saveOrUpdate,
    fillRule,
  } from '../MesMo.api';

  import ProductSelectModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import ProductBomSelectModal from './ProductBomSelectModal.vue';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref<boolean>(false);
  const moId = ref<string>();

  const refKeys = ref(['mesMoBom', 'mesMoStation', 'mesMoStationBom']);
  const activeKey = ref('mesMoBom');
  const mesMoBom = ref();
  const mesMoStation = ref();
  const mesMoStationBom = ref();

  const tableRefs = { mesMoBom, mesMoStation, mesMoStationBom };
  const mesMoBomTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoBomJVxeColumns,
  });

  const mesMoStationTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoStationJVxeColumns,
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      activeMethod: ({ row, column }) => {
        if (column.property === 'isPrintSn' || column.property === 'prodId') {
          if (!row.isStart || row.isStart != 'Y') {
            return false;
          } else if (row.prodId && row.prodId === getFieldsValue().prodId) {
            return false;
          }
        }

        return true;
      },
    },
  });

  const mesMoStationBomTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoStationBomJVxeColumns,
  });

  /**物料选择弹出配置 */
  const prodSelectModalProps = {
    code: buildUUID(),
    uniqGroupId: buildUUID(),
    multi: true,
    sorter: '',
    params: { status: 'enable' },
    columns: [
      {
        title: '编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '版本',
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '规格',
        align: 'center',
        dataIndex: 'specification',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '名称',
        mode: 'single',
        view: 'string',
      },
    ],
    method: 'get',
    url: '/product/basProduct/list',
    options: [],
  };

  /**注册物料选择弹窗 */
  const [registerProdSelectModal, { openModal: openProdSelectModal }] = useModal();
  /**注册BOM选择弹窗 */
  const [registerBomSelectModal, { openModal: openBomSelectModal }] = useModal();

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: getFormSchema(),
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });

  /**子表格方法配置*/
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  /**表单赋值*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: true });

    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      moId.value = data.record.id;
      /**刷新工艺数据源 */
      await refreshWorkFlowStationList(data.record.prodId);

      /**表单赋值 */
      await setFieldsValue({ ...data.record });

      /**工单BOM子列表赋值 */
      requestSubTableData(queryMesMoBom, { mainId: unref(moId) }, mesMoBomTable, (res) => {
        moBomList.value = res.result;
      });
      /**工单工序子列表赋值 */
      requestSubTableData(queryMesMoStation, { mainId: unref(moId) }, mesMoStationTable, (res) => {
        moStationList.value = res.result;
      });
      /**工单工序BOM子列表赋值 */
      requestSubTableData(queryMesMoStationBom, { mainId: unref(moId) }, mesMoStationBomTable);
    } else {
      fillRule('mo_batch_fill_rule').then((res) => {
        setFieldsValue({
          batch: res[0],
          planStartTime: new Date(),
          planCompleteTime: new Date().setDate(new Date().getDate() + 1),
        });
      });
    }
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  /**监听物料选择 */
  watch(
    () => unref(moProdId),
    async () => {
      /**刷新工单BOM子表 */
      await refreshMoBomList();

      /**刷新工艺数据源 */
      await refreshWorkFlowStationList(unref(moProdId), true);
    },
    { immediate: false, deep: true }
  );
  /**监听工艺选择 */
  watch(
    () => unref(moWkfId),
    async () => {
      /**刷新工单工序子表 */
      await refreshMoStationList();
      /**刷新工单工序BOM表 */
      await refreshMoStationBomList();
    },
    { immediate: false, deep: true }
  );
  /**监听工单数量变更 */
  watch(
    () => unref(moQty),
    async () => {
      /**刷新工单工序子表 */
      const tableData = mesMoBom.value.getTableData();
      if (unref(moQty) >= 0 && tableData && tableData.length > 0) {
        // 工单数量
        // let moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
        for (const row of tableData) {
          const requireQty = calculateRequiredQty(unref(moQty), row.qty, row.lossRate); //Number(row.qty) * Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
          mesMoBom.value.setValues([{ rowKey: row.id, values: { requireQty: requireQty } }]);
        }

        // mesMoBomTable.dataSource = moBomList.value;
        //mesMoBom.value.getXTable().updateData();
      }
    },
    { immediate: false, deep: true }
  );

  /**刷新工艺数据源方法 */
  async function refreshWorkFlowStationList(prodId, autoSelect = false) {
    if (prodId) {
      /**加载工艺路线数据源 */
      await workFlowListByProdId({ prodId: prodId }).then((res) => {
        // updateSchema({ field: 'wkfId', componentProps: { dictOptions: res } });
        workflowList.value = res;

        /**自动选中默认版本工艺 */
        if (!!autoSelect && res.findIndex((p) => p.isDefault === 'Y') >= 0) {
          const defaultVer = res.find((p) => p.isDefault === 'Y');
          setFieldsValue({ wkfId: defaultVer.id });
          moWkfId.value = defaultVer.id;
        }
      });
    } else {
      setFieldsValue({ wkfId: null });
      moWkfId.value = null;
      workflowList.value = [];
    }
  }

  /**刷新工单BOM子表方法 */
  async function refreshMoBomList() {
    if (unref(moProdId)) {
      await defaultVerBomDetailListByProdId({ prodId: unref(moProdId) }).then((res) => {
        if (!res || res.length <= 0) {
          $message.createMessage.info('产品未找到已启用的默认产品BOM，请手动添加BOM物料！');
          return;
        }

        // 工单数量
        let moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
        for (const row of res) {
          row.id = buildUUID();
          row.lossRate = row.lossRate ? row.lossRate : 0;
          row.requireQty = calculateRequiredQty(moQty, row.qty, row.lossRate); //Number(row.qty) * Number(getFieldsValue().qty ? getFieldsValue().qty : 0);

          delete row.createBy;
          delete row.createTime;
          delete row.updateBy;
          delete row.updateTime;
          delete row.sysOrgCode;
        }

        moBomList.value = res;
        mesMoBomTable.dataSource = res;
        mesMoBom.value.getXTable().updateData();
      });
    } else {
      moBomList.value = [];
      mesMoBomTable.dataSource = [];
      mesMoBom?.value?.getXTable()?.updateData();
    }
  }

  /**刷新工单工序子表方法 */
  async function refreshMoStationList() {
    if (unref(moWkfId)) {
      await workFlowStationListByMainId({ workflowId: unref(moWkfId) }).then((res) => {
        const prodId = getFieldsValue().prodId;
        for (const row of res) {
          if (row.prodId != prodId && unref(moBomList).findIndex((p) => p.prodId == row.prodId) < 0) {
            delete row.prodId;
            delete row.prodId_dictText;
            delete row.prodName_dictText;
          }

          row.wfsId = row.id;
          row.wfsId_dictText = row.title;
          row.id = buildUUID();

          delete row.createBy;
          delete row.createTime;
          delete row.updateBy;
          delete row.updateTime;
          delete row.sysOrgCode;
        }

        moStationList.value = res;
        mesMoStationTable.dataSource = res;
        mesMoStation.value.getXTable().updateData();
      });
    } else {
      moStationList.value = [];
      mesMoStationTable.dataSource = [];
      mesMoStation?.value?.getXTable()?.updateData();
    }
  }

  /**刷新工单工序BOM列表方法 */
  async function refreshMoStationBomList() {
    if (unref(moStationList) && unref(moStationList).length > 0) {
      const wfsIds: any[] = [];
      unref(moStationList).forEach((item) => {
        wfsIds.push(item.wfsId);
      });

      await workFlowStationProductListByMainIds({ mainIds: unref(wfsIds).join(',') }).then((res) => {
        const filterRows = res.filter((row) => unref(moBomList).findIndex((p) => p.prodId == row.prodId) >= 0);
        filterRows.forEach((row) => {
          row.id = buildUUID();

          delete row.createBy;
          delete row.createTime;
          delete row.updateBy;
          delete row.updateTime;
          delete row.sysOrgCode;
        });

        mesMoStationBomTable.dataSource = filterRows;
        mesMoStationBom.value.getXTable().updateData();
      });
    } else {
      mesMoStationBomTable.dataSource = [];
      mesMoStationBom?.value?.getXTable()?.updateData();
    }
  }

  async function reset() {
    await resetFields();
    activeKey.value = 'mesMoBom';
    mesMoBomTable.dataSource = [];
    mesMoStationTable.dataSource = [];
    mesMoStationBomTable.dataSource = [];
  }

  /**添加工单BOM */
  function handleAddProd() {
    const prodId = getFieldsValue().prodId;
    if (!prodId) {
      $message.createMessage.warning('请先选择工单产品！');
      return;
    }

    openProdSelectModal(true, { bomProdId: prodId });
  }

  /**物料选择回调 */
  function prodSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      // 工单物料
      const prodId = getFieldsValue().prodId;
      // 工单数量
      const moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);

      let i = 1;
      const addRows: any[] = [];
      const moBomRows = mesMoBom.value.getTableData();
      for (let row of rows) {
        if (moBomRows && moBomRows.length > 0 && moBomRows.findIndex((p) => p.prodId == row.id) >= 0) {
          continue;
        }

        if (row.id === prodId) {
          $message.createMessage.warning('工单BOM物料不能为当前产品');
          return;
        }

        let addRow = {
          id: buildUUID(),
          prodId: row.id,
          prodId_dictText: row.code + '[' + row.version + ']',
          prodName_dictText: row.name,
          isKeypart: row.is_key,
          requireQty: calculateRequiredQty(moQty, 1, 0),
          qty: 1,
          lossRate: 0,
          unitId: row.unitId,
          unitId_dictText: row.unitId_dictText,
          sequence: moBomRows.length + i,
        };

        addRows.push(addRow);
        i++;
      }

      moBomList.value.push([...addRows]);
      mesMoBom.value.addRows([...addRows]);
      mesMoBom.value.getXTable().updateData();
    }
  }

  /**产品BOM导入 */
  function handleImportFromProdBom() {
    const prodId = getFieldsValue().prodId;
    if (!prodId) {
      $message.createMessage.warning('请先选择工单产品！');
      return;
    }

    openBomSelectModal(true, { bomProdId: prodId });
  }

  /**BOM选择回调 */
  function bomSelectCallBack(values) {
    bomDetailListByBomId({ bomId: values.bomId }).then((res) => {
      if (res && res.length > 0) {
        // 工单数量
        let moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
        for (const row of res) {
          row.id = buildUUID();
          row.lossRate = row.lossRate ? row.lossRate : 0;
          row.requireQty = calculateRequiredQty(moQty, row.qty, row.lossRate); //Number(row.qty) * Number(getFieldsValue().qty ? getFieldsValue().qty : 0);

          delete row.createBy;
          delete row.createTime;
          delete row.updateBy;
          delete row.updateTime;
          delete row.sysOrgCode;
        }

        moBomList.value = res;
        mesMoBomTable.dataSource = res;
        mesMoBom.value.getXTable().updateData();

        refreshMoStationList();
        refreshMoStationBomList();
      } else {
        $message.createMessage.warning('选择的产品BOM未维护BOM明细，请确认！');
      }
    });
  }

  // 测试项值变更事件
  function bomTableValueChange(args) {
    const { oldValue, value, row, column } = args;
    if (column.property != 'qty' && column.property != 'lossRate') return;

    if (oldValue == value) return;

    const moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
    row.requireQty = calculateRequiredQty(moQty, row.qty, row.lossRate);
  }

  /**BOM物料需求量计算
   * @param moQty 工单数量
   * @param bomgQty 物料单位用量
   * @param bomLossRate 物料损耗率
   */
  function calculateRequiredQty(moQty, qty, lossRate) {
    if (!lossRate) {
      lossRate = 0;
    }

    let requiredQty = Number(moQty) * Number(qty);
    requiredQty += Number(requiredQty) * Number(lossRate);
    return requiredQty;
  }

  /**提交参数构造 */
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      moBomList: allValues.tablesValue[0].tableData,
      moStationList: allValues.tablesValue[1].tableData,
      moStationBomList: allValues.tablesValue[2].tableData,
    };
  }

  /**表单提交事件*/
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      await saveOrUpdate(values, isUpdate.value);

      clearCache();
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } catch (error) {
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /**清除缓存 */
  function clearCache() {
    moProdId.value = null;
    moWkfId.value = null;
    moQty.value = -1;
    //moBomList.value = [];
    //moStationList.value = [];
  }

  /**取消事件 */
  function handleCancel() {
    clearCache();
    //关闭弹窗
    closeModal();
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
