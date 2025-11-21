<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button
          v-if="selectedRowKeys && selectedRowKeys.length > 0"
          type="primary"
          preIcon="ant-design:printer-outlined"
          @click="handlePrint"
        >打印</a-button>
      </template>
    </BasicTable>

    <!-- 打印弹窗 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerPrintModal"
      destroyOnClose
      :title="'选择打印标签'"
      :centered="true"
      :width="600"
      @ok="handlePrintSubmit"
    >
      <BasicForm @register="registerPrintForm" style="padding: 3%" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="incomingnote-incomingNote" setup>
import { reactive, unref } from 'vue';
import { BasicTable } from '/@/components/Table';
import { BasicModal, useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { columns, searchFormSchema, printFormSchema } from './IncomingNote.data';
import { list } from './IncomingNote.api';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, useForm } from '@/components/Form';
import { defHttp } from '@/utils/http/axios';
import { loopPrintJimuReport } from '/@/utils';
import { getToken } from '@/utils/auth';

const queryParam = reactive<any>({});
const $message = useMessage();

// 注册打印弹窗
const [registerPrintModal, { openModal: openPrintModal, closeModal: closePrintModal, setModalProps: setPrintModalProps }] = useModal();

// 注册打印表单
const [registerPrintForm, { validate: validatePrintForm, resetFields: resetPrintFields }] = useForm({
  labelWidth: 100,
  schemas: printFormSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

// 注册table数据
const { tableContext } = useListPage({
  tableProps: {
    title: '收料记录',
    api: list,
    immediate: false, // 页面加载时不自动请求，需手动查询
    columns,
    canResize: false,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      fieldMapToNumber: [],
      fieldMapToTime: [],
      submitButtonOptions: {
        text: '查询',
      },
    },
    showActionColumn: false,
    beforeFetch: (params) => {
      // 如果需要精确匹配，移除通配符
      if (params.originalCoilNumber) {
        params.originalCoilNumber = params.originalCoilNumber.replace(/\*/g, '');
      }
      return Object.assign(params, queryParam);
    },
  },
});

const [registerTable, { reload, getSelectRows }, { rowSelection, selectedRowKeys }] = tableContext;

/**
 * 打印-弹出选择打印模板
 */
function handlePrint() {
  if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
    $message.createMessage.warning('请选择待打印的记录!');
    return;
  }
  resetPrintFields();
  openPrintModal(true, {});
}

/**
 * 打印提交
 */
async function handlePrintSubmit() {
  try {
    setPrintModalProps({ confirmLoading: true });
    const values = await validatePrintForm();

    // 获取选中的行数据
    const selectedRows = getSelectRows();
    if (!selectedRows || selectedRows.length === 0) {
      $message.createMessage.warning('请选择待打印的记录!');
      setPrintModalProps({ confirmLoading: false });
      return;
    }

    // 提取选中行的钢卷号
    const coilNumbers: string[] = [];
    selectedRows.forEach((row: any) => {
      if (row.internalCoilNumber && row.internalCoilNumber !== null && row.internalCoilNumber !== '') {
        coilNumbers.push(row.internalCoilNumber);
      }
    });

    if (coilNumbers.length === 0) {
      $message.createMessage.warning('选中的记录中没有有效的钢卷号!');
      setPrintModalProps({ confirmLoading: false });
      return;
    }

    // 获取报表ID
    defHttp
      .get({
        url: '/template/basTemplate/getReportIdByIds',
        params: { ids: values.templateId, type: 'pick_material_sn' },
      })
      .then(async (reportRs) => {
        setPrintModalProps({ confirmLoading: false });
        // 打印数据集 { reportId, parameters }，使用钢卷号作为参数
        const printSet: any = {};

        const templateIds = Object.keys(reportRs);
        for (const templateId of templateIds) {
          const reportId = reportRs[templateId];
          printSet[reportId] = { id: `${coilNumbers.join(',')}` };
        }

        loopPrintJimuReport(printSet, getToken, () => {
          closePrintModal();
          $message.createMessage.success('打印成功!');
        });
      });
  } catch (error) {
    console.log(error);
    setPrintModalProps({ confirmLoading: false });
  }
}
</script>

<style lang="less" scoped>
:deep(.ant-picker),
:deep(.ant-input-number) {
  width: 100%;
}
</style>

