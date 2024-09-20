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
    <MesProductReturnDetailReturnModal @register="registerReturnModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { detailSearchFormSchema, detailColumns } from '../MesProductReturn.data';
  import { mesProductReturnDetailPage, deleteDetail, returnDetail, revokeDetail } from '../MesProductReturn.api';
  import MesProductReturnDetailReturnModal from '../components/MesProductReturnDetailReturnModal.vue';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  // Emits声明
  const emit = defineEmits(['register', 'success']);

  //注册model
  const [registerReturnModal, { openModal: openReturnModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.id && props.id != '') {
          parameters['mainId'] = props.id;
        }

        return mesProductReturnDetailPage(parameters);
      },
      rowKey: 'id',
      columns: detailColumns,
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

  function handleReturn(record) {
    /*await returnDetail({ id: record.id, returnQty: record.qty }).then(() => {
      handleSuccess();
    });*/
    openReturnModal(true, { ...record, returnQty: Number(record.qty) - Number(record.returnedQty) });
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
    const actionArr: any = [];

    if (record.status == 'wait_return' || record.status == 'returning') {
      actionArr.push({
        label: '退料',
        onclick: handleReturn.bind(null, record),
        auth: 'mes:mes_product_return:returnDetail',
      });
    }

    if (record.status == 'returned') {
      actionArr.push({
        label: '撤回',
        popConfirm: {
          title: '是否确认撤回',
          confirm: handleRevoke.bind(null, record),
          auth: 'mes:mes_product_return:revokeDetail',
        },
      });
    }

    return actionArr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const actionArr: any = [];

    if (record.status == 'wait_return') {
      actionArr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          auth: 'mes:mes_product_return:deleteDetail',
        },
      });
    }

    if (record.status == 'returning') {
      actionArr.push({
        label: '撤回',
        popConfirm: {
          title: '是否确认撤回',
          confirm: handleRevoke.bind(null, record),
          auth: 'mes:mes_product_return:revokeDetail',
        },
      });
    }

    return actionArr;
  }
</script>
