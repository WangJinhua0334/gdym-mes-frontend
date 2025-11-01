<script setup lang="ts" name="mo-StaticPullStopwork">
import { getFormSchema ,getDetailJVxeColumns,formSchema} from './StaticPullStopwork.data';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "./StaticPullStopwork.api";
import {useMessage} from "@/hooks/web/useMessage";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {computed, onMounted, reactive, ref, unref} from "vue";
import { BasicModal, useModal, useModalInner } from '@/components/Modal';
import {buildUUID} from "@/utils/uuid";
import dayjs from "dayjs";
import {defHttp} from "@/utils/http/axios";
import {loopPrintJimuReport} from "@/utils";
import {getToken} from "@/utils/auth";
import { printFormSchema } from '@/views/mes/stopwork/pickling/PicklingStopwork';
// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref(true);
const formDisabled = ref(false);
const detailJVxeColumns = computed(() => getDetailJVxeColumns(unref(formDisabled)));

const activeKey = ref('mesProductPickDetail');
const mesProductPickDetail = ref();
const mesProductPickDetailTable = reactive({
  loading: false,
  dataSource: [],
  columns: detailJVxeColumns,
});

//表单配置 冷轧扫码完工表单
const [registerForm,{validate,setFieldsValue,getFieldsValue}] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
// 注册弹框
const [registerModal, { openModal, closeModal }] = useModal();
//冷轧扫码完工新增引用弹框
const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields,setFieldsValue: setExtendedFieldsValue, }] = useForm({
  labelWidth: 160,
  schemas: formSchema,
  showActionButtonGroup: false,
  disabled: false,
});

