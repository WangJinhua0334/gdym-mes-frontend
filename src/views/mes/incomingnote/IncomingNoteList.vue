<template>
  <div class="incoming-note-page">
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button v-if="selectedRowKeys && selectedRowKeys.length > 0" type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint"
          >打印</a-button
        >
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>

    <!-- 编辑弹窗 -->
    <IncomingNoteEditModal @register="registerEditModal" @success="handleSuccess" />

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
  import { BasicTable, TableAction } from '/@/components/Table';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema, printFormSchema } from './IncomingNote.data';
  import { list, deleteOne } from './IncomingNote.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '@/components/Form';
  import { defHttp } from '@/utils/http/axios';
  import { loopPrintJimuReport } from '/@/utils';
  import { getToken } from '@/utils/auth';
  import { useUserStore } from '@/store/modules/user';
  import IncomingNoteEditModal from './components/IncomingNoteEditModal.vue';

  const queryParam = reactive<any>({});
  const $message = useMessage();

  // 注册编辑弹窗
  const [registerEditModal, { openModal: openEditModal }] = useModal();
  // 注册打印弹窗（保留代码结构，但当前不使用）
  const [registerPrintModal] = useModal();

  // 注册打印表单（保留代码结构，但当前不使用）
  const [registerPrintForm] = useForm({
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
      immediate: true, // 页面加载时自动请求查询
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
      showActionColumn: true,
      actionColumn: {
        title: '操作',
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        // 如果需要精确匹配，移除通配符
        if (params.originalCoilNumber) {
          params.originalCoilNumber = params.originalCoilNumber.replace(/\*/g, '');
        }
        return Object.assign(params, queryParam);
      },
    },
  });

  const [registerTable, { getSelectRows, reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes:purchaseReceiptBillDetail:edit',
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'mes:purchaseReceiptBillDetail:delete',
      },
    ];
  }

  /**
   * 编辑
   */
  function handleEdit(record) {
    openEditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 删除
   */
  async function handleDelete(record) {
    await deleteOne(
      {
        internalCoilNumber: record.internalCoilNumber,
        tenantId: useUserStore().getTenant,
      },
      () => {
        $message.createMessage.success('删除成功');
        reload();
      }
    );
  }

  /**
   * 成功回调（编辑等操作用）
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 打印-直接打印（使用指定模板）
   */
  async function handlePrint() {
    try {
      if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        return;
      }

      // 获取选中的行数据
      const selectedRows = getSelectRows();
      if (!selectedRows || selectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
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
        return;
      }

      const templateId = await getPrintTemplate();
      // const templateId = '1986615937373085698'; // 固定模板 ID

      // 获取报表ID
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: templateId, type: 'pick_material_sn' },
        })
        .then(async (reportRs) => {
          // 打印数据集 { reportId, parameters }，使用钢卷号作为参数
          const printSet: any = {};

          const templateIds = Object.keys(reportRs);
          for (const templateId of templateIds) {
            const reportId = reportRs[templateId];
            printSet[reportId] = { id: `${coilNumbers.join(',')}` };
          }

          loopPrintJimuReport(printSet, getToken, () => {
            $message.createMessage.success('打印成功!');
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 打印弹窗提交（保留以保持代码完整性）
   */
  async function handlePrintSubmit() {
    // 当前直接打印，不使用弹窗
    // 此函数保留以避免模板引用错误
  }

  async function getPrintTemplate() {
    try {
      const data = await defHttp.get({
        url: '/userextend/basUserExtend/queryByUsername',
        params: { username: useUserStore().getUserInfo.username },
      });
      if (data.printTemplateId == null){
        return '1986615937373085698';
      }
      return data.printTemplateId; // 返回模板ID
    } catch (error) {
      return '1986615937373085698';
    }
  }
</script>

<style lang="less" scoped>
  .incoming-note-page {
    /* 表单标题和内容样式与"信息输入"分隔栏一致 */
    :deep(.ant-form-item-label > label) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    :deep(.ant-input),
    :deep(.ant-input-number-input),
    :deep(.ant-picker-input > input),
    :deep(.ant-select-selection-item),
    :deep(.ant-radio-button-wrapper) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    :deep(.ant-input-number.ant-input-number-disabled .ant-input-number-input) {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.88);
    }
    /* 表格表头和单元格文字 */
    :deep(.ant-table-thead > tr > th) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
    :deep(.ant-table-tbody > tr > td) {
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
    }
  }

  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
