<template>
  <BasicModal v-bind="$attrs" @register="registerListModal" destroyOnClose :title="'检验项目'" :width="1200">
    <!--引用表格-->
    <BasicTable @register="registerListTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_prod_insp_std_item:add'"> 新增</a-button>
        <a-button
          v-if="selectedRowKeys.length > 0"
          type="primary"
          @click="batchHandleDelete"
          preIcon="ant-design:delete-outlined"
          v-auth="'bas:bas_prod_insp_std_item:deleteBatch'"
          >删除</a-button
        >
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_prod_insp_std_item:exportXls'">
          导出</a-button
        >
        <j-upload-button
          type="primary"
          preIcon="ant-design:import-outlined"
          @click="handleImportXls"
          v-auth="'bas:bas_prod_insp_std_item:importExcel'"
          >导入</j-upload-button 
        >-->
      </template>

      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>

  <BasProdInspStdItemModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import BasProdInspStdItemModal from './BasProdInspStdItemModal.vue';
  import { basProdInspStdItemColumns, basInspStdItemSearchFormSchema } from '../BasProdInspStd.data';
  import {
    basProdInspStdItemList,
    basProdInspStdItemDelete,
    basProdInspStdItemDeleteBatch,
    basProdInspStdItemExportXlsUrl,
    basProdInspStdItemImportUrl,
  } from '../BasProdInspStd.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  //提示弹窗
  const $message = useMessage();

  //接收主表id
  const mainId = ref<string>();

  //弹窗model
  const [registerModal, { openModal }] = useModal();

  const [registerListModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    if (!data || !data.record) {
      $message.createMessage.warning('请选择一个主表信息');
      closeModal();
    }

    mainId.value = data.record.id;
    setModalProps({ confirmLoading: false, showOkBtn: false, showCancelBtn: true, cancelText: '返回', defaultFullscreen: true });
  });

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: (params) => {
        params['inspStdId'] = unref(mainId);
        return basProdInspStdItemList(params);
      },
      columns: basProdInspStdItemColumns,
      canResize: true,
      useSearchForm: true,
      formConfig: {
        schemas: basInspStdItemSearchFormSchema,
        labelWidth: 120,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: true,
      actionColumn: {
        width: 160,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 20,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
    },
    exportConfig: {
      name: '料号检验项目',
      url: basProdInspStdItemExportXlsUrl,
      params: {
        inspStdId: unref(mainId),
      },
    },
    importConfig: {
      url: () => {
        return basProdInspStdItemImportUrl + '/' + unref(mainId);
      },
      success: handleSuccess,
    },
  });

  //注册table数据
  const [registerListTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(mainId, () => {
    reload();
  });

  /**导入 */
  function handleImportXls(f) {
    if (!unref(mainId)) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }

    onImportXls(f);
  }

  /**
   * 新增事件
   */
  function handleCreate() {
    openModal(true, {
      inspStdId: unref(mainId),
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
   * 详情
   */
  async function handleDetail(record: Recordable) {
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
    await basProdInspStdItemDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await basProdInspStdItemDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
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
        auth: 'bas:bas_prod_insp_std_item:edit',
      },
    ];
  }

  /**下拉入库 */
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
        auth: 'bas:bas_prod_insp_std_item:delete',
      },
    ];
  }
</script>
