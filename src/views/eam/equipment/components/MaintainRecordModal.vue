<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit">
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>
  <MaintainRecordDetailsModal @register="registerCheckRecordDetailsModal" />
</template>

<script lang="ts" setup>
  import { ref, computed, nextTick } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { eamEquipMaintainPlanList } from '/@/views/eam/equipment/EamEquipment.api';
  import { maintainRecordColumns } from '/@/views/eam/equipment/EamEquipment.data';
  import MaintainRecordDetailsModal from '/@/views/eam/equipment/components/MaintainRecordDetailsModal.vue';

  //注册model
  const [registerCheckRecordDetailsModal, { openModal: openCheckRecordDetailsModal }] = useModal();
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const maintainRecordId = ref(null);

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      searchInfo: { equipId: maintainRecordId, status: 'already_maintain' },
      immediate: false,
      api: eamEquipMaintainPlanList,
      columns: maintainRecordColumns,
      useSearchForm: false,
      canResize: false,
      showActionColumn: true,
      showTableSetting: false,
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    maintainRecordId.value = data.record.id;
    maintainRecordId.value = data.record.id;
    nextTick(() => {
      reload();
    });
  });
  //设置标题
  const title = computed(() => '设备保养记录');
  //表单提交事件
  async function handleSubmit(v) {
    try {
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /**
   * 详情事件
   */
  function handleMaintainRecordDetails(record: Recordable) {
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
        onClick: handleMaintainRecordDetails.bind(null, record),
      },
    ];
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
</style>
