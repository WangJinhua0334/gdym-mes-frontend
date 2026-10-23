<template>
  <BasicTable @register="registerTable" bordered size="middle" rowKey="id" :canResize="false" @fetch-error="handleFetchError">
    <template #tableTitle>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd" v-auth="'bas:bas_warehouse_area:add'">新增</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" />
    </template>
  </BasicTable>

  <BasWarehouseAreaModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import type { ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import BasWarehouseAreaModal from '../../warehousearea/components/BasWarehouseAreaModal.vue';
  import { columns } from '../../warehousearea/BasWarehouseArea.data';
  import { deleteOne, list } from '../../warehousearea/BasWarehouseArea.api';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });

  const $message = useMessage();
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const areaColumns = computed(() => columns.filter((column) => column.dataIndex !== 'whId_dictText'));

  const [registerTable, { reload }] = useTable({
    api: (params) => list({ ...params, whId: props.id }),
    columns: areaColumns.value,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      fixed: 'right',
      slots: { customRender: 'action' },
    },
    canResize: false,
    rowKey: 'id',
    size: 'middle',
    bordered: true,
    searchInfo: { whId: props.id },
  });

  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
      lockWarehouse: true,
      record: { whId: props.id },
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  async function handleDelete(record: Recordable) {
    await deleteOne({ id: record.id }, handleSuccess);
  }

  function handleSuccess() {
    reload();
  }

  function handleFetchError(error: unknown) {
    const message = error instanceof Error ? error.message : '加载仓库区域失败';
    $message.createMessage.error(message || '加载仓库区域失败');
  }

  function getTableAction(record: Recordable) {
    const actions: ActionItem[] = [];
    if (hasPermission('bas:bas_warehouse_area:edit')) {
      actions.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      });
    }
    if (hasPermission('bas:bas_warehouse_area:delete')) {
      actions.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      });
    }
    return actions;
  }
</script>
