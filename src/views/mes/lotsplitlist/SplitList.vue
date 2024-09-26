<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button v-if="selectedRowKeys.length > 0" type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint"> 打印 </a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="mo-mesMoSn" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './SplitList.data';
  import { list, queryLotSnPrintMapByIds } from './SplitList.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';

  const $message = useMessage();
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '拆分条码记录',
      api: list,
      columns,
      canResize: true,
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  async function handlePrint() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待打印的记录!');
      return;
    }
    try {
      await queryLotSnPrintMapByIds({ ids: unref(selectedRowKeys).join(',') }).then(async (res) => {
        const ids = Object.keys(res);
        defHttp
          .get({
            url: '/template/basTemplate/getReportIdByIds',
            params: { ids: ids.join(','), type: 'mo_sn' },
          })
          .then(async (reportRs) => {
            // 打印数据集 { reportId, parameters }
            const printSet: any = {};

            const templateIds = Object.keys(reportRs);
            for (const templateId of templateIds) {
              const reportId = reportRs[templateId];
              printSet[reportId] = { id: `${res[templateId].join(',')}` };
            }

            loopPrintJimuReport(printSet, getToken, () => {
              $message.createMessage.success('打印成功!');
            });
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
</script>
<style></style>
