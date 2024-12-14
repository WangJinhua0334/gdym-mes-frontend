<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="报废明细表" key="modMouldScrapItem" forceRender>
            <modMouldScrapItemSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mod:mod_mould_scrap_apply:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 报废</a-button>
        <a-button type="primary" v-auth="'mod:mod_mould_scrap_apply:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <a-button type="primary" v-auth="'mod:mod_mould_scrap_apply:approval'" @click="handleApproval" preIcon="ant-design:plus-outlined">
          审批</a-button
        >
        <a-button
          type="primary"
          v-auth="'mod:mod_mould_scrap_apply:cancel_approval'"
          @click="handleCancelApproval"
          preIcon="ant-design:plus-outlined"
        >
          弃审</a-button
        >
        <a-button type="primary" v-auth="'mod:mod_mould_scrap_apply:print'" @click="print" preIcon="ant-design:plus-outlined"> 报废单打印</a-button>
        <!-- <j-upload-button type="primary" v-auth="'mod:mod_mould_scrap_apply:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
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
          <a-button v-auth="'mod:mod_mould_scrap_apply:deleteBatch'"
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
    </BasicTable>
    <!-- 表单区域 -->
    <ModMouldScrapApplyModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="scrap-modMouldScrapApply" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import ModMouldScrapApplyModal from './components/ModMouldScrapApplyModal.vue';
  import ModMouldScrapItemSubTable from './subTables/ModMouldScrapItemSubTable.vue';
  import { columns, searchFormSchema, superQuerySchema } from './ModMouldScrapApply.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, approval, cancelApproval } from './ModMouldScrapApply.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { printJimuReport } from '/@/utils';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  const { createConfirm } = useMessage();
  const $message = useMessage();

  const queryParam = reactive<any>({});
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const userStore = useUserStore();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '模具报废申请',
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
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '模具报废申请',
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
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 审核事件
   */
  async function handleApproval() {
    createConfirm({
      iconType: 'warning',
      title: '确认审核',
      content: '是否审核选中报废申请',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return approval({ ids: selectedRowKeys.value }).then(() => {
          reload();
        });
      },
    });
  }
  /**
   * 弃审事件
   */
  async function handleCancelApproval() {
    createConfirm({
      iconType: 'warning',
      title: '确认弃审',
      content: '是否弃审选中报废申请',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return cancelApproval({ ids: selectedRowKeys.value }).then(() => {
          reload();
        });
      },
    });
  }
  /**
   * 打印
   */
  async function print() {
    if (!selectedRowKeys.value || selectedRowKeys.value?.length == 0 || selectedRowKeys.value?.length > 1) {
      $message.createMessage.warn('请选择一条记录打印');
      return;
    }
    defHttp
      .get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'mod_mould_scrap_print' } })
      .then((res) => {
        printJimuReport(res, { id: `${selectedRowKeys.value[0]}` }, getToken(), false, () => {
          reload();
        });
      });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    if (record.status == 'audited') {
      $message.createMessage.warn('无法编辑已审核通过的报废单');
      return;
    }
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
    if (record.status == 'audited') {
      $message.createMessage.warn('无法删除已审核通过的报废单');
      return;
    }
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
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mod:mod_mould_scrap_apply:edit',
      },
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
        auth: 'mod:mod_mould_scrap_apply:delete',
      },
    ];
  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
