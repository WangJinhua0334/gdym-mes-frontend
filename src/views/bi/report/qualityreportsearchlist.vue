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

<script lang="ts" name="bi-report-qualityreportsearchlist" setup>
  import { ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { qualityreportColumns, qualityreportSearchFormSchema } from './qualityreportsearchlist.data';
  import { qualityreportsearchlist, qualityreportsearchlistExportUrl } from './qualityreportsearchlist.api';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '质量报表',
      api: qualityreportsearchlist,
      columns: qualityreportColumns,
      clickToRowSelect: false,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: qualityreportSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '质量报表',
      url: qualityreportsearchlistExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style></style>
