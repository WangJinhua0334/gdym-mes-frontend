<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="null">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_lot_defective:handle'" preIcon="ant-design:export-outlined" @click="handleNg"> 处理</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!-- <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
          <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
            <template #overlay>
              <a-menu>  
                <a-menu-item key="1" @click="batchHandleDelete">
                  <Icon icon="ant-design:delete-outlined"></Icon>
                  删除
                </a-menu-item>
              </a-menu>
            </template>
            <a-button
              >批量操作
              <Icon icon="mdi:chevron-down"></Icon>
            </a-button>
          </a-dropdown> -->
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
    <MesLotDefectiveModal @register="registerModal" @success="handleSuccess" />
    <!-- 处理 -->
    <MesLotDefectiveCompleteModal @register="registerCompleteModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="lotdefective-mesLotDefective" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesLotDefectiveModal from './components/view/MesLotDefectiveModal.vue';
  import MesLotDefectiveCompleteModal from './components/complete/MesLotDefectiveCompleteModal.vue';
  import { columns, searchFormSchema } from './MesLotDefective.data';
  import { list, getExportUrl } from './MesLotDefective.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';

  //提示弹窗
  const $message = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();

  const [registerCompleteModal, { openModal: openCompleteModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
      api: list,
      columns,
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
    },
    exportConfig: {
      name: '在制不良品记录导出',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;

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
   * 处理按钮操作
   */
  function handleNg(record: Recordable) {
    if (unref(selectedRows).length > 1) {
      $message.createMessage.error('请选择单条数据操作！');
      return;
    }
    if (unref(selectedRows) && unref(selectedRows).length > 0) {
      openCompleteModal(true, {
        record: unref(selectedRows)[0],
        isUpdate: false,
        showFooter: true,
      });
    } else {
      openCompleteModal(true, {
        isUpdate: false,
        showFooter: true,
      });
    }
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
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    // processing

    let actionArr: ActionItem[] = [];
    // if (record.status == 'processing') {
    //   actionArr.push({
    //     label: '处理',
    //     onClick: handleEdit.bind(null, record),
    //   });
    // }

    actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    return actionArr;
  }
</script>

<style scoped></style>
