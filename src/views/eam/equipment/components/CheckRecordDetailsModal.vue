<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
import {ref, computed, unref, nextTick} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {BasicTable, TableAction} from "/@/components/Table";
import {useListPage} from "/@/hooks/system/useListPage";
import {lwmsStockDetailColumns} from "/@/views/mes/lwmsstock/MesLwmsStock.data";
import {
  eamEquipSpotCheckPlanList,
  eamEquipSpotCheckRecItemList
} from "/@/views/eam/equipment/EamEquipment.api";
import {
  checkRecordColumns,
  checkRecordDetailsColumns
} from "/@/views/eam/equipment/EamEquipment.data";
import {downloadFile} from "/@/utils/common/renderUtils";
// Emits声明
const emit = defineEmits(['register','success']);
const isUpdate = ref(true);
const planId = ref(null);

//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    searchInfo:{planId},
    immediate:false,
    api: eamEquipSpotCheckRecItemList,
    columns:checkRecordDetailsColumns,
    useSearchForm:false,
    canResize: false,
    showActionColumn: false,
    showTableSetting:false
  },
});
const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

//表单赋值
const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
  planId.value =  data.record.id;
  nextTick(()=>{
    reload();
  })
});
//设置标题
const title = computed(() => ("设备点检记录详情"));
//表单提交事件
async function handleSubmit(v) {
  try {
    //关闭弹窗
    closeModal();
    //刷新列表
    emit('success');
  } finally {
    setModalProps({confirmLoading: false});
  }
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [];
}
</script>

<style lang="less" scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number){
  width: 100%
}

:deep(.ant-calendar-picker){
  width: 100%
}
</style>
