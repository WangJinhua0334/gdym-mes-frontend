<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_product_bom:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_product_bom:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_product_bom:importExcel'">
          导入
        </j-upload-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_product_bom:deleteBatch')">
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
      <template #bomDetailSlot="{ record }">
        <a @click="handleBomDetailList(record)">
          <span style="font-size: 12px; font-style: italic">{{ '' + record.prodId_dictText + '的BOM信息' }}</span>
        </a>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <BasProductBomModal @register="registerModal" @success="handleSuccess" />

    <!-- BOM明细列表 -->
    <BasicModal
      @register="registerBomDetailListModal"
      :defaultFullscreen="true"
      :title="bomTitle"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'关闭'"
      destroyOnClose
    >
      <BasProductBomDetailSubTable :bomId="bomId" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="productbom-basProductBom" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import BasProductBomModal from './components/BasProductBomModal.vue';
  import BasProductBomDetailSubTable from './subTables/BasProductBomDetailSubTable.vue';
  import { columns, searchFormSchema } from './BasProductBom.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasProductBom.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerBomDetailListModal, { openModal: openBomDetailListModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '产品BOM',
      api: list,
      columns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      formConfig: {
        schemas: searchFormSchema,
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
      name: '产品BOM',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  // 当前选中行
  const currentRow = ref<any>(null);
  // 当前行ID
  const bomId = computed(() => (unref(currentRow) ? unref(currentRow).id : ''));
  // 当前行BOM标题
  const bomTitle = computed(() => {
    return '产品：' + (unref(currentRow) ? unref(currentRow).prodId_dictText + '  BOM版本[' + unref(currentRow).version : '') + ']的BOM明细信息';
  });
  //const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  //provide('mainId', mainId);

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
   * bom明细列表
   */
  function handleBomDetailList(record: Recordable) {
    currentRow.value = record;
    openBomDetailListModal(true, {
      record,
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
        auth: 'bas:bas_product_bom:edit',
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
        auth: 'bas:bas_product_bom:delete',
      },
    ];
  }
</script>

<style scoped></style>
