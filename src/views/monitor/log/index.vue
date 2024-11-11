<template>
  <BasicTable :ellipsis="true" @register="registerTable" :searchInfo="searchInfo" :columns="logColumns" :expand-column-width="16">
    <template #tableTitle>
      <a-tabs defaultActiveKey="4" @change="tabChange" size="small">
        <a-tab-pane tab="异常日志" key="4" />
        <a-tab-pane tab="登录日志" key="1" />
        <a-tab-pane tab="操作日志" key="2" />
        <a-tab-pane tab="接口日志" key="5" />
      </a-tabs>
    </template>
    <template #expandedRowRender="{ record }">
      <div v-if="searchInfo.logType == '2'">
        <div style="margin-bottom: 5px">
          <a-badge status="success" style="vertical-align: middle" />
          <span style="vertical-align: middle">请求方法:{{ record.method }}</span></div
        >
        <div>
          <a-badge status="processing" style="vertical-align: middle" />
          <span style="vertical-align: middle">请求参数:{{ record.requestParam }}</span></div
        >
      </div>
      <div v-if="searchInfo.logType == '4'">
        <div style="margin-bottom: 5px">
          <a-badge status="success" style="vertical-align: middle" />
          <span class="error-box" style="vertical-align: middle">异常堆栈:{{ record.requestParam }}</span>
        </div>
      </div>
      <div v-if="searchInfo.logType == '5'">
        <div style="margin-bottom: 5px">
          <a-badge status="success" style="vertical-align: middle" />
          <span v-if="!record.requestParam" style="font-size: 12px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(record.requestParam)"
            >下载</a-button
          >
        </div>
      </div>
    </template>
    <!--操作栏-->
    <template #action="{ record }">
      <TableAction v-if="searchInfo.logType == '5'" :actions="getTableAction(record)" />
    </template>
  </BasicTable>
  <!-- 工单新增/编辑表单区域 -->
  <again @register="registerMoModal" @success="handleSuccess" />
</template>
<script lang="ts" name="monitor-log" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getLogList } from './log.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import {
    columns,
    searchFormSchema,
    operationLogColumn,
    operationSearchFormSchema,
    exceptionColumns,
    apiLogColumn,
    apiSearchFormSchema,
  } from './log.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import again from './components/again.vue';

  //注册model
  const [registerMoModal, { openModal: openMoModal }] = useModal();
  const { createMessage } = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);

  const logColumns = ref<any>(columns);
  const searchSchema = ref<any>(searchFormSchema);
  const searchInfo = { logType: '4' };
  // 列表页面公共参数、方法
  const { prefixCls, tableContext } = useListPage({
    designScope: 'user-list',
    tableProps: {
      title: '日志列表',
      api: getLogList,
      expandRowByClick: true,
      showActionColumn: false,
      rowSelection: {
        columnWidth: 20,
      },
      formConfig: {
        schemas: searchSchema,
        fieldMapToTime: [['fieldTime', ['createTime_begin', 'createTime_end'], 'YYYY-MM-DD']],
      },
    },
  });

  const [registerTable, { reload, setProps }] = tableContext;

  // 日志类型
  function tabChange(key) {
    searchInfo.logType = key;
    //update-begin---author:wangshuai ---date:20220506  for：[VUEN-943]vue3日志管理列表翻译不对------------
    if (key == '2') {
      logColumns.value = operationLogColumn;
      setProps({ formConfig: { schemas: operationSearchFormSchema }, showActionColumn: false });
    } else if (key == '4') {
      setProps({ formConfig: { schemas: searchFormSchema }, showActionColumn: false });
      logColumns.value = exceptionColumns;
    } else if (key == '5') {
      logColumns.value = apiLogColumn;
      setProps({ formConfig: { schemas: apiSearchFormSchema }, showActionColumn: true });
    } else {
      setProps({ formConfig: { schemas: searchFormSchema }, showActionColumn: false });
      logColumns.value = columns;
    }
    //update-end---author:wangshuai ---date:20220506  for：[VUEN-943]vue3日志管理列表翻译不对--------------
    reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    let arr: any[] = [];
    arr.push({
      label: '再次请求',
      onClick: handleAgain.bind(null, record),
      auth: 'system:log:again',
    });
    return arr;
  }
  /**
   * 弹出请求界面
   */
  function handleAgain(record: Recordable) {
    openMoModal(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
</script>
<style lang="less" scoped>
  .error-box {
    white-space: break-spaces;
  }
</style>
