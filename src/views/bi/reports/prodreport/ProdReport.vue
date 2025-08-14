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
    </BasicTable>
  </div>
</template>

<script lang="ts" name="bi-reports-prodreport" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { prodreport, prodreportExportUrl } from './ProdReport.api';
  import { columns, formSchema } from './ProdReport.data';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '车间现存产品统计报表',
      api: prodreport,
      columns: columns,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: formSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '车间现存产品统计报表',
      url: prodreportExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style scoped></style>
