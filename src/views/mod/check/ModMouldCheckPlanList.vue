<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="点检项目" key="modMouldCheckRecItem" forceRender>
            <ModMouldCheckRecItemSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mod:mod_mould_check_plan:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'mod:mod_mould_check_plan:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <!-- <j-upload-button type="primary" v-auth="'mod:mod_mould_check_plan:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
          >导入</j-upload-button
        > -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'mod:mod_mould_check_plan:deleteBatch'"
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
    <ModMouldCheckPlanModal @register="registerModal" @success="handleSuccess" />
    <ModMouldCheckPlanAllModal @register="registerAllModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="check-modMouldCheckPlan" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import ModMouldCheckPlanModal from './components/ModMouldCheckPlanModal.vue';
  import ModMouldCheckPlanAllModal from './components/ModMouldCheckPlanAllModal.vue';
  import ModMouldCheckRecItemSubTable from './subTables/ModMouldCheckRecItemSubTable.vue';
  import { columns, searchFormSchema, superQuerySchema } from './ModMouldCheckPlan.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, cancelSpotCheck } from './ModMouldCheckPlan.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore, useUserStoreWithOut } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  const queryParam = reactive<any>({});
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerAllModal, { openModal: openAllModal }] = useModal();
  const userStore = useUserStore();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '模具点检计划',
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
      name: '模具点检计划',
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
    openAllModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 点检
   */
  function handleCheck(record: Recordable) {
    record.acOperateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    record.acOperateBy = useUserStoreWithOut().getUserInfo?.username;
    openAllModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 取消点检
   */
  async function handleCancel(record) {
    await cancelSpotCheck({ id: record.id }, handleSuccess);
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
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    if (record.status == 'wait_check') {
      actionArr.push({
        label: '点检',
        onClick: handleCheck.bind(null, record),
        auth: 'mod:mod_mould_check_plan:check',
      });
      actionArr.push({
        label: '取消',
        popConfirm: {
          title: '是否确认取消',
          confirm: handleCancel.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: () => document.body,
        },
        auth: 'mod:mod_mould_check_plan:cancel_check',
      });
    }
    return actionArr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    let actionArr: ActionItem[] = [];
    if (record.status == 'wait_check') {
      actionArr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mod:mod_mould_check_plan:edit',
      });
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: () => document.body,
        },
        auth: 'mod:mod_mould_check_plan:delete',
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
