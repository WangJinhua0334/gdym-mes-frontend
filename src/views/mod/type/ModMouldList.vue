<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :searchInfo="searchInfo">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mod:mod_mould:add'" @click="handleCreate" preIcon="ant-design:plus-outlined" v-if="mainId != ''">
          新增</a-button
        >
        <a-button type="primary" v-auth="'mod:mod_mould:export'" preIcon="ant-design:export-outlined" @click="onExportXls" v-if="mainId != ''">
          导出</a-button
        >
        <j-upload-button type="primary" v-auth="'mod:mod_mould:import'" preIcon="ant-design:import-outlined" @click="onImportXls" v-if="mainId != ''"
          >导入</j-upload-button
        >
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'mod:mod_mould:deleteBatch'"
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
      <template #bodyCell="{ column, record, index, text }"> </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>

    <ModMouldModal @register="registerModal" @success="handleSuccess" />

    <ModMouldModalView @register="registerViewModal" />
    <!-- 领用区域-->
    <ModMouldNeckModal @register="registerNeckModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import ModMouldModal from './components/ModMouldModal.vue';
  import ModMouldNeckModal from './components/ModMouldNeckModal.vue';
  import ModMouldModalView from './components/ModMouldModalView.vue';
  import { modMouldColumns } from './ModMouldType.data';
  import {
    modMouldList,
    modMouldDelete,
    modMouldDeleteBatch,
    modMouldExportXlsUrl,
    modMouldImportUrl,
    refund,
    warehousing,
  } from './ModMouldType.api';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';

  //接收主表id
  const mainId = inject('mainId') || '';
  //提示弹窗
  const $message = useMessage();
  //弹窗model
  const [registerModal, { openModal }] = useModal();
  //查看弹出
  const [registerViewModal, { openModal: openViewModal }] = useModal();
  //领用弹出
  const [registerNeckModal, { openModal: openNeckModal }] = useModal();

  const searchInfo = {};
  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: modMouldList,
      columns: modMouldColumns,
      canResize: false,
      useSearchForm: false,
      actionColumn: {
        title: '操作',
        width: 180,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '模具信息',
      url: modMouldExportXlsUrl,
      params: {
        typeId: mainId,
      },
    },
    importConfig: {
      url: () => {
        return modMouldImportUrl + '/' + unref(mainId);
      },
    },
  });

  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(mainId, () => {
    searchInfo['typeId'] = unref(mainId);
    reload();
  });

  /**
   * 新增事件
   */
  function handleCreate() {
    if (isEmpty(unref(mainId))) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await modMouldDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await modMouldDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 入库事件
   */
  async function handlewarehousing(record) {
    await warehousing(record, handleSuccess);
  }
  /**
   * 领用事件
   */
  async function handneck(record) {
    openNeckModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openViewModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 归还事件
   */
  async function handrefund(record) {
    await refund(record, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    let actionArr: ActionItem[] = [];

    if (record.status == 'Created') {
      actionArr.push({
        label: '入库',
        popConfirm: {
          title: '确定入库吗？',
          confirm: handlewarehousing.bind(null, record),
          getPopupContainer: () => document.body,
        },
        auth: 'mod:mod_mould:warehousing',
      });
    }

    if (record.status == 'InStock') {
      actionArr.push({
        label: '领用',
        onClick: handneck.bind(null, record),
        auth: 'mod:mod_mould:neck',
      });
    }

    if (record.status == 'Used') {
      actionArr.push({
        label: '归还',
        popConfirm: {
          title: '确定归还吗？',
          confirm: handrefund.bind(null, record),
          getPopupContainer: () => document.body,
        },
        auth: 'mod:mod_mould:refund',
      });
    }
    actionArr.push({
      label: '编辑',
      onClick: handleEdit.bind(null, record),
      auth: 'mod:mod_mould:edit',
    });
    if (record.status == 'Created') {
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除?',
          confirm: handleDelete.bind(null, record),
          getPopupContainer: () => document.body,
        },
        auth: 'mod:mod_mould:delete',
      });
    }
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });

    return actionArr;
  }
</script>
