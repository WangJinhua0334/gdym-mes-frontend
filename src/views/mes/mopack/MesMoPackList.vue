<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_mo_pack:exportXls'"> 导出</a-button>
        <a-button
          v-if="selectedRowKeys.length > 0"
          type="primary"
          v-auth="'mes:mes_mo_pack:print'"
          preIcon="ant-design:printer-outlined"
          @click="handlePrint"
        >
          打印
        </a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <template #fileSlot="{ record, text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleDetail(record)"
          >查看</a-button
        >
      </template>
    </BasicTable>

    <AttachmentsDrawer @register="registerDrawer" />
    <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'选择打印标签'" :centered="true" :width="600" @ok="handleSubmit">
      <BasicForm @register="registerForm" style="padding: 3%" />
    </BasicModal>
    <!-- 表单区域 -->
    <MesMoPackModal @register="registerEditModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="MesWkpStockRecordList" setup>
  import { ActionItem, BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import AttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { packList, packListFormSchema, printFormSchema } from './MesMoPack.data';
  import { list, exportXls } from './MesMoPack.api';
  import { onMounted, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { loopPrintJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { BasicForm, useForm } from '/@/components/Form';
  import MesMoPackModal from './components/MesMoPackModal.vue';

  const $message = useMessage();

  const props = defineProps({
    moId: {
      type: String,
      default: '',
    },
    moSnId: {
      type: String,
      default: '',
    },
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  onMounted(() => {
    setTimeout(() => {
      if (unref(props.componentData) && unref(unref(props.componentData).record).workPostCode) {
        getForm().setFieldsValue({
          wkpQuery: unref(unref(props.componentData).record).workPostCode,
        });
        reload();
      }
    }, 1000);
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
  const [registerEditModal, { openModal: openEditModal }] = useModal();
  //注册model
  const [registerDrawer, { openDrawer }] = useDrawer();

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '包装信息',
      api: (parameters) => {
        if (props.moId && props.moId != '') {
          parameters['moId'] = props.moId;
        }
        if (props.moSnId && props.moSnId != '') {
          parameters['snId'] = props.moSnId;
        }
        return list(parameters);
      },
      columns: packList,
      canResize: true,
      pagination: true,
      formConfig: {
        //labelWidth: 120,
        schemas: packListFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '包装信息',
      url: exportXls,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys, selectedRows }] = tableContext;

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }
  /**
   * 新增打印提交
   */
  async function handleSubmit() {
    setModalProps({ loading: true });
    let values = await validate();

    const printPackCodes = [];
    selectedRows.value.map((item) => {
      if (item.code && item.code != null && item.code != '') {
        printPackCodes.push(item.code);
      }
    });
    try {
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: values.templateId, type: 'pack_sn' },
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
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openEditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    const arr: ActionItem[] = [];
    arr.push({
      label: '修改',
      onClick: handleEdit.bind(null, record),
      auth: 'mes:mo_pack:edit',
    });
    return arr;
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style scoped></style>
