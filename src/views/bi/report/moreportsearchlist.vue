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

<script lang="ts" name="bi-report-moreportsearchlist" setup>
  import { ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { moreportColumns, moreportSearchFormSchema } from './moreportsearchlist.data';
  import { moreportsearchlist, moreportsearchlistExportUrl } from './moreportsearchlist.api';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工单在制报表',
      api: moreportsearchlist,
      columns: moreportColumns,
      clickToRowSelect: false,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: moreportSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '工单在制报表',
      url: moreportsearchlistExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style></style>