//注册弹框打印
const [registerModaldy, { setModalProps, closeModal:closeDyModal, openModal:openDyModal }] = useModal();
//打印表单配置
const [registerFormdy] = useForm({
  labelWidth: 100,
  schemas: printFormSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
/*// 冷轧扫码完工提交事件
async function handleSubmit() {
  try {
    // 验证表单
    const values = await validate();
    // 调用提交方法
    await requestAddOrEdit(values);
  } catch (error) {
    // 处理验证错误
    console.log('表单验证失败:', error);
  }
}*/

// 冷轧扫码完工提交事件
async function handleSubmit() {
  try {
    // 验证表单
    const mainFormValues = await validate();
    // 获取子表数据
    let detailData = [];
    if (mesProductPickDetail.value) {
      detailData = mesProductPickDetail.value.getTableData();
    }
    // 判断产出品总重 和领料重量是否一致，如果不相等，则抛出异常
    // 获取子表中钢卷号的 weight之和（转换为数值类型）
    const totalWeight = detailData.reduce((acc, cur) => {
      // 将字符串转换为浮点数进行累加
      return acc + parseFloat(cur.weight || '0');
    }, 0);

    // 将主表重量也转换为数值类型进行比较
    const mainWeight = parseFloat(mainFormValues.weight || '0');

    // 使用适当的精度比较浮点数
    if (Math.abs(totalWeight - mainWeight) > 0.001) {
      $message.createMessage.warning('产出品总重和领料重量不一致，请检查！');
      return;
    }
    // 组装完整数据 - 将主表数据和子表数据平级合并
    const submitData = {
      ...mainFormValues,
      productInfoList: detailData
    };
    // 调用提交方法
    await requestAddOrEdit(submitData);
    await handlePrint();
  } catch (error) {
    // 处理验证错误
    console.log('表单验证失败:', error);
  }
}
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    //提交表单
    await saveOrUpdate(values);
    //清空表单数据
    await resetFields();

    //重置子表数据源
    mesProductPickDetailTable.dataSource = [];
    //重置时间字段
    setTimeout(() => {
      setFieldsValue({
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    }, 100);
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  }
}

//新增按钮点击事件
function handleAddDetail() {
  // 获取表单数据中的钢卷号
  const formData = getFieldsValue();
  const flowCardId = formData.flowCardId || "";
  if (!formData.newCoilNo) {
    $message.createMessage.warning('请先输入钢卷号');
    return;
  }
  // 将 coilNo根据 - 只划分一次子串，只保留后面这段
  const str = formData.newCoilNo;
  const coilNo = str.substring(3);
  // const oldMaterialId = formData.materialId;
  // 获取当前子表的数据源长度作为序号（确保每次都获取最新的数据长度）
  const currentDataSource = mesProductPickDetail.value ? mesProductPickDetail.value.getTableData() : mesProductPickDetailTable.dataSource;
  const currentIndex = Array.isArray(currentDataSource) ? currentDataSource.length + 1 : 1;
  // 拼接新的钢卷号
  const newCoilNo = currentIndex > 9? `20-${coilNo}-${currentIndex}`: `20-${coilNo}-0${currentIndex}`;
  // 先打开弹框
  openModal(true, {});
  // 延迟设置值，确保弹框已打开并且表单已初始化
  setTimeout(() => {
    setExtendedFieldsValue({
      newCoilNo: newCoilNo,
      flowCardId: flowCardId,
    });
  }, 100);
}

//子表单弹框确定按钮点击事件
async function handleModalOk() {
  try {
    const values = await validateExtendedForm();
    // 验证必填字段
    if (!values.weight) {
      $message.createMessage.warning('请填写重量');
      return;
    }
    if (!values.destination) {
      $message.createMessage.warning('请选择流转去向');
      return;
    }
    // 获取字典标签（如果需要显示中文）
    let destinationLabel = values.destination;
    // 如果需要转换为中文标签，可以在这里处理
    // 字段映射（根据实际需求调整）
    const rowData = {
      id: buildUUID(),
      newCoilNo: values.newCoilNo || '',   // 钢卷号
      weight: values.weight || '',   // 重量
      newMaterialNumber: values.newMaterialNumber || '',   //物料编码
      newMaterialName: values.newMaterialName || '',   // 物料名称
      newModelNumber: values.newModelNumber || '',   // 规格型号
      destination: destinationLabel || values.destination || '',   // 流转去向
      qualityReport: values.qualityReport || '',   // 质量汇报
      // warehouseId: values.warehouseId || '',   // 仓库id
      // warehouseName: values.warehouseName || '',   // 仓库名称
    };
    // 添加到表格
    mesProductPickDetail.value.addRows([rowData]);
    // 关闭弹窗并重置表单
    closeModal();
    resetFields();
  } catch (error) {
    console.log('表单验证失败:', error);
  }
}
// 弹框取消事件处理
function handleModalCancel() {
  // 重置表单数据
  resetFields();
  // 关闭弹窗
  closeModal();
}
onMounted(() => {
  // 延迟一点时间确保表单完全初始化
  setTimeout(() => {
    setFieldsValue({
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }, 100);
});

/**
 * 新增打印提交
 */
async function handleSubmitdy() {
  setModalProps({ loading: true });
  let values = await validate();
  const printPackCodes = [];
  /*selectedRows.value.map((item) => {
      if (item.code && item.code != null && item.code != '') {
        printPackCodes.push(item.code);
      }
    });*/
  // 获取选中的行数据
  if (mesProductPickDetail.value) {
    const selectedRows = mesProductPickDetail.value.getSelectRows();
    selectedRows.map((item) => {
      if (item.newCoilNo && item.newCoilNo != null && item.newCoilNo != '') {
        printPackCodes.push(item.newCoilNo);
      }
    });
  }

  // 如果没有选中的行，可以添加提示
  if (printPackCodes.length === 0) {
    $message.createMessage.warning('请至少选择一条数据进行打印');
    setModalProps({ loading: false });
    return;
  }
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
          closeDyModal();
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
  openDyModal(true, {});
}
function clearTableDate() {
  resetFields();
  setFieldsValue({
    flowCardId: undefined,
    materialId: undefined,
    materialNumber: undefined,
    materialName: undefined,
    modelNumber: undefined,
    exceptedWeight: undefined,
    weight: undefined,
    limitedProportion: undefined,
    rangeValue: 3,
    equipmentId: undefined,
    equipmentNumber: undefined,
    // operatorNumber: undefined,
    // tenantId: undefined,
    endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 或者设置为 undefined
  });
  // 清空子表数据源
  mesProductPickDetailTable.dataSource = [];

  // 如果有子表实例，也可以调用其清空方法
  if (mesProductPickDetail.value) {
    mesProductPickDetail.value.reload([]);
  }
}
</script>
<template>
  <div class="custom-form-wrapper">
    <BasicForm @register="registerForm" :width="896"/>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="产出品明细" key="mesProductPickDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesProductPickDetail"
          :loading="mesProductPickDetailTable.loading"
          :columns="mesProductPickDetailTable.columns"
          :dataSource="mesProductPickDetailTable.dataSource"
          :height="250"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="!formDisabled"
          :toolbar="!formDisabled"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: ['remove', 'clearSelection'] }"
        >
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddDetail" preIcon="ant-design:plus-outlined"> 新增</a-button>
          </template>
        </JVxeTable>
        <!-- 将按钮放在表格容器内右下角 -->
        <div class="button-wrapper">
          <div class="button-group">
            <a-button type="primary" preIcon="ant-design:" @click="clearTableDate">清空数据</a-button>
            <a-button type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint">打印</a-button>
            <a-button @click="handleSubmit" type="primary" class="submit-button" style="background-color: red">扫码完工</a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!--新增选择产品弹框-->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      title="添加产出品明细"
      :width="800"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <BasicForm @register="registerExtendedFormModal" ref="extendedFormRef" />
    </BasicModal>
  </div>
  <BasicModal v-bind="$attrs" @register="registerModaldy" destroyOnClose :title="'选择打印标签'" :centered="true" :width="600" @ok="handleSubmitdy">
    <BasicForm @register="registerFormdy" style="padding: 3%" />
  </BasicModal>
</template>

<style scoped>
.custom-form-wrapper{
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  height: calc(100vh - 40px); /* 使用固定高度而不是 min-height */
  box-sizing: border-box;
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 修改样式部分 */
.button-wrapper {
  position: absolute;
  bottom: -40px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-group {
  display: flex;
  gap: 20px; /* 设置按钮间距离 */
}

.submit-button {
  margin-left: 0; /* 覆盖可能存在的默认左边距 */
}
</style>

