<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" @row-click="clickRow">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_template:add'"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_template:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_template:importExcel'"
          >导入</j-upload-button
        >
        <!--        <a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--          <template #overlay>-->
        <!--            <a-menu>-->
        <!--              <a-menu-item key="1" @click="batchHandleDelete">-->
        <!--                <Icon icon="ant-design:delete-outlined"></Icon>-->
        <!--                删除-->
        <!--              </a-menu-item>-->
        <!--            </a-menu>-->
        <!--          </template>-->
        <!--          <a-button>批量操作-->
        <!--            <Icon icon="mdi:chevron-down"></Icon>-->
        <!--          </a-button>-->
        <!--        </a-dropdown>-->
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
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载 </a-button>
      </template>
    </BasicTable>
    <!--子表表格tab-->
    <a-tabs defaultActiveKey="1" style="margin-left: 10px">
      <a-tab-pane tab="模板方案明细" key="1">
        <!--<div class="mainTemplateName" v-if="mainName">当前模板：{{ mainName }}</div>-->
        <BasTemplateDetailList />
      </a-tab-pane>
    </a-tabs>
    <!-- 表单区域 -->
    <BasTemplateModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="template-basTemplate" setup>
  import { ref, computed, unref, provide, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import BasTemplateModal from './components/BasTemplateModal.vue';
  import BasTemplateDetailList from './BasTemplateDetailList.vue';
  import { columns, searchFormSchema } from './BasTemplate.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasTemplate.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '模板方案',
      api: list,
      columns,
      canResize: false,
      rowSelection: { type: 'radio' },
      formConfig: {
        schemas: searchFormSchema,
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
      name: '模板方案',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const mainId = ref<string>(),
    mainName = ref<string>();
  //下发 mainId,子组件接收
  provide('mainId', mainId);

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
        auth: 'bas:bas_template:edit',
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
        auth: 'bas:bas_template:delete',
      },
    ];
  }

  function clickRow(event) {
    mainId.value = event.id;
    mainName.value = event.name;
  }
</script>

<style scoped>
  .mainTemplateName {
    position: relative;
    top: -36px;
    left: 100px;
    font-size: 14px;
    color: #2390ff;
    max-width: 80%;
    text-shadow: 0 0 0.25px currentcolor;
  }
</style>
