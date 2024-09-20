<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_work_team_staff:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_work_team_staff:exportXls'">
          导出</a-button
        >
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_work_team_staff:importExcel'"
          >导入</j-upload-button
        >
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_work_team_staff:deleteBatch')">
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
        <TableAction :actions="getTableAction(record)" />
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

    <BasWorkTeamStaffModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import BasWorkTeamStaffModal from '../components/BasWorkTeamStaffModal.vue';
  import { basWorkTeamStaffColumns, basWorkTeamStaffSearchFormSchema } from '../BasWorkTeam.data';
  import {
    basWorkTeamStaffList,
    basWorkTeamStaffDelete,
    basWorkTeamStaffDeleteBatch,
    basWorkTeamStaffExportXlsUrl,
    basWorkTeamStaffImportUrl,
  } from '../BasWorkTeam.api';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const props = defineProps({
    mainId: {
      type: String,
      default: '',
    },
  });

  //接收主表id
  const mainId = computed(() => props.mainId);

  //提示弹窗
  const $message = useMessage();

  //弹窗model
  const [registerModal, { openModal }] = useModal();
  const searchInfo = {};
  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.mainId && props.mainId != '') {
          parameters['teamId'] = props.mainId;
        }

        return basWorkTeamStaffList(parameters);
      },
      columns: basWorkTeamStaffColumns,
      canResize: true,
      useSearchForm: true,
      formConfig: {
        schemas: basWorkTeamStaffSearchFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 180,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50'],
      },
    },
    exportConfig: {
      name: '班组人员表',
      url: basWorkTeamStaffExportXlsUrl,
      params: {
        teamId: mainId,
      },
    },
    importConfig: {
      url: () => {
        return basWorkTeamStaffImportUrl + '/' + unref(mainId);
      },
    },
  });

  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /*watch(mainId, () => {
    searchInfo['teamId'] = unref(mainId);
    reload();
  });*/
  watch(
    () => props.mainId,
    () => {
      if (props.mainId && props.mainId != '') {
        reload();
      }
    }
  );

  /**
   * 新增事件
   */
  function handleCreate() {
    if (isEmpty(unref(mainId))) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }

    openModal(true, {
      teamId: unref(mainId),
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
    await basWorkTeamStaffDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await basWorkTeamStaffDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
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
        auth: 'bas:bas_work_team_staff:edit',
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'bas:bas_work_team_staff:delete',
      },
    ];
  }
</script>
