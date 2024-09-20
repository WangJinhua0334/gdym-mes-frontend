<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" v-auth="'org.jeecg.modules:eam_equipment_type:add'" preIcon="ant-design:plus-outlined">
          新增</a-button
        >
        <a-button type="primary" preIcon="ant-design:export-outlined" v-auth="'org.jeecg.modules:eam_equipment_type:exportXls'" @click="onExportXls">
          导出</a-button
        >
        <j-upload-button
          type="primary"
          preIcon="ant-design:import-outlined"
          v-auth="'org.jeecg.modules:eam_equipment_type:importExcel'"
          @click="onImportXls"
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
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!--子表表格tab-->
    <div style="padding: 10px">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="设备分类点检项" key="1">
          <EamEquipTypeSpotCheckItemList />
        </a-tab-pane>
        <a-tab-pane tab="设备分类保养项" key="2" forceRender>
          <EamEquipTypeMaintainItemList />
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 表单区域 -->
    <EamEquipmentTypeModal @register="registerModal" @success="handleSuccess"></EamEquipmentTypeModal>
  </div>
</template>

<script lang="ts" name="eam-EquipmentType" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import EamEquipmentTypeModal from './components/EamEquipmentTypeModal.vue';
  import EamEquipTypeSpotCheckItemList from './EamEquipTypeSpotCheckItemList.vue';
  import EamEquipTypeMaintainItemList from './EamEquipTypeMaintainItemList.vue';
  import { columns, searchFormSchema } from './EamEquipmentType.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './EamEquipmentType.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '设备分类',
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
      name: '设备分类',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
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
        auth: 'org.jeecg.modules:eam_equipment_type:edit',
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
        auth: 'org.jeecg.modules:eam_equipment_type:delete',
      },
    ];
  }
</script>

<style scoped></style>
