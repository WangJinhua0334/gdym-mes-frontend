<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="模具维修配件表" key="modMouldRepairParts" forceRender>
            <ModMouldRepairPartsSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mod:mod_mould_repair:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 报修</a-button>
        <a-button type="primary" v-auth="'mod:mod_mould_repair:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!-- <j-upload-button type="primary" v-auth="'mod:mod_mould_repair:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
          >导入</j-upload-button
        >
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'mod:mod_mould_repair:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown> -->
        <!-- 高级查询 -->
        <!-- <super-query :config="superQueryConfig" @search="handleSuperQuery" /> -->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <ModMouldRepairModal @register="registerModal" @success="handleSuccess" />
    <ModMouldAddRepairModal @register="registerAddModal" @success="handleSuccess" />
    <ModMouldConfirmModal @register="registerConfirmModal" @success="handleSuccess" />
    <ModMouldEvaluateModal @register="registerEvaluateModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="repair-modMouldRepair" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import ModMouldRepairModal from './components/ModMouldRepairModal.vue';
  import ModMouldAddRepairModal from './components/ModMouldAddRepairModal.vue';
  import ModMouldConfirmModal from './components/ModMouldConfirmModal.vue';
  import ModMouldEvaluateModal from './components/ModMouldEvaluateModal.vue';
  import ModMouldRepairPartsSubTable from './subTables/ModMouldRepairPartsSubTable.vue';
  import { columns, searchFormSchema, superQuerySchema } from './ModMouldRepair.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, cancel, startRepair } from './ModMouldRepair.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  const queryParam = reactive<any>({});
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerAddModal, { openModal: openAddModal }] = useModal();
  const [registerConfirmModal, { openModal: openConfirmModal }] = useModal();
  const [registerEvaluateModal, { openModal: openEvaluateModal }] = useModal();
  const userStore = useUserStore();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '模具维修',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 220,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '模具维修',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 高级查询配置
  const superQueryConfig = reactive(superQuerySchema);

  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    reload();
  }

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
   * 报修事件
   */
  function handleAdd() {
    openAddModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 确认维修
   */
  function handleConfirm(record: Recordable) {
    openConfirmModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 维修开始
   */
  async function handleStartRepair(record) {
    await startRepair({ id: record.id, mouldId: record.mouldId }, handleSuccess);
  }
  /**
   * 取消维修
   */
  async function handleCancel(record) {
    await cancel({ id: record.id, mouldId: record.mouldId }, handleSuccess);
  }
  /**
   * 维修结束
   */
  function handleEndRepair(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 评价
   */
  function handleEvaluate(record: Recordable) {
    openEvaluateModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openAddModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    if (record.status == 'wait_confirm') {
      openAddModal(true, {
        record,
        isUpdate: true,
        showFooter: false,
      });
    } else if (record.status == 'wait_repair') {
      openConfirmModal(true, {
        record,
        isUpdate: true,
        showFooter: false,
      });
    } else if (record.status == 'repairing') {
      openConfirmModal(true, {
        record,
        isUpdate: true,
        showFooter: false,
      });
    } else if (record.status == 'wait_evaluate') {
      openModal(true, {
        record,
        isUpdate: true,
        showFooter: false,
      });
    } else {
      openEvaluateModal(true, {
        record,
        isUpdate: true,
        showFooter: false,
      });
    }
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
  /**
   * 操作栏
   */
  function getTableAction(record) {
    let actionArr: ActionItem[] = [];
    if (record.status == 'wait_confirm') {
      actionArr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mod:mod_mould_repair:edit',
      });
      actionArr.push({
        label: '确认维修',
        onClick: handleConfirm.bind(null, record),
        auth: 'mod:mod_mould_repair:confirm',
      });
    } else if (record.status == 'wait_repair') {
      actionArr.push({
        label: '开始维修',
        popConfirm: {
          title: '是否确认开始维修',
          confirm: handleStartRepair.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mod:mod_mould_repair:start_repair',
      });
      actionArr.push({
        label: '取消',
        popConfirm: {
          title: '是否确认取消维修',
          confirm: handleCancel.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mod:mod_mould_repair:cancel',
      });
    } else if (record.status == 'repairing') {
      actionArr.push({
        label: '维修完成',
        onClick: handleEndRepair.bind(null, record),
        auth: 'mod:mod_mould_repair:end_repair',
      });
      actionArr.push({
        label: '取消',
        popConfirm: {
          title: '是否确认取消维修',
          confirm: handleCancel.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mod:mod_mould_repair:cancel',
      });
    } else if (record.status == 'wait_evaluate') {
      actionArr.push({
        label: '评价',
        onClick: handleEvaluate.bind(null, record),
        auth: 'mod:mod_mould_repair:evaluate',
      });
    }
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    return actionArr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    let actionArr: ActionItem[] = [];
    if (record.status == 'wait_confirm') {
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mod:mod_mould_repair:delete',
      });
    }
    return actionArr;
  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
