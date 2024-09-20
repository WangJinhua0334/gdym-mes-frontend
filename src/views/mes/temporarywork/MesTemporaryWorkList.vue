<template>
  <div>
    <!-- <el-checkbox v-if="mutipleSelect" v-model="selectionList" :label="item.id" @change="ids(item.id)">{{ '' }}</el-checkbox> -->
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'mes_temporary_work:confirm'" @click="batchHandleConfirm" preIcon=""> 确认 </a-button>
        <a-button type="primary" v-auth="'mes_temporary_work:audit'" @click="batchHandleAudit" preIcon=""> 审核</a-button>
        <!-- <a-button type="primary" v-auth="'mes_temporary_work:cancelAudit'" @click="batchHandleCancelAudit" preIcon=""> 弃审</a-button>
        <a-button type="primary" v-auth="'mes_temporary_work:close'" @click="batchHandleClose" preIcon="">关闭</a-button> -->

        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" v-if="selectedRowKeys.length > 0" v-auth="'mes_temporary_work:cancelAudit'" @click="batchHandleCancelAudit">
                弃审
              </a-menu-item>
              <a-menu-item key="2" v-if="selectedRowKeys.length > 0" v-auth="'mes_temporary_work:close'" @click="batchHandleClose">
                关闭
              </a-menu-item>
              <a-menu-item key="3" v-if="selectedRowKeys.length > 0" v-auth="'mes_temporary_work:delete'" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
              <a-menu-item key="4" @click="onExportXls">
                <Icon icon="ant-design:export-outlined" />
                导出
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
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
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleAttachments(record)">
          查看
        </a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesTemporaryWorkModal @register="registerModal" @success="handleSuccess" />
    <!-- 操作表单区域 -->
    <OperateModal @register="registerOperateModal" @success="handleSuccess" />
    <!-- 操作记录区域 -->
    <MesTemporaryWorkRecordListModal @register="registerRecordModal" @success="handleSuccess" />

    <AttachmentsDrawer @register="registerDrawer" />
  </div>
</template>

