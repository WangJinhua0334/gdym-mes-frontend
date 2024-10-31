<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1700">
    <template #footer>
      <a-button @click="closeModal" type="ghost">取消</a-button>
      <a-button @click="handlePrint" type="primary" :loading="loading">打印</a-button>
    </template>
    <a-button type="primary" style="margin-bottom: 10px" preIcon="ant-design:plus-outlined" @click="addRows"> 新增 </a-button>
    <span style="margin-left: 50px">是否加工：</span>&nbsp;&nbsp;&nbsp;&nbsp;
    <a-switch
      :checkedValue="'Y'"
      checked-children="是"
      :unCheckedValue="'N'"
      un-checked-children="否"
      :checked="switchValue"
      @change="switchChange"
    />
    <div>
      <JVxeTable
        keep-source
        resizable
        ref="lwmsLotBinding"
        :loading="lwmsLotBindingTable.loading"
        :columns="lwmsLotBindingTable.columns"
        :dataSource="lwmsLotBindingTable.dataSource"
        :height="340"
        :disabled="formDisabled"
        :rowNumber="true"
        :rowSelection="false"
        :toolbar="false"
      >
        <!-- 定义插槽 -->
        <template #action="props">
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗？" @confirm="handleDelete(props)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template #mustSwitch="record">
          <a-switch
            v-model:checkedValue="record.column.customValue[0]"
            checked-children="是"
            v-model:unCheckedValue="record.column.customValue[1]"
            un-checked-children="否"
            v-model:checked="record.value"
            disabled
            @change="record.triggerChange"
          />
        </template>
        <template #productSwitch="record">
          <a-switch
            v-model:checkedValue="record.column.customValue[0]"
            checked-children="是"
            v-model:unCheckedValue="record.column.customValue[1]"
            un-checked-children="否"
            v-model:checked="record.value"
            disabled
            @change="record.triggerChange"
          />
        </template>
      </JVxeTable>
    </div>
  </BasicModal>

  <!--工单选择弹窗-->
  <MoSelectModal
    @register="registerMoSelectModal"
    :title="'工单选择'"
    :code="moSelectModalProps.code"
    :groupId="moSelectModalProps.uniqGroupId"
    :multi="moSelectModalProps.multi"
    :sorter="moSelectModalProps.sorter"
    :param="moSelectModalProps.params"
    :columns="moSelectModalProps.columns"
    :queryInfo="moSelectModalProps.queryInfo"
    :method="moSelectModalProps.method"
    :url="moSelectModalProps.url"
    :options="moSelectModalProps.options"
    destroyOnClose
    @ok="moSelectCallBack"
  />
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { lwmsLotGenerateJVxeColumnsByMo } from '../MesLwmsLot.data';
  import { generateLwmsSn, generateBatchNo } from '../MesLwmsLot.api';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { buildUUID } from '/@/utils/uuid';
  import { printJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { useForm } from '/@/components/Form/index';
  import MoSelectModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { defHttp } from '/@/utils/http/axios';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const lwmsLotBinding = ref<any>(null);
  let loading = ref<boolean>(false);
  let batchNo = ref<string>('');
  const formDisabled = ref(false);
  const lwmsLotBindingTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
  }>({
    loading: false,
    dataSource: [],
    columns: lwmsLotGenerateJVxeColumnsByMo,
  });
  const switchValue = ref('N');
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({});

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    batchNo.value = await generateBatchNo();
  });

  /**注册工单选择弹窗 */
  const [registerMoSelectModal, { openModal: openMoSelectModal }] = useModal();
  //设置标题
  const title = computed(() => '物料条码生成(按工单)');

  /**物料选择弹出配置 */
  const moSelectModalProps = {
    multi: false,
    sorter: 'createTime=desc',
    code: buildUUID(),
    uniqGroupId: buildUUID(),
    params: {},
    columns: [
      {
        title: '工单号',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'type_dictText',
      },
      {
        title: '产品编码',
        align: 'center',
        dataIndex: 'prodId_dictText',
      },
      {
        title: '产品名称',
        align: 'center',
        dataIndex: 'prodName_dictText',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status_dictText',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '工单号',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'prodQuery',
        label: '产品编码',
        mode: 'single',
        view: 'string',
      },
    ],
    isShowNum: true,
    method: 'get',
    url: '/mo/mesMo/list',
    options: [],
  };

  //表单提交事件
  async function handlePrint() {
    try {
      loading.value = true;
      const values = lwmsLotBinding?.value?.getTableData();
      let validateTable = await lwmsLotBinding?.value?.validateTable();
      if (validateTable != null) {
        loading.value = false;
        return;
      }
      let res = await generateLwmsSn({ mesLwmsLots: values });
      let ids = res.ids;
      //console.log('ids', ids);
      defHttp.get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'lwms_lot_sn' } }).then((res) => {
        printJimuReport(res, { printAll: true, id: `${unref(ids).join(',')}` }, getToken(), false, () => {
          loading.value = false;
          //关闭弹窗
          closeModal();
          //刷新列表s
          emit('success');
        });
      });
    } catch (e) {
      console.log(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  const addRows = () => {
    // const tableDataValues = lwmsLotBinding?.value?.getTableData();
    // console.log('tableDataValues', tableDataValues);
    // const v = { id: tableDataValues.length || 1, batchNo: batchNo.value };
    // lwmsLotBinding?.value?.addRows(v);
    openMoSelectModal(true);
  };

  /**工单选择回调 */
  async function moSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      try {
        defHttp.get({ url: '/mo/mesMo/queryMesMoBomByMainId', params: { mainId: rows[0].id } }).then((res) => {
          showrows(res);
        });
      } catch (e) {
        console.log(e);
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }
  }

  function showrows(res) {
    lwmsLotBinding?.value?.removeRows();
    const tableDataValues = lwmsLotBinding?.value?.getTableData();
    let i = 1;
    for (let row of res) {
      if (tableDataValues && tableDataValues.length > 0 && tableDataValues.findIndex((p) => p.prodId == row.prodId) >= 0) {
        continue;
      }

      row.isProduct = row.isProduct == null ? 'N' : 'Y';
      if (row.isProduct != switchValue.value) {
        continue;
      }
      const v = {
        id: tableDataValues.length + i || 1,
        prodId: row.prodId,
        prodCode: row.prodId_dictText,
        prodName: row.prodName_dictText,
        isKeypart: row.isKeypart,
        moId: row.moId,
        moCode: row.moId_dictText,
        batchNo: batchNo.value,
        qtyValue: row.requireQty,
        isProduct: row.isProduct,
        materialCost: row.materialCost,
      };
      lwmsLotBinding?.value?.addRows(v);
      i++;
    }
  }
  //开关切换事件
  function switchChange(data) {
    switchValue.value = data;
  }

  const handleDelete = (row) => {
    // console.log('row', row);
    // console.log('lwmsLotBinding', lwmsLotBinding);
    lwmsLotBinding?.value?.removeRows(row.row);
  };
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
