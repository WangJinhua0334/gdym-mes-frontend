<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="bi-report-workpostoccupancysearchlist" setup>
  import { ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { workpostoccupancyColumns, workpostoccupancySearchFormSchema } from './workpostoccupancysearchlist.data';
  import { workpostoccupancysearchlist, workpostoccupancysearchlistExportUrl } from './workpostoccupancysearchlist.api';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工位占用情况',
      api: workpostoccupancysearchlist,
      columns: workpostoccupancyColumns,
      clickToRowSelect:false,
      canResize: true,
      showActionColumn:false,
      formConfig: {
        schemas: workpostoccupancySearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '工位占用情况', 
      url: workpostoccupancysearchlistExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style></style>
