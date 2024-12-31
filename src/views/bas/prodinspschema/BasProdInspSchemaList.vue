<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="检验标准" key="prodInspStd" forceRender>
            <BasProdInspStdList :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_prod_insp_schema:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_prod_insp_schema:exportXls'">
          导出</a-button
        >
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_prod_insp_schema:importExcel'"
          >导入</j-upload-button
        >
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
      <template #listSlot="{ record }">
        <a @click="handleSubList(record)">
          <span style="font-size: 12px; font-style: italic">{{ '[' + record.code + ']关联的产品' }}</span>
        </a>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- <a-tabs defaultActiveKey="1" style="margin-left: 10px">
      <a-tab-pane tab="料号检验标准" key="1">
        <BasProdInspStdList />
      </a-tab-pane>
    </a-tabs> -->
    <!-- 表单区域 -->
    <BasProductInspSchemaModal @register="registerModal" @success="handleSuccess" />
    <!-- 工序列表 -->
    <BasicModal
      @register="registerSubModal"
      :defaultFullscreen="true"
      :title="subTitle"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'关闭'"
      destroyOnClose
    >
      <BasProdSchemaList :schemaId="schemaId" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="prodinspschema-basProductInspSchema" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import BasProductInspSchemaModal from './components/BasProdInspSchemaModal.vue';
  import BasProdInspStdList from '../prodinspstd/BasProdInspStdList.vue';
  import BasProdSchemaList from './components/BasProdSchemaList.vue';
  import { columns, searchFormSchema } from './BasProdInspSchema.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasProdInspSchema.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册model
  const [registerSubModal, { openModal: openSubModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '料号检验方案',
      api: list,
      columns,
      canResize: true,
      //rowSelection: { type: 'radio' },
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
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
      },
    },
    exportConfig: {
      name: '料号检验方案',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  // 当前选中行
  const currentRow = ref<any>(null);
  // 当前行ID
  const schemaId = computed(() => (unref(currentRow) ? unref(currentRow).id : ''));
  // 当前行工艺标题
  const subTitle = computed(() => {
    return '检验方案：' + (unref(currentRow) ? unref(currentRow).code + '  ' + unref(currentRow).version : '') + ' 的关联产品列表';
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  //const schemaId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  // provide('schemaId', schemaId);
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
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }
  /**
   * 关联产品列表列表
   */
  function handleSubList(record: Recordable) {
    currentRow.value = record;
    openSubModal(true, {
      record,
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
    // expandedSchemaRowKeys.value=[];
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
        auth: 'bas:bas_prod_insp_schema:edit',
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
        auth: 'bas:bas_prod_insp_schema:delete',
      },
    ];
  }
</script>

<style scoped></style>
