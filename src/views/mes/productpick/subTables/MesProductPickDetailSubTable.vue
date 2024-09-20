<template>
  <div>
    <!--引用表格-->
    <BasicTable bordered @register="registerTable" :rowSelection="null">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <MesProductPickDetailReceiveModal @register="registerReceiveModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { detailSearchFormSchema, detailBasicColumns } from '../MesProductPick.data';
  import { mesProductPickDetailPage, deleteDetail, revokeDetail } from '../MesProductPick.api';
  import MesProductPickDetailReceiveModal from '../components/MesProductPickDetailReceiveModal.vue';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  // Emits声明
  const emit = defineEmits(['register', 'success']);

  //注册model
  const [registerReceiveModal, { openModal: openReceiveModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.id && props.id != '') {
          parameters['mainId'] = props.id;
        }

        return mesProductPickDetailPage(parameters);
      },
      rowKey: 'id',
      columns: detailBasicColumns,
      showIndexColumn: true,
      showTableSetting: false,
      canResize: true,
      formConfig: {
        schemas: detailSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      pagination: true,
    },
  });

  const [registerTable, { reload }] = tableContext;

  watch(
    () => props.id,
    () => {
      if (props.id && props.id != '') {
        reload();
      }
    }
  );

  async function handleDelete(record) {
    await deleteDetail({ id: record.id }).then(() => {
      handleSuccess();
    });
  }

  function handleReceive(record) {
    openReceiveModal(true, { ...record, pickQty: Number(record.qty) - Number(record.pickedQty ?? 0) });
  }

  async function handleRevoke(record) {
    await revokeDetail({ id: record.id }).then(() => {
      handleSuccess();
    });
  }

  function handleSuccess() {
    emit('success');
    reload();
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    const actionArr: any[] = [];

    if (record.status == 'wait_pick' || record.status == 'picking') {
      actionArr.push({
        label: '收料',
        onclick: handleReceive.bind(null, record),
        auth: 'mes:mes_product_pick:receiveDetail',
      });
    }

    if (record.status == 'picked') {
      actionArr.push({
        label: '撤回',
        popConfirm: {
          title: '是否确认撤回',
          confirm: handleRevoke.bind(null, record),
          auth: 'mes:mes_product_pick:revokeDetail',
        },
      });
    }

    return actionArr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const actionArr: any[] = [];

    if (record.status == 'wait_pick') {
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          auth: 'mes:mes_product_pick:deleteDetail',
        },
      });
    }

    if (record.status == 'picking') {
      actionArr.push({
        label: '撤回',
        popConfirm: {
          title: '是否确认撤回',
          confirm: handleRevoke.bind(null, record),
          auth: 'mes:mes_product_pick:revokeDetail',
        },
      });
    }

    return actionArr;
  }
</script>
