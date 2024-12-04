<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :searchInfo="searchInfo" style="padding: 0px">
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="mst-MeasuringInspItem" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { mstMeasuringInspItemColumns, emaMeasuringInspItemSelectFormSchema } from './MstMeasuringInsp.data';
  import { mstMeasuringInspItemList } from './MstMeasuringInsp.api';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';

  //接收主表id
  const mainId = inject('mainId') || '';
  //提示弹窗
  const $message = useMessage();

  const searchInfo = {};
  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: mstMeasuringInspItemList,
      columns: mstMeasuringInspItemColumns,
      canResize: false,
      // rowSelection: {type : 'radio'},
      useSearchForm: false,
      showActionColumn: false,
      formConfig: {
        schemas: emaMeasuringInspItemSelectFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 120,
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '20', '50', '100'],
      },
    },
  });

  //注册table数据
  const [registerTable, { reload }] = tableContext;

  watch(mainId, () => {
    searchInfo['inspId'] = unref(mainId);
    reload();
  });
</script>
<style scoped></style>
