<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="唯一码" key="mesMoSnSeq" forceRender>
            <MesMoSnSeqSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
          <a-tab-pane tab="打印记录" key="mesMoSnPrintRecord" forceRender>
            <MesMoSnPrintRecordSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <!-- <a-button type="primary" preIcon="ant-design:plus-outlined">绑定流转卡</a-button> -->
        <!-- <a-button type="primary" preIcon="ant-design:appstore-add-outlined" v-auth="'mes:mes_mo_sn:add'" @click="handleCreateSeq">
          创建唯一码
        </a-button> -->
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <a-button
          v-if="selectedRowKeys.length > 0"
          type="primary"
          v-auth="'mes:mes_mo_sn:print'"
          preIcon="ant-design:printer-outlined"
          @click="handlePrint"
        >
          打印
        </a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <template #switchSlot="{ text }">
        <a-switch disabled checkedValue="Y" checked-children="是" unCheckedValue="N" un-checked-children="否" :checked="text" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
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
    <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'选择打印条码'" :centered="true" :width="600" @ok="handleSubmit">
      <BasicForm @register="registerForm" style="padding: 3%" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="mo-mesMoSn" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import MesMoSnSeqSubTable from './subTables/MesMoSnSeqSubTable.vue';
  import MesMoSnPrintRecordSubTable from './subTables/MesMoSnPrintRecordSubTable.vue';
  import { columns, getSearchFormSchema, printFormSchema } from './MesMoSn.data';
  import { list, getExportUrl, queryMoSnPrintMapByIds, createSeq } from './MesMoSn.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';
  import { BasicForm, useForm } from '/@/components/Form';

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const [registerModal, { setModalProps, closeModal, openModal }] = useModal();

  const props = defineProps({
    moId: {
      type: String,
      default: '',
    },
    moPlanId: {
      type: String,
      default: '',
    },
  });

  const $message = useMessage();

  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工单流转卡',
      api: (parameters) => {
        if (props.moId && props.moId != '') {
          parameters['moId'] = props.moId;
        }

        if (props.moPlanId && props.moPlanId != '') {
          parameters['moPlanId'] = props.moPlanId;
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
      showActionColumn: false,
      actionColumn: {
        width: 160,
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
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }
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
              console.log(templateId);
              printSet[reportId] = { id: `${res[templateId].join(',')}` };
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
  /**
   * 创建唯一码
   */
  async function handleCreateSeq() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待创建唯一码的记录!');
      return;
    }

    $message.createConfirm({
      iconType: 'warning',
      title: '确认创建唯一码',
      content: '是否确认创建唯一码',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await createSeq({ id: unref(selectedRowKeys).join(',') }).then((res) => {
            const ids = Object.keys(res);

            defHttp
              .get({
                url: '/template/basTemplate/getReportIdByIds',
                params: { ids: ids.join(','), type: 'mo_sn_seq' },
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
          console.log(error.message);
        }
      },
    });
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    const actionArr: any = [];
    if (record.isUniqSn && record.isUniqSn === 'Y') {
      actionArr.push({
        label: '创建唯一码',
        onClick: handleCreateSeq.bind(null, record),
      });
      actionArr.push({
        label: '绑定唯一码',
        onClick: null, //handleBindSeq.bind(null, record),
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
</script>

<style>
  .ant-table-content {
    overflow-x: auto !important;
  }
</style>
