<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="班组人员" key="workTeamStuff" forceRender>
            <BasWorkTeamStaffSubTable :mainId="record.id" />
          </a-tab-pane>
        </a-tabs>
      </template>

      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_work_team:add'"> 新增</a-button>
        <a-button type="primary" @click="handleGetFromK3Cloud" preIcon="ant-design:import-outlined" v-auth="'bas:bas_customer:edit'">同步金蝶班组信息</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_work_team:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_work_team:importExcel'">
          导入
        </j-upload-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down"></Icon>
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
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!--子表表格tab-->
    <!--<a-tabs defaultActiveKey="1" style="margin: 0px 10px">
      <a-tab-pane tab="班组人员" key="1">
        <BasWorkTeamStaffList />
      </a-tab-pane>
    </a-tabs>-->
    <!-- 表单区域 -->
    <BasWorkTeamModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="workteam-basWorkTeam" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import BasWorkTeamModal from './components/BasWorkTeamModal.vue';
  import BasWorkTeamStaffSubTable from './subTables/BasWorkTeamStaffSubTable.vue';
  import { columns, searchFormSchema } from './BasWorkTeam.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasWorkTeam.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from "@/store/modules/user";
  import {defHttp} from "@/utils/http/axios";
  import { useMessage } from '/@/hooks/web/useMessage';



  //注册model
  const [registerModal, { openModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '班组',
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
        width: 180,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50'],
      },
    },
    exportConfig: {
      name: '班组',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

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

  //const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  //provide('mainId', mainId);
  /**
   * 同步金蝶信息
   */
  function handleGetFromK3Cloud() {
    const { createMessage } = useMessage();

    // 显示加载提示
    // const hide = createMessage.loading('正在同步金蝶客户信息...', 0);

    // 调用接口
    defHttp.get({
      url: '/apiService/k3cloudApi/basic/importAllWorkTeams',
      params: {
        tenantId: useUserStore().getTenant,
      }
      // hide();
    });
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
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_work_team:edit',
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
        },
        auth: 'bas:bas_work_team:delete',
      },
    ];
  }
</script>

<style scoped></style>
