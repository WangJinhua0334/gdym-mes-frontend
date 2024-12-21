<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_lot_woke:exportXls'"> 导出</a-button>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="lottestlist-mesLotTestList" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listColumns, listSearchFormSchema } from './MesLotWoke.data';
  import { list, exportUrl } from './MesLotWoke.api';

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '报工记录',
      api: list,
      columns: listColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: listSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
    exportConfig: {
      name: '报工记录',
      url: exportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style scoped></style>
