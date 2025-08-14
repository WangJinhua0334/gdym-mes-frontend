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
  import { ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './WmsRecord.data';
  import { list } from './WmsRecord.api';
import { mapTableTotalSummary } from '/@/utils/common/compUtils';

  const checkedKeys = ref<Array<string | number>>([]);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: 'WMS对账数据查询',
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
      // 显示底部合计
      showSummary: true,
      // 底部合计计算方法
      summaryFunc: onSummary,
    },
  });

  const [registerTable, { reload, setLoading }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 计算合计
   * @param tableData
   */
  function onSummary(tableData: Recordable[]) {
    // 可用工具方法自动计算合计
    const totals = mapTableTotalSummary(tableData, ['totalprice']);
    return [totals];
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style scoped></style>
