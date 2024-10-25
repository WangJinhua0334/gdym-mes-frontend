<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'pis:pis_project:add'"> 新增</a-button>
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
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
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
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
    <!--子表表格tab-->
    <a-tabs defaultActiveKey="1" :stlye="{ 'padding-left': '10px' }">
      <a-tab-pane tab="改善分析" key="1">
        <PisProjectAnalysisList />
      </a-tab-pane>
    </a-tabs>
    <!-- 表单区域 -->
    <PisProjectModal @register="registerModal" @success="handleSuccess" />
    <PisProjectConfrimModal @register="registerConfirmModal" @success="handleSuccess" />
    <PisProjectAuditModal @register="registerAuditModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="project-pisProject" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import PisProjectModal from './components/PisProjectModal.vue';
  import PisProjectConfrimModal from './components/PisProjectConfrimModal.vue';
  import PisProjectAnalysisList from './PisProjectAnalysisList.vue';
  import PisProjectAuditModal from './components/PisProjectAuditModal.vue';
  import { columns, searchFormSchema } from './PisProject.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, editFinish, editSubmit } from './PisProject.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册model
  const [registerConfirmModal, { openModal: openConfirmModal }] = useModal();
  //注册model
  const [registerAuditModal, { openModal: openAuditModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '改善立项',
      api: list,
      columns,
      canResize: false,
      rowSelection: { type: 'radio' },
      formConfig: {
        schemas: searchFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 150,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '改善立项',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  provide('mainId', mainId);
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
   * 效果确认完成
   */
  function handleConfirm(record: Recordable) {
    openConfirmModal(true, {
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
   * 完成确认
   */
  async function handleFinish(record) {
    await editFinish({ id: record.id }, handleSuccess);
  }
  /**
   * 审核
   */
  async function handleAudit(record) {
    openAuditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 提交
   */
  async function handleSubmit(record) {
    await editSubmit({ id: record.id }, handleSuccess);
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
  /**
   * 操作栏
   */
  function getTableAction(record) {
    const arr: ActionItem[] = [];
    if (record.status == 'create') {
      arr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'pis:pis_project:edit',
      });
    }
    if (record.status == 'create') {
      arr.push({
        label: '提交',
        popConfirm: {
          title: '提交之后会推送审核，是否确认提交？',
          confirm: handleSubmit.bind(null, record),
        },
        auth: 'pis:pis_project:editSubmit',
      });
    }
    if (record.status == 'wait_audit') {
      arr.push({
        label: '审核',
        onClick: handleAudit.bind(null, record),
        auth: 'pis:pis_project:editAudit',
      });
    }
    if (record.status == 'doing') {
      arr.push({
        label: '完成确认',
        popConfirm: {
          title: '完成确认之后不能再进行项目分析，是否完成？',
          confirm: handleFinish.bind(null, record),
        },
        auth: 'pis:pis_project:editFinish',
      });
    }
    if (record.status == 'finish') {
      arr.push({
        label: '效果确认',
        onClick: handleConfirm.bind(null, record),
        auth: 'pis:pis_project:editConfrim',
      });
    }
    return arr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const arr: ActionItem[] = [];
    if (record.status == 'create' || record.status == 'wait_audit') {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'pis:pis_project:delete',
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
