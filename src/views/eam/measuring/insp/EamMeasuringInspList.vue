<template>
  <div>
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection">
     <!--插槽:table标题-->
      <template #tableTitle>
          <a-button  type="primary" preIcon="ant-design:export-outlined" v-auth="'org.jeecg.modules:eam_measuring_insp:exportExcel'"  @click="onExportXls"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{text}">
         <div v-html="text"></div>
      </template>
      <template #fileSlot="{text}">
         <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
         <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
   </BasicTable>
    <!--子表表格tab-->
    <a-tabs defaultActiveKey="1" style="margin-left: 10px">
      <a-tab-pane tab="量具校验明细" key="1">
        <EamMeasuringInspItemList/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" name="eam-MeasuringInsp" setup>
  import {ref, computed, unref, provide} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage'
  import {useModal} from '/@/components/Modal';
  import EamMeasuringInspItemList from '../insp/EamMeasuringInspItemList.vue'
  import {columns, searchFormSchema} from './EamMeasuringInsp.data';
  import {list,getExportUrl} from './EamMeasuringInsp.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import { selectCompleteDate } from '/@/views/mes/mo/plan/MesMoPlanCreateModal.data';
  const checkedKeys = ref<Array<string | number>>([]);

   //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '量具校验',
           api: list,
           columns,
           canResize:false,
           rowSelection:{type: 'radio'},
           showActionColumn:false,
           formConfig: {
                //labelWidth: 120,
                schemas: searchFormSchema,
                autoSubmitOnEnter:true,
                showAdvancedButton:true,
                fieldMapToNumber: [],
                fieldMapToTime: [],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
           },
           pagination: {
            current:1,
            pageSize: 5,
            pageSizeOptions:['5','10','20'],
           }
        },
        exportConfig: {
            name:"量具校验",
            url: getExportUrl,
        },
    })

 

  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext;

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
   //下发 mainId,子组件接收
  provide('mainId', mainId);

</script>

<style scoped>

</style>