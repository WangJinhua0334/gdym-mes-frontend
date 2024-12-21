<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_lot_item_bind:exportXls'"> 导出</a-button>
      </template>
      <!--操作栏-->
      <!-- <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template> -->
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ record, text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleDetail(record)"
          >查看</a-button
        >
      </template>
    </BasicTable>

    <AttachmentsDrawer @register="registerDrawer" />
  </div>
</template>

<script lang="ts" name="lotbindlist-mesLotBindList" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer } from '/@/components/Drawer';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { bindListColumns, bindListSearchFormSchema } from './MesLotItemBind.data';
  import { listBind, exportBindXls } from './MesLotItemBind.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

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
    reload();
  });

  //注册model
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '物料绑定记录',
      api: listBind,
      columns: bindListColumns,
      canResize: true,
      pagination: true,
      formConfig: {
        //labelWidth: 120,
        schemas: bindListSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '物料绑定记录',
      url: exportBindXls,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection }] = tableContext;

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }

  /**
   * 操作栏
   */
  /*function getTableAction(record) {
    if (record.image) {
      return [
        {
          label: '附件',
          onClick: handleDetail.bind(null, record),
        },
      ];
    }

    return [];
  }*/
</script>

<style scoped></style>
