<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
import {ref, computed, unref, nextTick} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {BasicTable, TableAction} from "/@/components/Table";
  import {useListPage} from "/@/hooks/system/useListPage";
  import {lwmsStockDetailList, putStock} from "/@/views/mes/lwmsstock/MesLwmsStock.api";
  import {lwmsStockDetailColumns} from "/@/views/mes/lwmsstock/MesLwmsStock.data";
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const stockId = ref(null);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      searchInfo:{stockId},
      immediate:false,
      api: lwmsStockDetailList,
      columns:lwmsStockDetailColumns,
      useSearchForm:false,
      canResize: false,
      showActionColumn: false,
      showTableSetting:false
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    stockId.value =  data.record.id;
    nextTick(()=>{
      reload();
    })

  });
  //设置标题
  const title = computed(() => '库存明细'); //表单提交事件
  async function handleSubmit(v) {
    try {
      setModalProps({ confirmLoading: true });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
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
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
  :deep(.ant-select-tree-node-content-wrapper) {
    color: #000000 !important;
  }
</style>
