<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_incoming:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'mes:mes_incoming:waitInsp'" @click="handleWaitInsp" preIcon="ant-design:phone-outlined"> 推送IQC</a-button>
        <a-button type="primary" v-auth="'mes:mes_incoming:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" v-auth="'mes:mes_incoming:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
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
          <a-button v-auth="'mes:mes_incoming:deleteBatch'"
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
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }"> </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesIncomingModal @register="registerModal" @success="handleSuccess" />
    <IncomingInspect @register="registerInspModal" @success="handleSuccess" />
    <MesReturnModal @register="registerReturnModal" @success="handleSuccess" />
    <MesStockModal @register="registerStockModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="incoming-mesIncoming" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesIncomingModal from './components/MesIncomingModal.vue';
  import IncomingInspect from './components/insp/IncomingInspect.vue';
  import MesReturnModal from './components/MesReturnModal.vue';
  import MesStockModal from './components/MesStockModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './MesIncoming.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, waitInsp } from './MesIncoming.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';

  const queryParam = reactive<any>({});
  const $message = useMessage();
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerInspModal, { openModal: openInspModal }] = useModal();
  const [registerStockModal, { openModal: openStockModal }] = useModal();
  const [registerReturnModal, { openModal: openReturnModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '来料单',
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
        width: 180,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '来料单',
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
   * 批量推送检验
   */
  async function handleWaitInsp() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要操作的数据');
      return;
    }
    await waitInsp({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 退货
   */
  function handleReturn(record: Recordable) {
    openReturnModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 检验
   */
  function handleInsp(record: Recordable) {
    openInspModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 检验明细
   */
  function handleInspDetail(record: Recordable) {
    openInspModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 入库
   */
  function handleStock(record: Recordable) {
    openStockModal(true, {
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
  /**
   * 操作栏
   */
  function getTableAction(record) {
    let actionArr: ActionItem[] = [];

    if (record.status == 'create') {
      actionArr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes:mes_incoming:edit',
      });
    } else if (record.status == 'wait_insp') {
      actionArr.push({
        label: '检验',
        onClick: handleInsp.bind(null, record),
        auth: 'mes:mes_incoming:insp',
      });
    } else if (record.status == 'wait_stock') {
      actionArr.push({
        label: '入库',
        onClick: handleStock.bind(null, record),
        auth: 'mes:mes_incoming:stock',
      });
    } else if (record.status == 'wait_return') {
      actionArr.push({
        label: '退货',
        onClick: handleReturn.bind(null, record),
        auth: 'mes:mes_incoming:return',
      });
    }
    if (record.status != 'create') {
      actionArr.push({
        label: '检验明细',
        onClick: handleInspDetail.bind(null, record),
      });
    }
    return actionArr;
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    let actionArr: ActionItem[] = [];
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    if (record.status == 'create') {
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mes:mes_incoming:delete',
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
