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

<script lang="ts" name="bi-reports-coilprodreport" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { coilprodreport, coilprodreportExportUrl } from './CoilProdReport.api';
  import { columns, formSchema } from './CoilProdReport.data';
  // import { computed } from 'vue';
  // import { mostationtaskColumns } from '@/views/bi/report/mostationtasksearchlist.data';
  // import { getSpanArr } from '@/utils/loms';

  // // 表格列设置行合并
  // const newColumns = computed(() => {
  //   // 获取表格数据
  //   const tableDataSource = getDataSource();
  //   // 设置需要合并的列
  //   const needTomergeColumnsIndex = [
  //     'newCoilNo',
  //     'newMaterialNumber',
  //     'newMaterialName',
  //     'newModelNumber',
  //     'endWeight',
  //     'endTeamId_dictText',
  //     'endTime',
  //     'status'
  //   ];
  //   let newColumnsData = mostationtaskColumns.map((item) => {
  //     if (needTomergeColumnsIndex.includes(item.dataIndex)) {
  //       // 计算合并单元格数量
  //       const spanArr = getSpanArr(tableDataSource, item.dataIndex);
  //       item.customCell = (record, rowIndex, column) => {
  //         // 设置单元格合并数量
  //         return { rowSpan: spanArr[rowIndex] };
  //       };
  //     }
  //     return item;
  //   });
  //   return newColumnsData;
  // });

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '各个工序的钢卷加工统计报表',
      api: coilprodreport,
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
      name: '各个工序的钢卷加工统计报表',
      url: coilprodreportExportUrl,
    },
  });

  const [registerTable, { reload,getDataSource }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style scoped></style>
