<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit">
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>
  <CheckRecordDetailsModal @register="registerCheckRecordDetailsModal" />
</template>

<script lang="ts" setup>
import {ref, computed, unref, nextTick} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {BasicTable, TableAction} from "/@/components/Table";
import {useListPage} from "/@/hooks/system/useListPage";
import {lwmsStockDetailColumns} from "/@/views/mes/lwmsstock/MesLwmsStock.data";
import {eamEquipSpotCheckPlanList} from "/@/views/eam/equipment/EamEquipment.api";
import {checkRecordColumns} from "/@/views/eam/equipment/EamEquipment.data";
import CheckRecordDetailsModal from "/@/views/eam/equipment/components/CheckRecordDetailsModal.vue";

//注册model
const [registerCheckRecordDetailsModal, {openModal:openCheckRecordDetailsModal}] = useModal();
// Emits声明
const emit = defineEmits(['register','success']);
const isUpdate = ref(true);
const checkRecordId = ref(null);

//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    searchInfo:{equipId:checkRecordId,status:"already_spot_check"},
    immediate:false,
    api: eamEquipSpotCheckPlanList,
    columns:checkRecordColumns,
    useSearchForm:false,
    canResize: false,
    showActionColumn: true,
    showTableSetting:false
  },
});
const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

//表单赋值
const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
  checkRecordId.value =  data.record.id;
  checkRecordId.value =  data.record.id;
  nextTick(()=>{
    reload();
  })
});
//设置标题
const title = computed(() => ("设备点检记录"));
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
 * 详情事件
 */
function handleCheckRecordDetails(record: Recordable) {
  openCheckRecordDetailsModal(true, {
    record,
    showFooter: true,
  });
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: '详情',
      onClick: handleCheckRecordDetails.bind(null, record)
    }
  ];
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
