<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :width="960">
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="null">
      <template #footer>
        <div class="footer-style">库存占用数：{{ invUsedQty }}</div>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getSearchFormSchema, columns } from '../MesMoCompleteKit.data';
  import { queryDistributedListByProdId } from '../MesMoCompleteKit.api';

  const prodId = ref(null);
  const prodId_dictText = ref(null);

  // 库存占用数
  const invUsedQty = ref(0);

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: (params) => {
        params.prodId = unref(prodId);
        return queryDistributedListByProdId(params);
      },
      afterFetch: (data) => {
        let totalQty = 0;
        let totalIssuedQty = 0;
        data.forEach((item) => {
          totalQty += Number(item.qty);
          totalIssuedQty += Number(item.issuedQty ?? 0);
        });

        /*data.push(
          {
            prodName_dictText: '汇总：',
            qty: totalQty,
            issuedQty: totalIssuedQty,
          },
          {
            prodName_dictText: '库存占用数：',
            qty: totalQty - totalIssuedQty,
          }
        );*/

        invUsedQty.value = totalQty - totalIssuedQty;
        return data;
      },
      pagination: false,
      columns,
      canResize: true,
      showIndexColumn: true,
      showActionColumn: false,
      /*showSummary: false,
      summaryFunc: (data) => {
        let totalQty = 0;
        let totalIssuedQty = 0;
        data.forEach((item) => {
          totalQty += Number(item.qty);
          totalIssuedQty += Number(item.issuedQty ?? 0);
        });

        const summary: any[] = [];
        summary.push(
          {
            prodName_dictText: '汇总：',
            qty: totalQty,
            issuedQty: totalIssuedQty,
          },
          {
            prodName_dictText: '库存占用数：',
            qty: totalQty - totalIssuedQty,
          }
        );

        return summary;
      },*/
      showTableSetting: false,
      useSearchForm: true,
      formConfig: {
        schemas: getSearchFormSchema(false),
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        showResetButton: false,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      immediate: false,
    },
  });

  const [registerTable, { getForm, reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //设置标题
  const title = computed(() => prodId_dictText.value + ' - 齐套历史记录');

  //表单赋值
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ loading: false, showOkBtn: false, showCancelBtn: false });

    prodId.value = data.prodId;
    prodId_dictText.value = data.prodId_dictText;

    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.footer-style) {
    color: #606266;
    font-size: 14px;
    font-weight: bold;
  }
</style>
