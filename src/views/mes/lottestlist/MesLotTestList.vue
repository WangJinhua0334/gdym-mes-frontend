<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="调试项" key="basUnit" forceRender>
            <MesLotTestItemSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
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
      <template #fileSlot="{ record, text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleDetail(record)"
          >查看</a-button
        >
      </template>
    </BasicTable>

    <AttachmentsDrawer @register="registerDrawer" />
  </div>
</template>

<script lang="ts" name="lottestlist-mesLotTestList" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer } from '/@/components/Drawer';
  import MesLotTestItemSubTable from './subTables/MesLotTestItemSubTable.vue';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { testListColumns, testListSearchFormSchema } from './MesLotTest.data';
  import { list, exportUrl } from './MesLotTest.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const [registerDrawer, { openDrawer }] = useDrawer();

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  onMounted(() => {
    setTimeout(() => {
      if (unref(props.componentData) && unref(props.componentData).record.scanInfo.sn) {
        getForm().setFieldsValue({
          lotSn: unref(props.componentData).record.scanInfo.sn,
        });
        reload();
      }
    }, 1000);
    reload();
  });

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '调试记录',
      api: list,
      columns: testListColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: testListSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '调试记录',
      url: exportUrl,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys }] = tableContext;
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
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }

  /**
   * 操作栏
   */
  /*function getTableAction(record) {
    if (record.attachments) {
      return [
        {
          label: '附件',
          onClick: handleDetail.bind(null, record),
        },
      ];
    }
    return [{ label: '无附件' }];
  }*/
</script>

<style scoped></style>
