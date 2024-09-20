<template>
  <div>
    <BasicTable @register="registerTable" :toolbal="false">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>

    <!-- 抽屉 -->
    <!-- 操作记录 -->
    <ActionRecordDrawer @register="registerActionDrawer" />
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { retraceItemColumns } from '../RetraceReport.data';
  import { listItemById } from '../RetraceReport.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ActionRecordDrawer from './ActionRecordDrawer.vue';
  //import { useModal } from '/@/components/Modal';
  import { watch } from 'vue';

  //注册drawer
  const [registerActionDrawer, { openDrawer }] = useDrawer();
  //const [registerModal, { openModal }] = useModal();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  // 列表页面公共参数、方法
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: (params) => {
        params['id'] = props.id;
        return listItemById(params);
      },
      columns: retraceItemColumns,
      useSearchForm: false,
      rowKey: 'wfsId',
      showIndexColumn: true,
      showTableSetting: false,
      canResize: false,
      showActionColumn: false,
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
    },
  });
  watch(
    () => props.id,
    () => {
      if (props.id && props.id != '') {
        reload();
      }
    }
  );
  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '操作记录',
        onClick: handleAction.bind(null, record),
        //auth: 'ams:ams_orders:edit',
      },
    ];
  }
  /**
   * 操作记录
   */
  function handleAction(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }
</script>
