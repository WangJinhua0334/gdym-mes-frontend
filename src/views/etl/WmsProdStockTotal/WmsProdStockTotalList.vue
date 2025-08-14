<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="org.jeecg.modules.lwmslot-mesLwmsLot" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './WmsProdStockTotaldata';
  import { list } from './WmsProdStockTotal.api';

  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '成品库存统计查询',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
      pagination: false,
    },
  });

  const [registerTable, { reload, setLoading }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style scoped></style>
