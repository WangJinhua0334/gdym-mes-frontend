<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_wkp_stock_record:exportXls'">
          导出</a-button
        >
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
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

<script lang="ts" name="MesWkpStockRecordList" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer } from '/@/components/Drawer';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { stockRecordListColumns, stockRecordListSearchFormSchema } from './MesWkpStock.data';
  import { listStockRecord, exportStockRecordXls } from './MesWkpStock.api';

  //注册model
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工位物料操作记录',
      api: listStockRecord,
      columns: stockRecordListColumns,
      canResize: true,
      pagination: true,
      formConfig: {
        //labelWidth: 120,
        schemas: stockRecordListSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
    exportConfig: {
      name: '工位物料操作记录',
      url: exportStockRecordXls,
    },
  });

  const [registerTable, { reload }, { rowSelection }] = tableContext;

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }
</script>

<style scoped></style>
