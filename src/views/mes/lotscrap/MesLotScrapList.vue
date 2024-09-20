<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
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
    <MesLotScrapModal @register="registerModal" @success="handleSuccess" />

    <MesLotScrapCompleteModal @register="registerCompleteModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="lotscrap-mesLotScrap" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesLotScrapModal from './components/MesLotScrapModal.vue';
  import MesLotScrapCompleteModal from './complete/MesLotScrapCompleteModal.vue';

  import { columns, searchFormSchema } from './MesLotScrap.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './MesLotScrap.api';

  import { downloadFile } from '/@/utils/common/renderUtils';
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();

  const [registerCompleteModal, { openModal: openCompleteModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
      api: list,
      showTableSetting: false,
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
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '在制报废品',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

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
    openCompleteModal(true, {
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
    let actionArr: any[] = [];
    if (record.status == 'wait_approveing') {
      actionArr.push({
        label: '审核',
        onClick: handleEdit.bind(null, record),
      });
    }
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    return actionArr;
    //  wait_approveing
  }
  //    /**
  //       * 下拉操作栏
  //       */
  // function getDropDownAction(record){
  //      return [
  //        {
  //          label: '详情',
  //          onClick: handleDetail.bind(null, record),
  //        }, {
  //          label: '删除',
  //          popConfirm: {
  //            title: '是否确认删除',
  //            confirm: handleDelete.bind(null, record),
  //          }
  //        }
  //      ]
  //  }
</script>

<style scoped></style>
