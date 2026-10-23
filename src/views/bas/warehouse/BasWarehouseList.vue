<template>
  <div>
    <!--引用表格-->
    <BasicTable
      @register="registerTable"
      :rowSelection="rowSelection"
      :expandedRowKeys="expandedRowKeys"
      :rowExpandable="(record) => record.isOpenLocation === 'Y'"
      @expand="handleExpand"
      @row-click="clickRow"
    >
      <template #expandedRowRender="{ record }">
        <BasWarehouseAreaSubTable :id="record.id" />
      </template>
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_warehouse:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_warehouse:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_warehouse:importExcel'"
          >导入</j-upload-button
        >
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="print" v-if="hasPermission('bas:bas_warehouse:print')">
                <Icon icon="ant-design:printer-outlined" />
                打印
              </a-menu-item>
              <a-menu-item key="2" @click="batchHandleDelete" v-if="hasPermission('bas:bas_warehouse:deleteBatch')">
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
    <BasWarehouseModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="warehouse-basWarehouse" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import BasWarehouseModal from './components/BasWarehouseModal.vue';
  import BasWarehouseAreaSubTable from './components/BasWarehouseAreaSubTable.vue';
  import { columns, searchFormSchema } from './BasWarehouse.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasWarehouse.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { printJimuReport } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  // 提示方法声明
  const $message = useMessage();

  const checkedKeys = ref<Array<string | number>>([]);
  const expandedRowKeys = ref<string[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '仓库',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        autoAdvancedCol: 3,
        autoAdvancedLine: 1,
        alwaysShowLines: 1,
        actionColOptions: {
          style: { textAlign: 'right' },
        },
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      }
    },
    exportConfig: {
      name: '仓库',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  function handleExpand(expanded: boolean, record: Recordable) {
    expandedRowKeys.value = expanded && record.isOpenLocation === 'Y' ? [record.id] : [];
  }

  const mainId = ref<string>();

  /* //下发 mainId,子组件接收
  provide('mainId', mainId);*/

  function clickRow(event) {
    mainId.value = event.id;
  }

  function print() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      return;
    }

    defHttp.get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'wh_code' } }).then((res) => {
      printJimuReport(res, { printAll: true, id: `${unref(selectedRowKeys).join(',')}` }, getToken(), false, () => {
        $message.createMessage.success('打印成功!');
      });
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
        auth: 'bas:bas_warehouse:edit',
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
        auth: 'bas:bas_warehouse:delete',
      },
    ];
  }
</script>

<style scoped></style>
