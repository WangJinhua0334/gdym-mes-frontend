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

<script lang="ts" name="bi-report-mostationtasksearchlist" setup>
  import { computed, ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { mostationtaskColumns, mostationtaskSearchFormSchema } from './mostationtasksearchlist.data';
  import { mostationtasksearchlist, mostationtasksearchlistExportUrl } from './mostationtasksearchlist.api';
  import { getSpanArr } from '/@/utils/loms.js';

  // 表格列设置单元格合并
  const newColumns = computed(() => {
    // 获取表格数据
    const tableDataSource = getDataSource();
    // 设置需要合并的列
    const needTomergeColumnsIndex = [
      'moId_dictText',
      'moPlanId_dictText',
      'moSnType',
      'workShopId_dictText',
      'wkcIds_dictText',
      'prodId_dictText',
      'prodName_dictText',
      'sn',
    ];
    let newColumnsData = mostationtaskColumns.map((item) => {
      if (needTomergeColumnsIndex.includes(item.dataIndex)) {
        // 计算合并单元格数量
        const spanArr = getSpanArr(tableDataSource, item.dataIndex);
        item.customCell = (record, rowIndex, column) => {
          // 设置单元格合并数量
          return { rowSpan: spanArr[rowIndex] };
        };
      }
      return item;
    });
    return newColumnsData;
  });

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '在制品查询',
      api: mostationtasksearchlist,
      columns: newColumns,
      clickToRowSelect: false,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: mostationtaskSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '在制品查询',
      url: mostationtasksearchlistExportUrl,
    },
  });

  const [registerTable, { reload, getDataSource }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style></style>
