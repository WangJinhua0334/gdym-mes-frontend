<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'mes:retrace_report:exportXls'" @click="onExportXls"> 导出</a-button>
      </template>
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="工序列表" key="basUnit" forceRender>
            <RetraceSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :destroy-on-close="true" />
      </template>
      <!-- 内嵌table区域 end -->
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #switchSlot="{ text }">
        <a-switch disabled checkedValue="Y" checked-children="OK" unCheckedValue="N" un-checked-children="NG" :checked="text" />
      </template>
    </BasicTable>

    <!-- 生产记录 -->
    <ProducttionRecordModal @register="registerModal" />
  </div>
</template>

<script lang="ts" name="unitgroup-basUnitGroup" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import RetraceSubTable from './subTables/RetraceSubTable.vue';
  import ProducttionRecordModal from './subTables/ProducttionRecordModal.vue';
  import { retraceListColumns, retraceListSearchFormSchema } from './RetraceReport.data';
  import { useModal } from '/@/components/Modal';
  import { list, getExportUrl } from './RetraceReport.api';

  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  const [registerModal, { openModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      api: list,
      columns: retraceListColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: retraceListSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: true,
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '生产过程记录导出',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '生产记录',
        onClick: handleProduction.bind(null, record),
        //auth: 'ams:ams_orders:edit',
      },
    ];
  }
  /**
   * 生产记录
   */
  function handleProduction(record: Recordable) {
    openModal(true, {
      record: record,
    });
  }
</script>

<style>
  .ant-table-content {
    overflow-x: auto !important;
  }
</style>
