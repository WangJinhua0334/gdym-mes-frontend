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

<script lang="ts" name="bi-report-workrecordreportsearchlist" setup>
  import { ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { workrecordreportColumns, workrecordreportSearchFormSchema } from './workrecordreportsearchlist.data';
  import { workrecordreportsearchlist, workrecordreportsearchlistExportUrl } from './workrecordreportsearchlist.api';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工时统计报表',
      api: workrecordreportsearchlist,
      columns: workrecordreportColumns,
      clickToRowSelect: false,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: workrecordreportSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '工时统计报表',
      url: workrecordreportsearchlistExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style></style>
