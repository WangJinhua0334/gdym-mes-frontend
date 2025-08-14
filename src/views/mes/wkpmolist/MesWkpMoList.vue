<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_wkp_mo:exportXls'"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <template #fileSlot="{ record, text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleDetail(record)"
          >查看</a-button
        >
      </template>
    </BasicTable>
    <AttachmentsDrawer @register="registerDrawer" />
    <WkpMoChangeModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="MesWkpStockList" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer } from '/@/components/Drawer';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import WkpMoChangeModal from './components/WkpMoChangeModal.vue';
  import { listColumns, listSearchFormSchema } from './MesWkpMo.data';
  import { list, exportXls } from './MesWkpMo.api';
  import { useModal } from '/@/components/Modal';

  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  onMounted(() => {
    setTimeout(() => {
      if (unref(props.componentData) && unref(unref(props.componentData).record).workPostCode) {
        getForm().setFieldsValue({
          wkpCode: unref(unref(props.componentData).record).workPostCode,
        });
        reload();
      }
    }, 1000);
    reload();
  });

  //注册model
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工位任务信息',
      api: list,
      columns: listColumns,
      canResize: true,
      pagination: true,
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
      name: '工位任务信息',
      url: exportXls,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 查看文件
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }
  /**
   * 调整工单
   */
  function handleChange(record: Recordable) {
    openModal(true, {
      record: record,
    });
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    let actionArr: ActionItem[] = [];
    actionArr.push({
      label: '调整任务',
      onClick: handleChange.bind(null, record),
      auth: 'mes:mes_wkp_mo:changeMo',
    });
    return actionArr;
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style scoped></style>
