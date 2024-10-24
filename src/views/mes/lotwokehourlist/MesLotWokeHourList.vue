<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:mes_lot_work_hour:examine'" @click="handleExamine"> 审核</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:mes_lot_work_hour:refuseexamine'" @click="handleRefuseExamine">
          弃审</a-button
        >
        <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:mes_lot_work_hour:exportXls'" @click="onExportXls"> 导出</a-button>
      </template>
      <template #switchSlot="{ text }">
        <a-switch disabled checkedValue="Y" checked-children="是" unCheckedValue="N" un-checked-children="否" :checked="text" />
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </div>
  <!-- 表单区域 -->
  <MesLotWokeHourModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" name="lottestlist-mesLotTestList" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listColumns, listSearchFormSchema } from './MesLotWokeHour.data';
  import { list, exportUrl, batchExamine, batchRefuseExamine } from './MesLotWokeHour.api';
  import MesLotWokeHourModal from './components/MesLotWokeHourModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['setModalProps', 'closeModal']);
  //工作台调用，附加参数查询
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  onMounted(() => {
    setTimeout(() => {
      if (unref(props.componentData) && unref(props.componentData).record.scanInfo.sn) {
        getForm().setFieldsValue({
          lotSn: unref(props.componentData).record.scanInfo.sn,
        });
        reload();
      }
    }, 500);
    emit('setModalProps', { defaultFullscreen: true });
    reload();
  });

  //提示弹窗
  const $message = useMessage();

  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工时记录',
      api: list,
      columns: listColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: listSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '工时记录',
      url: exportUrl,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 审核事件
   */
  async function handleExamine() {
    if (selectedRowKeys.value.length == 0) {
      $message.createMessage.warning('请选择数据进行审核');
      return;
    }
    await batchExamine({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 弃审事件
   */
  async function handleRefuseExamine() {
    if (selectedRowKeys.value.length == 0) {
      $message.createMessage.warning('请选择数据进行弃审');
      return;
    }
    await batchRefuseExamine({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes:mes_lot_work_hour:edit',
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
</script>

<style scoped></style>
