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
      <template #listSlot="{ record, text, column }">
        <a @click="handleDetail(record, column)" v-if="text > 0">
          <span style="font-size: 14px; font-style: italic; color: blue; font-weight: bold">{{ text }}</span>
        </a>
        <span style="font-size: 12px; font-style: italic" v-if="text == 0">{{ text }}</span>
      </template>
    </BasicTable>
  </div>
  <PlanReportList @register="registerViewModal" />
</template>

<script lang="ts" name="bi-reports-planreport" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { planreport, planreportExportUrl } from './PlanReport.api';
  import { columns, formSchema } from './PlanReport.data';
  import PlanReportList from './PlanReportList.vue';
  import { useModal } from '/@/components/Modal';

  //注册model
  const [registerViewModal, { openModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '计划日报表',
      api: planreport,
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
      name: '计划日统计报表',
      url: planreportExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 详情
   */
  function handleDetail(record: Recordable, column) {
    openModal(true, {
      record,
      column: column,
      isUpdate: true,
      showFooter: false,
    });
  }
</script>

<style scoped></style>
