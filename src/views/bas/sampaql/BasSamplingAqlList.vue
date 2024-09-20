<template>
  <div>
    <!--引用表格-->
    <BasicTable
      @register="registerTable"
      :rowSelection="rowSelection"
      :searchInfo="searchInfo"
      :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand"
      style="padding: 0px"
    >
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="抽样AC/RE" key="basSamplingAcRe" forceRender>
            <BasSamplingAcReSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_sampling_aql:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_sampling_aql:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_sampling_aql:importExcel'"
          >导入</j-upload-button
        >
        <j-upload-button
          type="primary"
          preIcon="ant-design:import-outlined"
          @click="handleImportExcelStandAql"
          v-auth="'bas:bas_sampling_aql:importExcelAql'"
          >导入标准AQL数据</j-upload-button
        >
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="handleExportStandAql" v-auth="'bas:bas_sampling_aql:download'"
          >下载标准AQL模板</a-button
        >

        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_sampling_aql:deleteBatch')">
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
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <BasSamplingAqlModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="sampaql-basSamplingAql" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useMethods } from '/@/hooks/system/useMethods';

  import { useModal } from '/@/components/Modal';
  import BasSamplingAqlModal from './components/BasSamplingAqlModal.vue';
  import BasSamplingAcReSubTable from './subTables/BasSamplingAcReSubTable.vue';
  import { columns, searchFormSchema } from './BasSamplingAql.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, Api } from './BasSamplingAql.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const $message = useMessage();
  //接收主表id
  const schemaId = inject('schemaId') || '';
  const { handleImportXls, handleExportXls } = useMethods();
  const searchInfo = {};
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '抽样AQL',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: false,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '抽样AQL',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload, setTableData }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(schemaId, () => {
    if (schemaId.value) {
      searchInfo['schemaId'] = unref(schemaId);
      reload();
    } else {
      setTableData([]);
    }
  });

  function handleExportStandAql() {
    handleExportXls('标准AQL导入模板', Api.downLoadAqlTemplate);
  }

  function handleImportExcelStandAql(v) {
    if (!unref(schemaId)) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }
    handleImportXls(v, Api.importExcelStandAql + '?schemaId=' + unref(schemaId), handleSuccess);
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
        auth: 'bas:bas_sampling_aql:edit',
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
        auth: 'bas:bas_sampling_aql:delete',
      },
    ];
  }
</script>

<style scoped></style>