<script lang="ts" name="MesTemporaryWorkList" setup>
  import { ref, unref, computed, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesTemporaryWorkModal from './components/MesTemporaryWorkModal.vue';
  import OperateModal from './components/OperateModal.vue';
  import MesTemporaryWorkRecordListModal from './components/MesTemporaryWorkRecordListModal.vue';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { columns, searchFormSchema } from './MesTemporaryWork.data';
  import { list, deleteOne, batchDelete, getExportUrl } from './MesTemporaryWork.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  const $message = useMessage();

  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  onMounted(() => {
    setTimeout(() => {
      console.log(props.componentData);
      if (unref(props.componentData) && unref(props.componentData).record.scanInfo.mesMo && unref(props.componentData).record.scanInfo.mesMo.code) {
        getForm().setFieldsValue({
          moCode: unref(props.componentData).record.scanInfo.mesMo.code,
        });
        reload();
      }
    }, 1000);
    reload();
  });
  const checkedKeys = ref<Array<string | number>>([]);
  // 新增、编辑、详情表单
  const [registerModal, { openModal }] = useModal();
  // 确认、审核、弃审、关闭操作表单
  const [registerOperateModal, { openModal: openOperateModal }] = useModal();
  // 操作记录列表
  const [registerRecordModal, { openModal: openRecordModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '临时任务',
      api: list,
      columns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      pagination: true,
      useSearchForm: true,
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 160,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '临时任务',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;

  /**
   * 确认按钮
   */
  function handleConfirm(record: Recordable) {
    openOperateModal(true, {
      ids: [record.id],
      operateType: 'confirm',
      showFooter: true,
    });
  }
  /**
   * 批量确认按钮
   */
  function batchHandleConfirm() {
    if (unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要确认的任务！');
      return;
    }

    openOperateModal(true, {
      ids: selectedRowKeys.value,
      operateType: 'confirm',
      showFooter: true,
    });
  }

  /**
   * 审核按钮
   */
  function handleAudit(record: Recordable) {
    openOperateModal(true, {
      ids: [record.id],
      operateType: 'audit',
      showFooter: true,
    });
  }
  /**
   * 批量审核按钮
   */
  function batchHandleAudit() {
    if (unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要审核的任务！');
      return;
    }

    openOperateModal(true, {
      ids: selectedRowKeys.value,
      operateType: 'audit',
      showFooter: true,
    });
  }

  /**
   * 弃审按钮
   */
  function handleCancelAudit(record: Recordable) {
    openOperateModal(true, {
      ids: [record.id],
      operateType: 'cancelAudit',
      showFooter: true,
    });
  }
  /**
   * 批量弃审按钮
   */
  async function batchHandleCancelAudit() {
    if (unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要弃审的任务！');
      return;
    }

    openOperateModal(true, {
      ids: selectedRowKeys.value,
      operateType: 'cancelAudit',
      showFooter: true,
    });
  }

  /**
   * 关闭按钮
   */
  function handleClose(record: Recordable) {
    openOperateModal(true, {
      ids: [record.id],
      operateType: 'close',
      showFooter: true,
    });
  }
  /**
   * 批量关闭按钮
   */
  async function batchHandleClose() {
    if (unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要关闭的任务！');
      return;
    }

    openOperateModal(true, {
      ids: selectedRowKeys.value,
      operateType: 'close',
      showFooter: true,
    });
  }

  /**
   * 操作记录
   */
  function handleRecord(record: Recordable) {
    openRecordModal(true, {
      id: record.id,
    });
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      viewType: 'add',
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      viewType: 'edit',
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
      viewType: 'detail',
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    if (record.status != 'audit_cancel' && record.status != 'create') {
      $message.createMessage.warning('删除的数据状态不是[创建]或[已弃审]状态，不能删除！');
      return;
    }
    await deleteOne(
      {
        id: record.id,
      },
      handleSuccess
    );
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    let flg = false;
    let mesage = '';
    selectedRows.value.forEach((item) => {
      if (item.status != 'audit_cancel' && item.status != 'create') {
        flg = true;
        mesage += item.code + '，';
      }
    });
    if (flg) {
      $message.createMessage.warning('删除的数据中任务单号[' + mesage + ']状态不是[创建]或[已弃审]状态，不能删除！');
      return;
    }
    await batchDelete(
      {
        ids: selectedRowKeys.value,
      },
      handleSuccess
    );
  }
  /**
   * 详情
   */
  function handleAttachments(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
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
    const actions: any[] = [];
    if (record.status === 'create' || record.status === 'audit_fail' || record.status === 'audit_cancel') {
      actions.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes_temporary_work:edit', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
      actions.push({
        label: '确认',
        onClick: handleConfirm.bind(null, record),
        auth: 'mes_temporary_work:confirm', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
    } else if (record.status === 'confirmed') {
      actions.push({
        label: '审核',
        onClick: handleAudit.bind(null, record),
        auth: 'mes_temporary_work:audit', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
    } else if (record.status === 'audited') {
      actions.push({
        label: '弃审',
        onClick: handleCancelAudit.bind(null, record),
        auth: 'mes_temporary_work:cancelAudit', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
      actions.push({
        label: '关闭',
        onClick: handleClose.bind(null, record),
        auth: 'mes_temporary_work:close', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
    }

    return actions;
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const dropDownActions: any[] = [];
    if (record.status === 'create' || record.status === 'audit_cancel') {
      dropDownActions.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'mes_temporary_work:delete', //通过权限指令控制显示（有权限显示/无权限不显示）
      });
    }

    dropDownActions.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });

    dropDownActions.push({
      label: '操作记录',
      onClick: handleRecord.bind(null, record),
    });

    return dropDownActions;
  }
</script>

<style scoped></style>
