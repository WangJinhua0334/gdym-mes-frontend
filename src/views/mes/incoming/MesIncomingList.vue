<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
<!--      <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">-->
<!--        <BasicForm @register="registerForm" name="MesReceiveForm" />-->
<!--      </BasicModal>-->
<!--      插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_incoming:add'" @click="handleAdd" preIcon="ant-design:plus-outlined">收料</a-button>
        <a-button type="primary" @click="handleGetFromK3Cloud" preIcon="ant-design:import-outlined">同步金蝶预送货单信息</a-button>
<!--                <a-button type="primary" v-auth="'mes:mes_incoming:waitInsp'" @click="handleWaitInsp" preIcon="ant-design:phone-outlined"> 推送IQC</a-button>-->
<!--                <a-button type="primary" v-auth="'mes:mes_incoming:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>-->
<!--                <j-upload-button type="primary" v-auth="'mes:mes_incoming:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"-->
<!--                  >导入</j-upload-button>-->
                <a-button 
                  v-if="selectedRowKeys && selectedRowKeys.length > 0" 
                  type="primary" 
                  preIcon="ant-design:printer-outlined" 
                  @click="handlePrint"
                >打印</a-button>
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'mes:mes_incoming:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown> -->
        <!-- 高级查询 -->
        <!-- <super-query :config="superQueryConfig" @search="handleSuperQuery" /> -->
      </template>
      <!--操作栏-->
<!--      <template #action="{ record }">-->
<!--        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />-->
<!--      </template>-->
      <!--字段回显插槽-->
      <template v-slot:bodyCell> </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesIncomingModal @register="registerModal" @success="handleSuccess" />
    <IncomingInspect @register="registerInspModal" @success="handleSuccess" />
    <MesReturnModal @register="registerReturnModal" @success="handleSuccess" />
    <MesStockModal @register="registerStockModal" @success="handleSuccess" />
    
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

<script lang="ts" name="incoming-mesIncoming" setup>
import { reactive, unref, ref } from 'vue';
import { BasicTable } from '/@/components/Table';
import { BasicModal, useModal } from "/@/components/Modal";
import { useListPage } from '/@/hooks/system/useListPage';
// @ts-ignore
import MesIncomingModal from './components/MesIncomingModal.vue';
// @ts-ignore
import IncomingInspect from './components/insp/IncomingInspect.vue';
// @ts-ignore
import MesReturnModal from './components/MesReturnModal.vue';
// @ts-ignore
import MesStockModal from './components/MesStockModal.vue';
import { columns, searchFormSchema, printFormSchema } from './MesIncoming.data';
import { list, deleteOne, getImportUrl, getExportUrl } from './MesIncoming.api';
import { downloadFile } from '/@/utils/common/renderUtils';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, useForm } from "@/components/Form";
import { defHttp } from "@/utils/http/axios";
import { useUserStore } from "@/store/modules/user";
import { loopPrintJimuReport } from '/@/utils';
import { getToken } from '@/utils/auth';

