<template>
  <div class="incoming-note-page">
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button
          v-if="selectedRowKeys && selectedRowKeys.length > 0"
          type="primary"
          :loading="printing"
          preIcon="ant-design:printer-outlined"
          @click="handlePrint"
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
  import { reactive, unref, ref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema, printFormSchema } from './IncomingNote.data';
  import { list, deleteOne } from './IncomingNote.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '@/components/Form';
  import { loopPrintJimuReport } from '/@/utils';
  import { getPrintTemplateCode, getReportIdByTemplateCode } from '/@/utils/printTemplate';
  import { getToken } from '@/utils/auth';
  import { useUserStore } from '@/store/modules/user';
  import { printReceiptLabels } from '../incomingOriented/MesIncomingOriented.api';
  import IncomingNoteEditModal from './components/IncomingNoteEditModal.vue';

  const printing = ref(false);
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
        showAdvancedButton: false,
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
    if (printing.value) return;
    printing.value = true;
    const tenant = Number(useUserStore().getTenant);
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

      const templateCode = await getPrintTemplateCode();

      const orientedNumbers = coilNumbers.filter((number) => /^ZQ\d{12}$/.test(number));
      const normalNumbers = coilNumbers.filter((number) => !/^ZQ\d{12}$/.test(number));
      if (orientedNumbers.length) {
        const reportId = await getReportIdByTemplateCode(templateCode, 'oriented_pick_material_sn');
        if (Number(useUserStore().getTenant) !== tenant) return;
        await printReceiptLabels(reportId, orientedNumbers, tenant);
      }
      if (normalNumbers.length) {
        const reportId = await getReportIdByTemplateCode(templateCode, 'pick_material_sn');
        if (Number(useUserStore().getTenant) !== tenant) return;
        await loopPrintJimuReport({ [reportId]: { id: normalNumbers.join(',') } }, getToken, () => {
          $message.createMessage.success('打印成功!');
        });
      }
    } catch (error) {
      console.error(error);
      $message.createMessage.warning('打印失败，可重新选择记录补打');
    } finally {
      printing.value = false;
    }
  }

  /**
   * 打印弹窗提交（保留以保持代码完整性）
   */
  async function handlePrintSubmit() {
    // 当前直接打印，不使用弹窗
    // 此函数保留以避免模板引用错误
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
