<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :searchInfo="searchInfo" @row-click="rowClick">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'pis:pis_project_analysis:add'"> 项目分析</a-button>
        <a-button
          type="primary"
          @click="handleFinish"
          preIcon="ant-design:plus-outlined"
          v-auth="'pis:pis_project_analysis:edit'"
          :disabled="btnDatas.dispatch"
        >
          执行完成</a-button
        >
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown> -->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>

    <PisProjectAnalysisModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import PisProjectAnalysisModal from './components/PisProjectAnalysisModal.vue';
  import { pisProjectAnalysisColumns, searchFormSchema } from './PisProjectAnalysis.data';
  import { pisProjectAnalysisList, pisProjectAnalysisExportXlsUrl, pisProjectAnalysisImportUrl } from './PisProjectAnalysis.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';

  //提示弹窗
  const $message = useMessage();
  //弹窗model
  const [registerModal, { openModal }] = useModal();
  const searchInfo = {};
  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: pisProjectAnalysisList,
      columns: pisProjectAnalysisColumns,
      canResize: false,
      rowSelection: { type: 'radio' },
      formConfig: {
        schemas: searchFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 100,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50'],
      },
    },
    exportConfig: {
      name: '改善分析',
      url: pisProjectAnalysisExportXlsUrl,
    },
    importConfig: {
      url: () => {
        return pisProjectAnalysisImportUrl;
      },
    },
  });

  const btnDatas = {
    dispatch: false,
  };
  //行点击事件
  function rowClick(record, index, event) {
    if (record) {
      console.log(record);
      if (unref(record).acCompleteTime != null) {
        btnDatas.dispatch = true;
      } else {
        btnDatas.dispatch = false;
      }
    }
  }
  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 执行完成
   */
  function handleFinish() {
    if (unref(selectedRowKeys).length != 1) {
      $message.createMessage.warning('请选择单条数据进行操作');
      return;
    }
    openModal(true, {
      record: unref(selectedRows)[0],
      isUpdate: true,
      showFooter: true,
    });
  }
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  function getTableAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>
