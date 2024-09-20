<template>
  <BasicModal v-bind="$attrs" @register="registerSnListViewModal" destroyOnClose :title="'条码明细'" :cancelText="'关闭'" :width="800">
    <!-- 子表单区域 -->
    <!--引用表格-->
    <BasicTable @register="registerViewTableSnList">

    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { JVxeTable } from '/@/components/jeecg/JVxeTable';
import MesProductInAdd from './add/MesProductInAdd.vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import {  columns } from './MesProductInSnListView.data';
import { list } from './MesProductInSnListView.api';
import { ref, computed, unref, reactive, onMounted, watch } from 'vue';


const detailId=ref();
//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '',
     api: (params) => {
      params['inDetailId'] = unref(detailId);
      return list(params);
    },
    columns,
    canResize: false,
    immediate: false,
    showTableSetting: false,
    useSearchForm: false,
    showIndexColumn:true,
    showActionColumn: false,
    pagination: true,
    actionColumn: {
      width: 80,
      fixed: 'right',
    },
  },
});
const [registerViewTableSnList, { setTableData,reload }, { rowSelection, selectedRowKeys }] = tableContext;


//表单赋值
const [registerSnListViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: false });
  detailId.value=data.record.id;
  reload();
});

</script>

<style lang="less" scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-calendar-picker) {
  width: 100%;
}
</style>