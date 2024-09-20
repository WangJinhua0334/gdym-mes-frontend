<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="工位工序" key="basWorkPostStation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basWorkPostStation"
          :loading="basWorkPostStationTable.loading"
          :columns="basWorkPostStationTable.columns"
          :dataSource="basWorkPostStationTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        >
          <template #toolbarSuffix>
            <a-button type="primary" @click="handleBatchAdd" preIcon="ant-design:plus-outlined">批量新增</a-button>
          </template>
        </JVxeTable>
      </a-tab-pane>
      <a-tab-pane tab="工位设备" key="basWorkPostEquip" :forceRender="true">
        <JVxeTable
          :empty-text="' '"
          keep-source
          resizable
          ref="basWorkPostEquip"
          :loading="basWorkPostEquipTable.loading"
          :columns="basWorkPostEquipTable.columns"
          :dataSource="basWorkPostEquipTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>
    <JPopupOnlReportCustomModal
      @register="openSubModal"
      :code="subModalProps.code"
      :multi="subModalProps.multi"
      :sorter="subModalProps.sorter"
      :groupId="subModalProps.uniqGroupId"
      :param="currentParams"
      :columns="subModalProps.columns"
      :method="subModalProps.method"
      :queryInfo="subModalProps.queryInfo"
      :url="subModalProps.url"
      @ok="partQueryCallBack"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, basWorkPostStationJVxeColumns, basWorkPostEquipJVxeColumns } from '../BasWorkPost.data';
  import { saveOrUpdate, queryBasWorkPostStation, queryBasWorkPostEquip } from '../BasWorkPost.api';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';

  // 传给弹出框的params
  const currentParams = ref({});
  //弹框配置
  const subModalProps = {
    code: '',
    multi: true,
    sorter: '',
    uniqGroupId: 'button_part_query_group' + Math.random(),
    method: 'get',
    url: '/station/basStation/listByType',
    params: { filterType: 'station_group' },
    columns: [
      {
        title: '工序编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '工序名称',
        align: 'center',
        dataIndex: 'name',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '工序编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '工序名称',
        mode: 'single',
        view: 'string',
      },
    ],
  };

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['basWorkPostStation', 'basWorkPostEquip']);
  const activeKey = ref('basWorkPostStation');
  const basWorkPostStation = ref();
  const basWorkPostEquip = ref();
  const tableRefs = { basWorkPostStation, basWorkPostEquip };
  const basWorkPostStationTable = reactive({
    loading: false,
    dataSource: [],
    columns: basWorkPostStationJVxeColumns,
  });
  const basWorkPostEquipTable = reactive({
    loading: false,
    dataSource: [],
    columns: basWorkPostEquipJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //注册
  const [openSubModal, { openModal }] = useModal();
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
      requestSubTableData(queryBasWorkPostStation, { id: data?.record?.id }, basWorkPostStationTable);
      requestSubTableData(queryBasWorkPostEquip, { id: data?.record?.id }, basWorkPostEquipTable);
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
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'basWorkPostStation';
    basWorkPostStationTable.dataSource = [];
    basWorkPostEquipTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      basWorkPostStationList: allValues.tablesValue[0].tableData,
      basWorkPostEquipList: allValues.tablesValue[1].tableData,
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
  /**
   * 批量添加工位信息
   */
  function handleBatchAdd() {
    const haveRows = basWorkPostStation.value.getXTable().getTableData().fullData;
    let itemRows = haveRows.map((item) => item.stationId);
    currentParams.value['filterIds'] = itemRows.join(',');
    console.log(currentParams);
    openModal(true);
  }
  //选择弹出信息回调
  function partQueryCallBack(rows) {
    if (rows && rows.length > 0) {
      const haveRows = basWorkPostStation.value.getXTable().getTableData().fullData;
      console.log(haveRows);
      for (let row of rows) {
        if (haveRows && haveRows.length > 0) {
          var isHave = haveRows.filter(function (item) {
            return item.stationId == row.id || row.code == item.stationId_dictText;
          });
          if (isHave.length > 0) {
            continue;
          }
        }
        let addRow = {
          stationId: row.id,
          stationId_dictText: row.code,
          stationName_dictText: row.name,
        };
        basWorkPostStation.value.addRows([addRow]);
      }
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
