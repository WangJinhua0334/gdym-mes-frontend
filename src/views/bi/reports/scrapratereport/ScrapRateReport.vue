<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="null" :toolbar="false">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <template #listSlot="{ record, text, column }">
        <span v-if="text > 0" style="font-size: 14px; font-style: italic; color: red; font-weight: bold">{{ text }}%</span>
        <span style="font-size: 12px; font-style: italic" v-if="text == 0">{{ text }}%</span>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <div>
      <ScrapRateReportEchart :data="custData" v-if="showCust" />
    </div>
  </div>
</template>

<script lang="ts" name="bi-reports-scrapratereport" setup>
  import { computed, ref, unref } from 'vue';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { formSchema } from './ScrapRateReport.data';
  import { scrapratereport, scrapratereportExportUrl } from './ScrapRateReport.api';
  import ScrapRateReportEchart from './ScrapRateReportEchart.vue';

  let custData = ref({
    xData: [],
    series: [],
  });
  let showCust = ref(false);

  // 表格列设置单元格合并
  const newColumns = computed(() => {
    // 获取表格数据
    const tableDataSource = getDataSource()[0];
    let newColumnsData: BasicColumn[] = [];
    if (tableDataSource) {
      Object.keys(tableDataSource).forEach((item) => {
        if (item == 'code' || item == 'name') {
          newColumnsData.push({
            title: item == 'code' ? '工位编码' : '工位名称',
            align: 'center',
            dataIndex: item,
            fixed: 'left',
            width: 180,
          });
        } else {
          newColumnsData.push({
            title: item,
            align: 'center',
            dataIndex: item,
            width: 100,
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
      api: scrapratereport,
      columns: newColumns,
      pagination: false,
      canResize: false,
      showActionColumn: false,
      //useSearchForm: false,
      formConfig: {
        schemas: formSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      scroll: { y: 200 },
      showIndexColumn: true,
    },
    exportConfig: {
      name: '报废率趋势图统计报表',
      url: scrapratereportExportUrl,
    },
  });
  const [registerTable, { reload, getDataSource, getRawDataSource: getRawDataSourceCust }] = tableContext;
  //处理数据生成折线图
  function handleLoadEchartCust() {
    showCust.value = true;
    const custDataItem = getRawDataSourceCust();
    const xData = ref<any>([]);
    const series = ref<any>([]);
    if (!Array.isArray(custDataItem)) {
      custData.value.xData = xData.value;
      custData.value.series = series.value;
      return;
    }
    // 提取所有日期并去重排序
    const allDates = new Set();
    Object.keys(custDataItem[0])
      .filter((key) => key.includes('-'))
      .forEach((date) => allDates.add(date));
    xData.value = Array.from(allDates).sort();

    // 构建 series 数据
    custDataItem.forEach((item, index) => {
      const data = xData.value.map((date) => item[date] || 0);
      series.value.push({ name: item.code, data });
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
