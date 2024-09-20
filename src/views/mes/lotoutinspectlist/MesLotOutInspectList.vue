<template>
  <!--引用表格-->
  <BasicTable @register="registerInspectListTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:mes_lot_outinsp:exportXls'" @click="onExportXls">
        按工单导出</a-button
      >
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <InspectView @register="registerInspectListModal" />
</template>

<script lang="ts" name="MesLotOutInspectList" setup>
  import { unref, onMounted } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './MesLotOutInspectList.data';
  import { list, getExportUrl } from './MesLotOutInspectList.api';
  import { useModal } from '/@/components/Modal';
  import InspectView from './components/InspectView.vue';

  const emit = defineEmits(['setModalProps', 'closeModal']);

  const [registerInspectListModal, { openModal }] = useModal();
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
    }, 1000);
    emit('setModalProps', { defaultFullscreen: true });
    reload();
  });

  //注册table数据
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      api: list,
      columns,
      canResize: false,
      immediate: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '出厂检验记录导出',
      url: getExportUrl,
    },
  });

  const [registerInspectListTable, { reload, getForm }, { rowSelection, selectedRowKeys }] = tableContext;

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
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
</script>

<style></style>
