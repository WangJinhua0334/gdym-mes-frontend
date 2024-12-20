<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!-- 内嵌table区域 begin -->

      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_product_in:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'mes:mes_product_in:confirm'" @click="handleConfirm" preIcon="ant-design:phone-outlined"> 确认</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
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
    <MesProductInModal @register="registerModal" @success="handleSuccess" />
    <MesStockModal @register="registerStockModal" @success="handleSuccess" />
    <ProdInspect @register="registerInspModal" @success="handleSuccess" />
    <MesProductInViewModal @register="registerViewModal" />
  </div>
</template>

<script lang="ts" name="productin-mesProductIn" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import MesProductInModal from './components/MesProductInModal.vue';
  import MesProductInViewModal from './view/MesProductInView.vue';
  import MesStockModal from './components/MesStockModal.vue';
  import ProdInspect from './components/insp/ProdInspect.vue';
  import { columns, searchFormSchema } from './MesProductIn.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, confirm } from './MesProductIn.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  const $message = useMessage();
  //注册model
  const [registerModal, { openModal }] = useModal();

  const [registerViewModal, { openModal: openViewModal }] = useModal();
  const [registerStockModal, { openModal: openStockModal }] = useModal();
  const [registerInspModal, { openModal: openInspModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '入库申请',
      api: list,
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
        title: '操作',
        width: 180,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '入库申请',
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
   * 详情
   */
  function handleDetail(record: Recordable) {
    openViewModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 批量确认
   */
  async function handleConfirm() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择需要操作的数据');
      return;
    }
    await confirm({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 入库
   */
  function handleStock(record: Recordable) {
    openStockModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 检验
   */
  function handleInsp(record: Recordable) {
    openInspModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 检验明细
   */
  function handleInspDetail(record: Recordable) {
    openInspModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
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
    let actionArr: ActionItem[] = [];
    if (record.status == 'wait_insp') {
      actionArr.push({
        label: '检验',
        onClick: handleInsp.bind(null, record),
        auth: 'mes:mes_incoming:insp',
      });
    } else if (record.status == 'wait_stock') {
      actionArr.push({
        label: '入库',
        onClick: handleStock.bind(null, record),
        auth: 'mes:mes_incoming:stock',
      });
    }
    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    if (record.status != 'wait_insp') {
      actionArr.push({
        label: '检验明细',
        onClick: handleInspDetail.bind(null, record),
      });
    }
    return actionArr;
  }

  /**
   * 下拉操作栏
   */
</script>

<style scoped></style>
