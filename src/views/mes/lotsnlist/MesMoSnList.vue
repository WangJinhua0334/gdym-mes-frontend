<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <a-button v-if="selectedRowKeys.length > 0" type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint"> 打印 </a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #switchSlot="{ text }">
        <a-switch disabled checkedValue="Y" checked-children="是" unCheckedValue="N" un-checked-children="否" :checked="text" />
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
  </div>
  <BasicModal @register="registerManualModal" destroyOnClose :title="'关联'" :width="800" @cancel="closeManualModal" @ok="handleManualBindSubmit">
    <BasicForm @register="registerSubForm" />
  </BasicModal>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'选择打印条码'" :centered="true" :width="600" @ok="handleSubmit">
    <BasicForm @register="registerForm" style="padding: 3%" />
  </BasicModal>
</template>

<script lang="ts" name="mo-mesMoSn" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, getSearchFormSchema, bindFormSchema, printFormSchema } from './MesMoSn.data';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { list, getExportUrl, queryMoSnPrintMapByIds, manualBindSn } from './MesMoSn.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';
  import { BasicForm, useForm } from '/@/components/Form/index';

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal, openModal }] = useModal();
  //获取父组件传递的数据
  const props = defineProps({
    moId: {
      type: String,
      default: '',
    },
    moPlanId: {
      type: String,
      default: '',
    },
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  const $message = useMessage();
  //注册table数据
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工单流转卡',
      api: (parameters) => {
        if (props.moId && props.moId != '') {
          parameters['moId'] = props.moId;
        }
        if (props.moPlanId && props.moPlanId != '') {
          parameters['moPlanId'] = props.moPlanId;
        }
        if (
          unref(props.componentData.record).moPlan &&
          unref(props.componentData.record.moPlan).moPlanId &&
          unref(props.componentData.record.moPlan).moPlanId != ''
        ) {
          parameters['moPlanId'] = unref(props.componentData.record.moPlan).moPlanId;
        }
        return list(parameters);
      },
      columns,
      canResize: true,
      formConfig: {
        schemas: getSearchFormSchema(props.moId, props.moPlanId),
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: true,
      actionColumn: {
        width: 100,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '工单流转卡',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增打印提交
   */
  async function handleSubmit() {
    setModalProps({ loading: true });
    let values = await validate();
    try {
      await queryMoSnPrintMapByIds({ ids: unref(selectedRowKeys).join(','), templateId: values.templateId }).then(async (res) => {
        const ids = Object.keys(res);

        defHttp
          .get({
            url: '/template/basTemplate/getReportIdByIds',
            params: { ids: ids.join(','), type: 'mo_sn' },
          })
          .then(async (reportRs) => {
            setModalProps({ loading: false });
            // 打印数据集 { reportId, parameters }
            const printSet: any = {};

            const templateIds = Object.keys(reportRs);
            for (const templateId of templateIds) {
              const reportId = reportRs[templateId];
              printSet[reportId] = { id: `'${res[templateId].join("','")}'` };
            }

            loopPrintJimuReport(printSet, getToken, () => {
              closeModal();
              $message.createMessage.success('打印成功!');
            });
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
  //表单配置
  const [registerSubForm, { resetFields: resetSubFromFields, setFieldsValue: setSubFromFieldsValue, validate: validateSubFrom }] = useForm({
    labelWidth: 150,
    schemas: bindFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });

  const [registerManualModal, { setModalProps: setManualModalProps, openModal: openManualModal, closeModal: closeManualModal }] = useModal();

  /**
   * 替换事件
   * @param record 当前行数据
   */
  async function handleReplace(record: Recordable) {
    await openManualModal(true);

    await resetSubFromFields();

    const values = { ...record };
    values.bindQty = 1;
    await setSubFromFieldsValue(values);
    document.getElementById('form_item_bindSn')?.focus();
    // document.getElementById('form_item_bindSn')?.onkeyup(ev=>{
    //   handleKeyup(ev);
    // })
    document.getElementById('form_item_bindSn')?.addEventListener('keyup', function (e) {
      handleKeyup(e);
    });
  }

  function handleKeyup(event) {
    if (event.key == 'Enter') {
      handleManualBindSubmit();
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    const actionArr: any = [];
    if (record.isInput && record.isInput === 'N') {
      actionArr.push({
        label: '关联',
        onClick: handleReplace.bind(null, record),
      });
    }

    return actionArr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [];
  }
  /**
   * 替换事件提交
   */
  async function handleManualBindSubmit() {
    const values = await validateSubFrom();

    try {
      setManualModalProps({ confirmLoading: true });
      await manualBindSn({ id: values.id, bindSn: values.bindSn }).then(() => {
        closeManualModal();
        reload();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setManualModalProps({ confirmLoading: false });
    }
  }
</script>

<style>
  .ant-table-content {
    overflow-x: auto !important;
  }
</style>
