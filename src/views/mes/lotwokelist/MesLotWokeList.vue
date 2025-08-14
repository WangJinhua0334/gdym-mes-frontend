<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button
          v-if="selectedRowKeys.length > 0"
          type="primary"
          preIcon="ant-design:export-outlined"
          @click="handlePrint"
          v-auth="'mes:mes_lot_woke:print'"
        >
          打印</a-button
        >
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_lot_woke:exportXls'"> 导出</a-button>
      </template>
    </BasicTable>
    <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'选择打印标签'" :centered="true" :width="600" @ok="handleSubmit">
      <BasicForm @register="registerForm" style="padding: 3%" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="lottestlist-mesLotTestList" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listColumns, listSearchFormSchema, printFormSchema } from './MesLotWoke.data';
  import { list, exportUrl } from './MesLotWoke.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { loopPrintJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';

  const $message = useMessage();
  const emit = defineEmits(['setModalProps', 'closeModal']);

  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  onMounted(() => {
    setTimeout(() => {
      if (unref(props.componentData) && unref(props.componentData).record.scanInfo.sn) {
        getForm().setFieldsValue({
          lotSn: unref(props.componentData).record.scanInfo.sn,
        });
        reload();
      }
    }, 1000);
    emit('setModalProps', { defaultFullscreen: true });
    reload();
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal, openModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '报工记录',
      api: list,
      columns: listColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: listSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
    exportConfig: {
      name: '报工记录',
      url: exportUrl,
    },
  });
  /**
   * 新增打印提交
   */
  async function handleSubmit() {
    setModalProps({ loading: true });
    let values = await validate();

    const printPackCodes = [];
    selectedRows.value.map((item) => {
      if (item.id && item.id != null && item.id != '') {
        printPackCodes.push(item.id);
      }
    });
    try {
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: values.templateId, type: 'woke_sn' },
        })
        .then(async (reportRs) => {
          setModalProps({ loading: false });
          // 打印数据集 { reportId, parameters }
          const printSet: any = {};

          const templateIds = Object.keys(reportRs);
          for (const templateId of templateIds) {
            const reportId = reportRs[templateId];
            printSet[reportId] = { id: `${printPackCodes.join(',')}` };
          }

          loopPrintJimuReport(printSet, getToken, () => {
            closeModal();
            $message.createMessage.success('打印成功!');
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 打印-弹出选择打印模板
   */
  function handlePrint() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待打印的记录!');
      return;
    }
    openModal(true, {});
  }

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;
</script>

<style scoped></style>
