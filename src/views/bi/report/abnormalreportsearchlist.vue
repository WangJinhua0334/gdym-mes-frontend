<template>
  <div>
    <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoChange" />
    <div style="margin-left: 15px !important; background-color: white !important">
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="null" :toolbar="false" >
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <div style="margin-top: 50px">
            <AbnormalReportsEchart :data="custData" v-if="showCust"/>
          </div>
        </div>
  </div>
</template>

<script lang="ts" name="bi-report-abnormalreportsearchlist" setup>
  import { ref, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { abnormalreportColumns, abnormalreportSearchFormSchema } from './abnormalreportsearchlist.data';
  import { abnormalreportsearchlist, abnormalreportsearchlistExportUrl } from './abnormalreportsearchlist.api';
  import AbnormalReportsEchart from './AbnormalReportsEchart.vue';

  let dateRange = ref('');
  let custData = ref({
    xData: [],
    yData: [],
  });
  let showCust = ref(false);
  //表单配置
  const [registerForm, { getFieldsValue }] = useForm({
    //labelWidth: 150,
    schemas: abnormalreportSearchFormSchema,
    baseColProps: { span: 24 },
  });

  const { tableContext,onExportXls } = useListPage({
    tableProps: {
      api: (params) => {
        params['dateRange'] = dateRange.value;
        return abnormalreportsearchlist(params);
      },
      columns: abnormalreportColumns,
      pagination:false,
      canResize: false,
      showActionColumn: false,
      useSearchForm: false,
      showTableSetting: false,
      showIndexColumn:true,
    },exportConfig: {
      name: '异常报表', 
      url: abnormalreportsearchlistExportUrl,
    },
  });
  const [registerTable, { reload ,getRawDataSource: getRawDataSourceCust},] = tableContext;

  /**
   * 查询事件
   */
   function handleSearchInfoChange() {
    showCust.value = false;
    const dateRange1 = getFieldsValue();
    if (dateRange1.dateRange) {
      dateRange.value = unref(dateRange1).dateRange;
    } else {
      dateRange.value = '';
    }
    reload();
    setTimeout(() => {
      showCust.value = true;
        handleLoadEchartCust();
      }, 500);
  }

  setTimeout(() => {
      showCust.value = true;
        handleLoadEchartCust();
      }, 2000);

  function handleLoadEchartCust() {
    const custDataItem = getRawDataSourceCust();
    const xData = ref<any>([]);
    const yData = ref<any>([]);
    for (const item in unref(custDataItem)) {
      xData.value.push(unref(custDataItem[item]).abnormalType);
      yData.value.push(unref(custDataItem[item]).abnormalNum);
    }
    custData.value.xData = xData.value;
    custData.value.yData = yData.value;
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
