<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="关联产品" key="relaProduct" forceRender>
            <BasProductFileSubTable :fileId="record.id" />
          </a-tab-pane>
          <a-tab-pane tab="关联产品组" key="relaProductGroup" forceRender>
            <BasProductGroupFileSubTable :fileId="record.id" />
          </a-tab-pane>
        </a-tabs>
      </template>

      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_file:add'">上传文件</a-button>
        <a-button type="primary" @click="batchhHandleAudit" preIcon="ant-design:check-outlined" v-auth="'bas:bas_file:auditBatch'">
          批量审核
        </a-button>
        <a-button type="primary" @click="batchHandleIssued" preIcon="ant-design:arrow-down-outlined" v-auth="'bas:bas_file:issue'">
          批量下发
        </a-button>
        <!--<a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>-->
        <!--<j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <!--<a-dropdown v-if="selectedRowKeys.length > 0">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>批量操作
                <Icon icon="mdi:chevron-down"></Icon>
              </a-button>
        </a-dropdown>-->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <template #listSlot="{ record }">
        <a @click="handleFileList(record)">
          <Icon icon="ant-design:ellipsis-outlined" />
        </a>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <BasFileModal @register="registerModal" @success="handleSuccess" />

    <!--文件批量下发弹窗-->
    <WorkPostSelectModal
      @register="registerWkpSelectModal"
      :title="'文件下发'"
      :code="wkpSelectModalProps.code"
      :groupId="wkpSelectModalProps.uniqGroupId"
      :multi="wkpSelectModalProps.multi"
      :sorter="wkpSelectModalProps.sorter"
      :param="wkpSelectModalProps.params"
      :columns="wkpSelectModalProps.columns"
      :queryInfo="wkpSelectModalProps.queryInfo"
      :method="wkpSelectModalProps.method"
      :url="wkpSelectModalProps.url"
      :options="wkpSelectModalProps.options"
      destroyOnClose
      @ok="wkpSelectCallBack"
    />
    <!--文件下发列表-->
    <BasicModal
      @register="registerFileListModal"
      :defaultFullscreen="true"
      :title="showTitle"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'关闭'"
      destroyOnClose
    >
      <BasFileIssueList :fileId="fileId" />
    </BasicModal>
    <!--文件在线预览-->
    <FilePreviewModal @register="registerFilePreviewModal" />
  </div>
</template>

<script lang="ts" name="file-basFile" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import BasFileModal from './components/BasFileModal.vue';
  import WorkPostSelectModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import BasProductFileSubTable from './subTables/BasProductFileSubTable.vue';
  import BasProductGroupFileSubTable from './subTables/BasProductGroupFileSubTable.vue';
  import BasFileIssueList from './BasFileIssueList.vue';
  import { columns, searchFormSchema } from './BasFile.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, audit, cancelAudit, issue, getOnlinePreviewUrl } from './BasFile.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FilePreviewModal from '/@/views/bas/file/components/FilePreviewModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const $message = useMessage();

  const wkpSelectModalCode = computed(() => buildUUID());
  /**工位选择弹出配置 */
  const wkpSelectModalProps = {
    code: unref(wkpSelectModalCode),
    uniqGroupId: 'uniq_' + unref(wkpSelectModalCode),
    multi: true,
    sorter: '',
    params: {},
    columns: [
      {
        title: '编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'type_dictText',
      },
      {
        title: '工作中心',
        align: 'center',
        dataIndex: 'wkcId_dictText',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '名称',
        mode: 'single',
        view: 'string',
      },
    ],
    method: 'get',
    url: '/workpost/basWorkPost/list',
    options: [],
  };

  //注册model
  const [registerModal, { openModal }] = useModal();
  /*注册文件下发表单弹窗*/
  const [registerWkpSelectModal, { openModal: openWkpSelectModal }] = useModal();
  /*注册文件下发列表弹窗*/
  const [registerFileListModal, { openModal: openFileListModal }] = useModal();

  /*注册文件预览弹窗*/
  const [registerFilePreviewModal, { openModal: openFilePreviewModal }] = useModal();

  // 文件下发列表选择行ID
  const fileId = ref('');
  // 文件下发列表标题
  const showTitle = ref('');

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      api: list,
      columns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 250,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '文件',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

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
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 文件下发
   */
  function batchHandleIssued() {
    if (unref(selectedRowKeys).length === 0) {
      $message.createMessage.warning('请选择待下发文件行！');
      return;
    }

    fileId.value = unref(selectedRowKeys).join(',');
    openWkpSelectModal(true);
  }
  /**
   * 文件批量下发
   */
  function handleIssued(record: Recordable) {
    fileId.value = record.id;
    openWkpSelectModal(true);
  }
  /**
   * 文件下发列表
   */
  function handleFileList(record: Recordable) {
    fileId.value = record.id;
    showTitle.value = '文件' + record.code + '（' + record.name + '）' + '的下发记录';
    openFileListModal(true, {
      record,
    });
  }

  /**
   * 审核
   */
  async function handleAudit(record) {
    await audit({ id: record.id }).then((res) => {
      reload();
    });
  }
  /**
   * 批量审核
   */
  async function batchhHandleAudit() {
    if (!selectedRowKeys.value.length) {
      $message.createMessage.warning('请选择待审核文件行！');
      return;
    }

    $message.createConfirm({
      iconType: 'warning',
      title: '确认审核',
      content: '是否审核选中数据',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await audit({ id: selectedRowKeys.value.join(',') }).then((res) => {
          reload();
        });
      },
    });
  }

  /**
   * 弃审
   */
  async function handleCancelAudit(record) {
    await cancelAudit({ id: record.id }).then((res) => {
      reload();
    });
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**文件下发选择回调 */
  async function wkpSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const wkpIds: any[] = [];
      for (let row of rows) {
        wkpIds.push(row.id);
      }

      try {
        await issue({ fileId: unref(fileId), wkpId: wkpIds.join(',') }).then(() => {
          handleSuccess();
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record: Recordable) {
    const arr: any = [];
    if (!record.status || record.status === 'N') {
      arr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_file:edit',
      });
      if (
        (record.category != '看板文件' && userStore.getUserInfo.realname == record.createBy_dictText) ||
        (userStore.getUserInfo.roleName &&
          (userStore.getUserInfo.roleName.includes('超级管理员') || userStore.getUserInfo.roleName.includes('文件审核')))
      ) {
        arr.push({
          label: '审核',
          popConfirm: {
            title: '是否确认审核',
            confirm: handleAudit.bind(null, record),
          },
          auth: 'bas:bas_file:audit',
        });
      }
    }
    arr.push({
      label: '在线预览',
      onClick: handOnlineView.bind(null, record),
    });
    return arr;
  }
  /**
   * 在线预览
   */
  async function handOnlineView(record: Recordable) {
    let params = {};
    params['fileUrl'] = record.file;
    getOnlinePreviewUrl(params).then((res) => {
      if (res && res.success) {
        //window.open(res.result);
        openFilePreviewModal(true, { data: res.result });
      }
    });
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const arr: any = [];

    if (record.status === 'Y') {
      arr.push(
        {
          label: '弃审',
          popConfirm: {
            title: '是否确认弃审',
            confirm: handleCancelAudit.bind(null, record),
          },
          auth: 'bas:bas_file:cancelAudit',
        },
        {
          label: '下发',
          onClick: handleIssued.bind(null, record),
          auth: 'bas:bas_file:issue',
        }
      );
    }
    if (!record.status || record.status === 'N') {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'bas:bas_file:delete',
      });
    }
    arr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });

    return arr;
  }
</script>

<style scoped></style>
