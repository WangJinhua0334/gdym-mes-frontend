<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!--<template #expandedRowRender="{ record }">
        <BasWorkflowViewer :workflowId="record.id" style="height: 580px" />
      </template>-->

      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_workflow:add'"> 新增 </a-button>
        <!-- 导出按钮无意义，先屏蔽按钮 -->
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_workflow:exportXls'"> 导出 </a-button> -->
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_workflow:importExcel'">
          导入
        </j-upload-button>
        <a-button type="primary" preIcon="ant-design:download-outlined" @click="handleExportTemplateXls" v-auth="'bas:bas_workflow:download'">
          下载模版
        </a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_workflow:deleteBatch')">
                <Icon icon="ant-design:delete-outlined" />
                删除
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
      <template #switchSlot="{ text }">
        <a-switch disabled checkedValue="Y" checked-children="是" unCheckedValue="N" un-checked-children="否" :checked="text" />
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载 </a-button>
      </template>

      <template #designerSlot="{ record }">
        <a v-if="record.isRelease != 'Y'" @click="handleDesigner(record)">
          <Icon icon="ant-design:edit-outlined" />
        </a>
      </template>
      <template #wfsListSlot="{ record }">
        <a @click="handleStationList(record)">
          <Icon icon="ant-design:ellipsis-outlined" />
        </a>
      </template>
    </BasicTable>

    <!-- 表单区域 -->
    <BasWorkflowModal @register="registerModal" @success="handleSuccess" />
    <!-- 设计器组件 -->
    <BasWorkflowDesignerModal @register="registerDesignerModal" @success="handleSuccess" @designerClose="onDesignerClose" />
    <!--预览组件-->
    <BasWorkflowViewerModal @register="registerViwerModal" />
    <!--复制组件-->
    <BasWorkflowCopyModal @register="registerViweCopyModal" @success="handleSuccess" />
    <!-- 工序列表 -->
    <BasicModal
      @register="registerStationListModal"
      :defaultFullscreen="true"
      :title="workflowTitle"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'关闭'"
      destroyOnClose
    >
      <BasWorkflowStationList :workflowId="workflowId" :prodId="prodId" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="workflow-basWorkflow" setup>
  import { ref, computed, unref, provide, toRaw } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import BasWorkflowModal from './components/BasWorkflowModal.vue';
  import BasWorkflowDesignerModal from './components/BasWorkflowDesignerModal.vue';
  import BasWorkflowViewerModal from './components/BasWorkflowViewerModal.vue';
  import BasWorkflowStationList from './BasWorkflowStationList.vue';
  import BasWorkflowCopyModal from './components/BasWorkflowCopyModal.vue';
  import { columns, searchFormSchema } from './BasWorkflow.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, getExportTemplateXlsUrl, releaseVersion, releaseBom } from './BasWorkflow.api';

  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { hasPermission } = usePermission();
  const { createConfirm } = useMessage();

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerDesignerModal, { openModal: openDesignerModal }] = useModal();
  const [registerViwerModal, { openModal: openViewerModal }] = useModal();
  const [registerStationListModal, { openModal: openStationListModal }] = useModal();
  const [registerViweCopyModal, { openModal: openViweCopyModal }] = useModal();
  const { handleExportXlsx } = useMethods();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'workflow-template',
    tableProps: {
      title: '工艺路线',
      api: list,
      columns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      // clickToRowSelect: false,
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '工艺路线',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

  /**
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }

  // 当前选中行
  const currentRow = ref<any>(null);
  // 当前行ID
  const workflowId = computed(() => (unref(currentRow) ? unref(currentRow).id : ''));
  // 当前行产品ID
  const prodId = computed(() => (unref(currentRow) ? unref(currentRow).prodId : ''));
  // 当前行工艺标题
  const workflowTitle = computed(() => {
    return '工艺：' + (unref(currentRow) ? unref(currentRow).prodId_dictText + '  ' + unref(currentRow).version : '') + ' 的工序列表信息';
  });

  //下发 mainId,子组件接收
  //provide('workflowId', workflowId);
  // 下发 物料ID
  //provide('prodId', prodId);

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
   * 复制事件
   */
  function handleCopy(record: Recordable) {
    openViweCopyModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openViewerModal(true, {
      record,
      workflowId: record.id,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 工序列表
   */
  function handleStationList(record: Recordable) {
    currentRow.value = record;
    openStationListModal(true, {
      record,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }

  /**
   * 发布新版本
   */
  async function handleRelease(record) {
    createConfirm({
      iconType: 'warning',
      title: '确认发布',
      content: '发布后不能删除，不能修改工艺路线节点，确认要发布该工艺路线吗？',
      onOk: async () => {
        await releaseVersion({ id: record.id }, handleSuccess);
      },
    });
  }
  /**
   * 更新BOM
   */
  async function handleReleaseBom(record) {
    createConfirm({
      iconType: 'warning',
      title: '确认更新',
      content: '更新会根据此工艺路线更新此版本的BOM清单及层级，确认要更新吗？',
      onOk: async () => {
        await releaseBom({ id: record.id }, handleSuccess);
      },
    });
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
    if (record.isRelease != 'Y') {
      arr.push(
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          auth: 'bas:bas_workflow:edit',
        },
        {
          label: '发布',
          onClick: handleRelease.bind(null, record),
          auth: 'bas:bas_workflow:release',
        }
      );
    } else {
      arr.push(
        {
          label: '更新BOM',
          onClick: handleReleaseBom.bind(null, record),
          auth: 'bas:bas_workflow:releaseBom',
        },
        {
          label: '复制',
          onClick: handleCopy.bind(null, record),
          auth: 'bas:bas_workflow:copy',
        },
        {
          label: '预览',
          onClick: handleDetail.bind(null, record),
        }
      );
    }
    return arr;
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const arr: ActionItem[] = [];
    if (record.isRelease != 'Y') {
      arr.push(
        {
          label: '复制',
          onClick: handleCopy.bind(null, record),
          //auth: 'bas:bas_workflow:copy',
        },
        {
          label: '预览',
          onClick: handleDetail.bind(null, record),
        },
        {
          label: '删除',
          popConfirm: {
            title: '是否确认删除',
            confirm: handleDelete.bind(null, record),
          },
          auth: 'bas:bas_workflow:delete',
        }
      );
    }
    return arr;
  }

  function handleExportTemplateXls() {
    handleExportXlsx('工艺路线导入模板', getExportTemplateXlsUrl);
  }

  function handleDesigner(record) {
    // 打开modal
    openDesignerModal(true, {
      record: JSON.parse(record.dataFile),
      workflowId: record.id,
      prodId: record.prodId,
      showFooter: true,
    });
  }

  function onDesignerClose() {
    selectedRowKeys.value = [];
    //window.document.getElementsByClassName('jeecg-multiple-tabs-content__extra-redo')[0].click();
    reload();
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-depart-manage';

  .@{prefix-cls} {
    &--box {
      .ant-tabs-nav {
        padding: 0 20px;
      }
    }
  }

  .title {
    color: #1890ff;
    text-shadow: 0 0 0.25px currentcolor;
    padding: 10px 15px 7px;
    border-bottom: 1px solid #ccc;
    font-size: 15px;
  }
  .container {
    width: 100%;
    height: 100%;
    margin-left: 20px;
  }
</style>
