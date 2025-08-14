<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="null" :toolbar="false">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <template #listSlot="{ record, text, column }">
        <span v-if="text > 0" style="font-size: 14px; font-style: italic; color: red; font-weight: bold">{{ text }}</span>
        <span style="font-size: 12px; font-style: italic" v-if="text == 0">{{ text }}</span>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <div>
      <NgReportEchart :data="custData" v-if="showCust" />
    </div>
  </div>
</template>

<script lang="ts" name="bi-reports-ngreport" setup>
  import { computed, ref, unref } from 'vue';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { formSchema } from './NgReport.data';
  import { ngreport, ngreportExportUrl } from './NgReport.api';
  import NgReportEchart from './NgReportEchart.vue';
  import { mapTableTotalSummary } from '/@/utils/common/compUtils';

  let custData = ref({
    xData: [],
    series: [],
  });
  let itemTotalColumns = ref([]);
  let showCust = ref(false);

  // 表格列设置单元格合并
  const newColumns = computed(() => {
    // 获取表格数据
    const tableDataSource = getDataSource()[0];
    let newColumnsData: BasicColumn[] = [];
    if (tableDataSource) {
      Object.keys(tableDataSource).forEach((item) => {
        if (item == 'date') {
          newColumnsData.push({
            title: '日期',
            align: 'center',
            dataIndex: item,
            width: 120,
            fixed: 'left',
            slots: { customRender: 'htmlSlot' },
          });
        } else {
          newColumnsData.push({
            title: item,
            align: 'center',
            dataIndex: item,
            width: 120,
            slots: { customRender: 'listSlot' },
          });
        }
      });
    }
    handleLoadEchartCust();
    return newColumnsData;
  });

  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      api: ngreport,
      columns: newColumns,
      pagination: false,
      canResize: true,
      showActionColumn: false,
      formConfig: {
        schemas: formSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showIndexColumn: true,
      scroll: { y: 200 },
      // 显示底部合计
      showSummary: true,
      // 底部合计计算方法
      summaryFunc: onSummary,
    },
    exportConfig: {
      name: '不良趋势图统计报表',
      url: ngreportExportUrl,
    },
  });
  const [registerTable, { reload, getDataSource, getRawDataSource: getRawDataSourceCust }] = tableContext;
  //处理数据生成折线图
  function handleLoadEchartCust() {
    showCust.value = true;
    const custDataItem = getRawDataSourceCust();
    const xData = ref<any>([]);
    const series = ref<any>([]);
    itemTotalColumns.value = [];
    if (!Array.isArray(custDataItem)) {
      custData.value.xData = xData.value;
      custData.value.series = series.value;
      return;
    }
    for (const item in unref(custDataItem)) {
      xData.value.push(unref(custDataItem[item]).date);
    }
    // 2. 收集不良类型（排除 'date' 字段）
    const ngTypes = Object.keys(custDataItem[0]).filter((key) => key !== 'date');

    // 3. 生成 series.value 数据
    series.value = ngTypes.map((type) => {
      itemTotalColumns.value.push(type);
      const data = xData.value.map((date) => {
        const item = custDataItem.find((item) => item.date === date);
        return item ? item[type] : 0;
      });
      return { name: type, data };
    });

    // xData.value = ['07-10', '07-11', '07-12', '07-13', '07-14', '07-15'];
    // series.value = [
    //   { name: '1不良', data: [10, 0, 5, 4, 4, 2] },
    //   { name: '2不良', data: [5, 0, 5, 4, 2, 2] },
    //   { name: '3不良', data: [7, 4, 5, 6, 1, 2] },
    //   { name: '4不良', data: [10, 0, 5, 5, 3, 2] },
    //   { name: '5不良', data: [8, 0, 5, 4, 7, 2] },
    //   { name: '6不良', data: [10, 50, 5, 2, 1, 2] },
    // ];
    custData.value.xData = xData.value;
    custData.value.series = series.value;
  }
  /**
   * 计算合计
   * @param tableData
   */
  function onSummary(tableData: Recordable[]) {
    // 可用工具方法自动计算合计
    const totals = mapTableTotalSummary(tableData, itemTotalColumns.value);
    return [totals];
  }
</script>

<style scoped>
  form {
    background-color: white;
    margin: 10px 0px;
    padding-top: 13px;
    padding-left: 20px;
  }
  .jeecg-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 13px !important;
  }
</style>
