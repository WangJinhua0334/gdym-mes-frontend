<script setup lang="ts" name="mo-SalesOutbound">

import { defineAsyncComponent } from 'vue';
import { BasicTable, TableAction } from '@/components/Table';
import { useListPage } from '@/hooks/system/useListPage';
import { list } from './SalesOutbound.api';
import { columns, searchFormSchema } from './SalesOutbound.data';
import { useModal } from '@/components/Modal';
import { getTenantId } from '/@/utils/auth';

const SalesOutboundModal = defineAsyncComponent(() => import('./SalesOutboundModal.vue'));

defineOptions({
  components: {
    BasicTable,
    TableAction,
  },
});

/**
 * 销售发货编辑事件
 */
function handleEdit(record: Recordable) {
  // 调用 openModal 打开 SalesOutboundModal，并传递数据
  openModal(true, { record, isUpdate: true, disabled: false });
}
// 使用 useModal 获取注册函数和打开方法
const [registerModal, { openModal }] = useModal();
//注册销售发货table数据
const { tableContext } = useListPage({
  tableProps: {
    title: '销售发货',
    api: list,
    columns,
    canResize: true,
    rowSelection: { type: 'checkbox' },
    pagination: true,
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
    actionColumn: {
      title: '操作',
      width: 160,
      fixed: 'right',
    },
    beforeFetch(params) {
      return Object.assign(params || {}, { tenantId: getTenantId() });
    },
  },
});

const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
/**
 * 操作栏
 */
function getTableAction(record) {
  let arr: any[] = [];
  arr.push({
    label: '备料',
    onClick: handleEdit.bind(null, record),
    // auth: 'mes:mes_SalesOutbound:edit',
  });
  return arr; // 添加返回语句
}

/**
 * 成功回调
 */
function handleSuccess() {
  (selectedRowKeys.value = []) && reload();
}
</script>
<!--销售发货页面-->
<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!-- 注册并使用 SalesOutboundModal 组件 -->
    <SalesOutboundModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<style scoped lang="less" >

</style>