const queryParam = reactive<any>({});
const $message = useMessage();
// 保存待打印的钢卷号（用于收料成功后的自动打印）
const autoPrintCoilNumber = ref<string | null>(null);

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerInspModal, { openModal: openInspModal }] = useModal();
  const [registerStockModal, { openModal: openStockModal }] = useModal();
  const [registerReturnModal, { openModal: openReturnModal }] = useModal();
  const [registerPrintModal, { openModal: openPrintModal, closeModal: closePrintModal, setModalProps: setPrintModalProps }] = useModal();
  
  //注册打印表单
  const [registerPrintForm, { validate: validatePrintForm, resetFields: resetPrintFields }] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //注册table数据
  const { tableContext} = useListPage({
    tableProps: {
      title: '来料单',
      api: list,
      //api: "/mes/inComing/purchaseReceiptBillDetail/list",
      immediate: false, // 页面加载时不自动请求，需手动查询
      //来料单表格列表数据
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        // 隐藏提交按钮
        // showSubmitButton: false,
        //不显示所有的输入框
        showAdvancedButton: false,
        // 添加这一行隐藏重置按钮
        showResetButton: false,
        fieldMapToNumber: [],
        fieldMapToTime: [],
        submitButtonOptions: {
          text: '查询',  // 修改查询按钮文本
          //preIcon: null,  // 移除放大镜图标
        },
      },
      // actionColumn: {
      //   title: '操作',
      //   width: 180,
      //   fixed: 'right',
      // },
      showActionColumn: false,
      beforeFetch: (params) => {
        // 如果需要精确匹配，移除通配符
        if (params.coilNo) {
          params.coilNo = params.coilNo.replace(/\*/g, '');
        }
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '来料单',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

const [registerTable, { reload, getSelectRows }, { rowSelection, selectedRowKeys }] = tableContext;

// 高级查询配置（已注释，保留以备后用）
// const superQueryConfig = reactive(superQuerySchema);

/**
 * 高级查询事件（已注释，保留以备后用）
 */
// function handleSuperQuery(params) {
//   Object.keys(params).map((k) => {
//     queryParam[k] = params[k];
//   });
//   reload();
// }
/**
 * 新增事件
 */
function handleAdd() {
  openModal(true, {
    isUpdate: false,
    showFooter: true,
  });
}

/**
 * 同步金蝶客户信息
 */
function handleGetFromK3Cloud() {
  const { createMessage } = useMessage();

  // 显示加载提示
  const hide = createMessage.loading('正在同步金蝶客户信息...', 0);

  // 调用接口
  defHttp.get({
    url: '/etl/preDeliveryBill/importAllPreDeliveryBills',
    params: {
      tenantId: useUserStore().getTenant,
    },
  });
  hide();
}

/**
 * 编辑事件（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleEdit(record: Recordable) {
  openModal(true, {
    record,
    isUpdate: true,
    showFooter: true,
  });
}
/**
 * 批量推送检验（已注释，保留以备后用）
 */
// async function handleWaitInsp() {
//   if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
//     $message.createMessage.warning('请选择需要操作的数据');
//     return;
//   }
//   await waitInsp({ ids: selectedRowKeys.value }, handleSuccess);
// }
/**
 * 退货（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleReturn(record: Recordable) {
  openReturnModal(true, {
    record,
    isUpdate: true,
    showFooter: true,
  });
}
/**
 * 检验（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleInsp(record: Recordable) {
  openInspModal(true, {
    record,
    isUpdate: true,
    showFooter: true,
  });
}
/**
 * 检验明细（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleInspDetail(record: Recordable) {
  openInspModal(true, {
    record,
    isUpdate: true,
    showFooter: false,
  });
}
/**
 * 入库（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleStock(record: Recordable) {
  openStockModal(true, {
    record,
    isUpdate: true,
    showFooter: true,
  });
}
/**
 * 详情（目前未使用，操作栏已注释）
 */
// @ts-ignore
function handleDetail(record: Recordable) {
  openModal(true, {
    record,
    isUpdate: true,
    showFooter: false,
  });
}
/**
 * 删除事件（目前未使用，操作栏已注释）
 */
// @ts-ignore
async function handleDelete(record) {
  await deleteOne({ id: record.id }, handleSuccess);
}
/**
 * 批量删除事件（已注释，保留以备后用）
 */
// async function batchHandleDelete() {
//   await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
// }
/**
 * 成功回调
 * @param printData 打印数据，包含钢卷号
 */
async function handleSuccess(printData?: { coilNumber: string }) {
  // 清空选中项，但不刷新列表
  selectedRowKeys.value = [];
  
  // 在所有操作完成后，最后弹出打印模板选择弹窗（仅新增模式下）
  if (printData?.coilNumber) {
    console.log('准备自动打印，钢卷号:', printData.coilNumber);
    // 保存待打印的钢卷号
    autoPrintCoilNumber.value = printData.coilNumber;
    // 使用 setTimeout 确保在所有操作完成后打开打印弹窗
    setTimeout(() => {
      resetPrintFields();
      openPrintModal(true, {});
    }, 300); // 延迟300ms确保所有操作完成
  } else {
    console.log('未提供钢卷号，跳过自动打印');
    // 清空待打印的钢卷号
    autoPrintCoilNumber.value = null;
  }
}
/**
 * 操作栏（已注释，保留以备后用）
 */
// function getTableAction(record) {
//   let actionArr: ActionItem[] = [];
//
//   if (record.status == 'create') {
//     actionArr.push({
//       label: '编辑',
//       onClick: handleEdit.bind(null, record),
//       auth: 'mes:mes_incoming:edit',
//     });
//   } else if (record.status == 'wait_insp') {
//     actionArr.push({
//       label: '检验',
//       onClick: handleInsp.bind(null, record),
//       auth: 'mes:mes_incoming:insp',
//     });
//   } else if (record.status == 'wait_stock') {
//     actionArr.push({
//       label: '入库',
//       onClick: handleStock.bind(null, record),
//       auth: 'mes:mes_incoming:stock',
//     });
//   } else if (record.status == 'wait_return') {
//     actionArr.push({
//       label: '退货',
//       onClick: handleReturn.bind(null, record),
//       auth: 'mes:mes_incoming:return',
//     });
//   }
//   if (record.status != 'create') {
//     actionArr.push({
//       label: '检验明细',
//       onClick: handleInspDetail.bind(null, record),
//     });
//   }
//   return actionArr;
// }
/**
 * 下拉操作栏（已注释，保留以备后用）
 */
// function getDropDownAction(record) {
//   let actionArr: ActionItem[] = [];
//   actionArr.push({
//     label: '详情',
//     onClick: handleDetail.bind(null, record),
//   });
//   if (record.status == 'create') {
//     actionArr.push({
//       label: '删除',
//       popConfirm: {
//         title: '是否确认删除',
//         confirm: handleDelete.bind(null, record),
//         placement: 'topLeft',
//         getPopupContainer: () => document.body,
//       },
//       auth: 'mes:mes_incoming:delete',
//     });
//   }
//   return actionArr;
// }

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
    
    let coilNumbers: string[] = [];
    
    // 优先使用自动打印保存的钢卷号（收料成功后自动打印）
    if (autoPrintCoilNumber.value) {
      coilNumbers = [autoPrintCoilNumber.value];
      console.log('使用自动打印的钢卷号:', autoPrintCoilNumber.value);
    } else {
      // 否则从选中的行数据中获取钢卷号
      const selectedRows = getSelectRows();
      if (!selectedRows || selectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        setPrintModalProps({ confirmLoading: false });
        return;
      }

      // 提取选中行的钢卷号
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
          // 清空自动打印的钢卷号
          autoPrintCoilNumber.value = null;
        });
      });
  } catch (error) {
    console.log(error);
    setPrintModalProps({ confirmLoading: false });
    // 清空自动打印的钢卷号
    autoPrintCoilNumber.value = null;
  }
}
</script>

<style lang="less" scoped>
:deep(.ant-picker),
:deep(.ant-input-number) {
  width: 100%;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
