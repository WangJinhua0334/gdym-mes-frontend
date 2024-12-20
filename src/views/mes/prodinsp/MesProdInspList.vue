<template>
  <!--引用表格-->
  <BasicTable @register="registerInspectListTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:mes_prod_insp:exportXls'" @click="onExportXls"> 导出</a-button>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <InspectView @register="registerInspectListModal" />
</template>

<script lang="ts" name="MesIncomingInspList" setup>
  import { ref, computed, unref, onMounted, watch, reactive, nextTick } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './MesProdInspList.data';
  import { list, getExportUrl } from './MesProdInspList.api';
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
    }, 500);
    emit('setModalProps', { defaultFullscreen: true });
    reload();
  });

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
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
        title: '操作',
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '成品检验记录导出',
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
