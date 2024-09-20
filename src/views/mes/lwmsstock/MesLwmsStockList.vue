<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_stock:put_stock'" @click="handlePutStock"> 入库</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_stock:out_stock'" @click="handleOutStock"> 出库</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_stock:exportXls'" @click="onExportXls"> 导出</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_stock:no_code_put_stock'" @click="handleNoCodePutStock"> 工单批量入库</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_stock:no_code_out_stock'" @click="handleNoCodeOutStock"> 工单批量出库</a-button>
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
    <MesLwmsPutStockModal @register="registerPutStockModal" @success="handleSuccess"></MesLwmsPutStockModal>
    <MesLwmsOutStockModal @register="registerOutStockModal" @success="handleSuccess"></MesLwmsOutStockModal>

    <MesLwmsNoCodePutStockModal @register="registerNoCodePutStockModal" @success="handleSuccess"></MesLwmsNoCodePutStockModal>
    <MesLwmsNoCodeOutStockModal @register="registerNoCodeOutStockModal" @success="handleSuccess"></MesLwmsNoCodeOutStockModal>
    <MesLwmsStockDetailModal @register="registerStockDetailModal" @success="handleSuccess"></MesLwmsStockDetailModal>
  </div>
</template>

<script lang="ts" name="lwmsstock-mesLwmsStock" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesLwmsOutStockModal from './components/MesLwmsOutStockModal.vue';
  import MesLwmsPutStockModal from './components/MesLwmsPutStockModal.vue';
  import MesLwmsNoCodeOutStockModal from './components/MesLwmsNoCodeOutStockModal.vue';
  import MesLwmsNoCodePutStockModal from './components/MesLwmsNoCodePutStockModal.vue';
  import { columns, searchFormSchema } from './MesLwmsStock.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './MesLwmsStock.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { getAreaTextByCode } from '../../../components/Form/src/utils/Area';
  import MesLwmsStockDetailModal
    from "/@/views/mes/lwmsstock/components/MesLwmsStockDetailModal.vue";
  import {useUserStoreWithOut} from "/@/store/modules/user";
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerOutStockModal, { openModal: openOutStockModal }] = useModal();
  const [registerPutStockModal, { openModal: openPutStockModal }] = useModal();
  const [registerNoCodeOutStockModal, { openModal: openNoCodeOutStockModal }] = useModal();
  const [registerStockDetailModal, { openModal: openStockDetailModal}] = useModal();
  const [registerNoCodePutStockModal, { openModal: openNoCodePutStockModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '在制库库存表',
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
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '在制库库存表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 入库事件
   */
  function handlePutStock() {
    const record:any = {}
    record.warehousingBy = useUserStoreWithOut().getUserInfo?.username;
    openPutStockModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 出库事件
   */
  function handleOutStock() {
    const record:any = {}
    record.outStockBy = useUserStoreWithOut().getUserInfo?.username;
    openOutStockModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 无码入库
   */
  function handleNoCodePutStock(record: Recordable) {
    record.warehousingBy = useUserStoreWithOut().getUserInfo?.username;
    openNoCodePutStockModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 无码出库
   */
  function handleNoCodeOutStock(record: Recordable) {
    record.outStockBy = useUserStoreWithOut().getUserInfo?.username;
    openNoCodeOutStockModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 出入库明细
   */
  function handleDetail(record: Recordable) {
    openStockDetailModal(true,{
      record,
      showFooter: true,
    })
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
        label: '出入库明细',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [];
  }
</script>

<style scoped></style>
