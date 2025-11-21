<script setup lang="ts" name="mo-PicklingStopwork">
import { getFormSchema ,getDetailJVxeColumns,formSchema,printFormSchema} from './PicklingStopwork.data';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "@/views/mes/stopwork/pickling/PicklingStopwork.api";
import {useMessage} from "@/hooks/web/useMessage";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {computed, onMounted, reactive, ref, watch} from "vue";
import { BasicModal, useModal } from '@/components/Modal';
import {buildUUID} from "@/utils/uuid";
import dayjs from "dayjs";
import {defHttp} from "@/utils/http/axios";
import {loopPrintJimuReport} from "@/utils";
import {getToken} from "@/utils/auth";
// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);
const formDisabled = ref(false);
// 控制是否显示钢卷号列（打码完工后显示）
const showCoilNoColumn = ref(false);
const detailJVxeColumns = computed(() => getDetailJVxeColumns(showCoilNoColumn.value));

const activeKey = ref('mesProductPickDetail');
const mesProductPickDetail = ref();
const mesProductPickDetailTable = reactive({
  loading: false,
  dataSource: [] as any[],
  columns: detailJVxeColumns,
});
// 保存上次输入的质量汇报信息
const lastQualityReport = ref('');
// 编辑模式标识
const isEditMode = ref(false);
// 当前编辑的行ID
const editingRowId = ref('');
// 选中的行数据
const selectedRows = ref<any[]>([]);
// 表格数据
const tableData = ref<any[]>([]);
// 打码完工按钮加载状态
const submitLoading = ref(false);
// 打码完工按钮禁用状态（成功后禁用）
const submitDisabled = ref(false);
// 是否显示打印按钮（请求成功后显示）
const showPrintButtonAfterSubmit = ref(false);
// 保存所有行的钢卷号（用于请求成功后的打印）
const allRowsCoilNumbers = ref<string[]>([]);

// 计算属性：是否显示编辑按钮（选中一行，且未提交成功）
const showEditButton = computed(() => {
  return selectedRows.value && selectedRows.value.length === 1 && !submitDisabled.value;
});

// 计算属性：是否启用打印按钮（选中了至少一行）
const enablePrintButton = computed(() => {
  return selectedRows.value && selectedRows.value.length > 0;
});

//表单配置 酸洗扫码完工表单
const [registerForm,{validate,setFieldsValue,getFieldsValue}] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
// 注册弹框
const [registerModal, { openModal, closeModal }] = useModal();
//酸洗扫码完工新增引用弹框
const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields ,setFieldsValue: setExtendedFieldsValue, getFieldsValue: getExtendedFieldsValue }] = useForm({
  labelWidth: 160,
  schemas: formSchema,
  showActionButtonGroup: false,
  disabled: false,
});
//注册弹框打印
const [registerModaldy, { setModalProps, closeModal:closeDyModal, openModal:openDyModal }] = useModal();
//打印表单配置
const [registerFormdy, { validate: validatePrintForm }] = useForm({
  labelWidth: 100,
  schemas: printFormSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
/*// 酸洗扫码完工提交事件
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

// 酸洗扫码完工提交事件
async function handleSubmit() {
  // 先检查表格是否有数据
  if (!mesProductPickDetail.value) {
    $message.createMessage.warning('请新增产出品明细信息');
    return;
  }
  
  const tableData = mesProductPickDetail.value.getTableData();
  if (!tableData || tableData.length === 0) {
    // 表格没有数据时，提示用户
    $message.createMessage.warning('请新增产出品明细信息');
    return;
  }
  
  // 有数据时，开始显示加载状态
  submitLoading.value = true;
  
  try {
    // 验证表单
    const mainFormValues = await validate();
    if(!mainFormValues.oldCoilNo){
      $message.createMessage.warning('请先扫码钢卷号');
      submitLoading.value = false;
      return;
    }
    if(mesProductPickDetail.value.getTableData().length === 0){
      $message.createMessage.warning('请先添加产出品');
      submitLoading.value = false;
      return;
    }
    // 获取子表数据
    let detailData: any[] = [];
    if (mesProductPickDetail.value) {
      detailData = mesProductPickDetail.value.getTableData();
    }
    // 判断产出品总重 和领料重量是否一致，如果不相等，则抛出异常
    // 获取子表中钢卷号的 weight之和（转换为数值类型）
    const totalWeight = detailData.reduce((acc, cur: any) => {
      // 将字符串转换为浮点数进行累加
      return acc + parseFloat(cur.weight || '0');
    }, 0);

    // 将主表重量也转换为数值类型进行比较
    const mainWeight = parseFloat(mainFormValues.weight || '0');

    // 使用适当的精度比较浮点数
    if (Math.abs(totalWeight - mainWeight) > 0.001) {
      $message.createMessage.warning('产出品总重和领料重量不一致，请检查！');
      submitLoading.value = false;
      return;
    }
    // 组装完整数据 - 将主表数据和子表数据平级合并
    const submitData = {
      ...mainFormValues,
      productInfoList: detailData
    };
    // 调用提交方法
    await requestAddOrEdit(submitData);
    
    // 提交成功后，禁用"打码完工"按钮
    submitDisabled.value = true;
    
    // 获取所有行的钢卷号用于打印（如果有的话）
    const allCoilNumbers: string[] = [];
    detailData.forEach((row: any) => {
      if (row.newCoilNo && row.newCoilNo !== null && row.newCoilNo !== '') {
        allCoilNumbers.push(row.newCoilNo);
      }
    });
    
    // 保存所有行的钢卷号
    allRowsCoilNumbers.value = allCoilNumbers;
    
    // 提交成功后，显示打印按钮（只要有表格数据就显示）
    if (detailData && detailData.length > 0) {
      showPrintButtonAfterSubmit.value = true;
    }
    
    // 清空选中行，确保打印按钮默认禁用（需要重新选中行才能打印）
    selectedRows.value = [];
    // 清空表格选中状态
    if (mesProductPickDetail.value && typeof mesProductPickDetail.value.clearSelection === 'function') {
      mesProductPickDetail.value.clearSelection();
    }
  } catch (error) {
    // 处理验证错误
    console.log('表单验证失败:', error);
    // 确保按钮可以再次点击
    submitDisabled.value = false;
    $message.createMessage.error('提交失败，请检查数据');
  } finally {
    // 无论成功还是失败，都要清除加载状态
    submitLoading.value = false;
  }
}
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    //提交表单
    await saveOrUpdate(values);
    allRowsCoilNumbers.value = [];
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  }
}

//新增按钮点击事件
function handleAddDetail() {
  // 获取表单数据中的重量
  const formData = getFieldsValue();
  const formWeight = formData.weight || '';
  
  // 设置为新增模式
  isEditMode.value = false;
  editingRowId.value = '';
  
  // 先打开弹框
  openModal(true, {});
  // 延迟设置值，确保弹框已打开并且表单已初始化
  setTimeout(() => {
    setExtendedFieldsValue({
      weight: formWeight, // 设置重量默认值为表单中的重量
      destination: '1', // 设置流转去向默认值为入库
      qualityReport: lastQualityReport.value, // 恢复上次输入的质量汇报
    });
  }, 100);
}

//编辑按钮点击事件
function handleEditDetail() {
  if (!mesProductPickDetail.value) {
    $message.createMessage.warning('表格未初始化');
    return;
  }
  
  // 优先使用已保存的选中行数据
  let currentSelectedRows = selectedRows.value;
  
  // 如果保存的选中行为空，尝试从表格获取
  if (!currentSelectedRows || currentSelectedRows.length === 0) {
    try {
      // 尝试使用 getSelectionData 方法
      if (typeof mesProductPickDetail.value.getSelectionData === 'function') {
        currentSelectedRows = mesProductPickDetail.value.getSelectionData();
      } else if (typeof mesProductPickDetail.value.getSelectRows === 'function') {
        currentSelectedRows = mesProductPickDetail.value.getSelectRows();
      }
    } catch (e) {
      console.error('获取选中行失败:', e);
    }
  }
  
  if (!currentSelectedRows || currentSelectedRows.length === 0) {
    $message.createMessage.warning('请先选择要编辑的行');
    return;
  }
  if (currentSelectedRows.length > 1) {
    $message.createMessage.warning('只能选择一行进行编辑');
    return;
  }
  
  const selectedRow = currentSelectedRows[0];
  if (!selectedRow) {
    $message.createMessage.warning('选中的行数据无效');
    return;
  }
  
  // 如果没有id，尝试使用rowKey或其他唯一标识
  const rowId = selectedRow.id || selectedRow.rowKey || selectedRow._rowKey;
  if (!rowId) {
    $message.createMessage.warning('选中的行缺少唯一标识');
    return;
  }
  
  // 设置为编辑模式
  isEditMode.value = true;
  editingRowId.value = rowId;
  
  // 先重置表单，确保表单是干净的状态
  resetFields();
  
  // 打开弹框
  openModal(true, {});
  
  // 延迟填充数据，确保弹框和表单都已完全初始化
  setTimeout(() => {
    try {
      setExtendedFieldsValue({
        weight: selectedRow.weight || '',
        destination: selectedRow.destination || '',
        qualityReport: selectedRow.qualityReport || '',
      });
    } catch (e) {
      console.error('填充编辑数据失败:', e);
      $message.createMessage.error('填充编辑数据失败，请重试');
    }
  }, 200);
}

// 监听表格选中行变化
function handleSelectRowChange(event: any) {
  // 确保正确获取选中行数据
  if (event && event.selectedRows) {
    selectedRows.value = event.selectedRows;
  } else if (event && Array.isArray(event)) {
    // 如果 event 本身就是数组
    selectedRows.value = event;
  } else {
    selectedRows.value = [];
  }
  // 同时更新表格数据，确保数据同步
  updateTableData();
}

// 更新表格数据
function updateTableData() {
  if (mesProductPickDetail.value) {
    try {
      const data = mesProductPickDetail.value.getTableData();
      if (data && Array.isArray(data)) {
        tableData.value = data;
      }
    } catch (e) {
      // 如果获取失败，使用 dataSource
      tableData.value = mesProductPickDetailTable.dataSource || [];
    }
  } else {
    tableData.value = mesProductPickDetailTable.dataSource || [];
  }
}

// 监听表格数据源变化
watch(
  () => mesProductPickDetailTable.dataSource,
  () => {
    updateTableData();
  },
  { deep: true, immediate: true }
);

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
    
    if (isEditMode.value) {
      // 编辑模式：更新现有行
      if (mesProductPickDetail.value && editingRowId.value) {
        // 使用 getIfRowById 方法查找行（更可靠，可以同时查找已存在的行和新增的行）
        const { row: targetRow } = mesProductPickDetail.value.getIfRowById(editingRowId.value);
        
        if (targetRow) {
          // 使用行的实际 rowKey（优先使用 rowKey，如果没有则使用 id）
          const actualRowKey = targetRow.rowKey || targetRow._rowKey || targetRow.id || editingRowId.value;
          
          // 使用 setValues 方法更新行数据
          // 确保 weight 是数字类型（因为列类型是 inputNumber）
          const weightValue = values.weight ? (typeof values.weight === 'number' ? values.weight : parseFloat(values.weight)) : '';
          
          const updateResult = mesProductPickDetail.value.setValues([{
            rowKey: actualRowKey,
            values: {
              weight: weightValue,
              destination: destinationLabel || values.destination || '',
              qualityReport: values.qualityReport || '',
            }
          }]);
          
          if (updateResult > 0) {
            $message.createMessage.success('修改成功');
          } else {
            $message.createMessage.warning('修改失败，请检查数据');
          }
        } else {
          $message.createMessage.warning('未找到要编辑的行');
        }
      }
    } else {
      // 新增模式：添加新行（不包含钢卷号，打码完工后再获取）
      const rowData = {
        id: buildUUID(),
        weight: values.weight || '',   // 重量
        destination: destinationLabel || values.destination || '',   // 流转去向
        qualityReport: values.qualityReport || '',   // 质检报告
      };
      // 添加到表格
      mesProductPickDetail.value.addRows([rowData]);
    }
    
    // 保存当前输入的质量汇报值
    lastQualityReport.value = values.qualityReport || '';
    
    // 更新表格数据
    setTimeout(() => {
      updateTableData();
    }, 100);
    
    // 关闭弹窗并重置表单
    closeModal();
    resetFields();
    // 重置编辑模式
    isEditMode.value = false;
    editingRowId.value = '';
    
    setFieldsValue({
      equipmentId: undefined,
      equipmentNumber: undefined,
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  } catch (error) {
    console.log('表单验证失败:', error);
  }
}
// 弹框取消事件处理
function handleModalCancel() {
  // 在重置前保存当前输入的质量汇报值
  const currentValues = getExtendedFieldsValue();
  if (currentValues && currentValues.qualityReport) {
    lastQualityReport.value = currentValues.qualityReport;
  }
  // 重置表单数据
  resetFields();
  // 重置编辑模式
  isEditMode.value = false;
  editingRowId.value = '';
  
  setFieldsValue({
    equipmentId: undefined,
    equipmentNumber: undefined,
    qualityReport: undefined,
    endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
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

// 存储待打印的钢卷号数组
const printCoilNumbers = ref<string[]>([]);

/**
 * 新增打印提交（参考冷轧页面的实现）
 */
async function handleSubmitdy() {
  try {
    setModalProps({ loading: true });
    const values = await validatePrintForm();
    
    // 获取选中的行数据（参考冷轧页面的实现）
    if (!mesProductPickDetail.value) {
      $message.createMessage.warning('表格未初始化!');
      setModalProps({ loading: false });
      return;
    }
    
    // 优先尝试从表格获取选中行（参考冷轧页面的实现）
    let currentSelectedRows: any[] | null = null;
    try {
      if (typeof mesProductPickDetail.value.getSelectRows === 'function') {
        currentSelectedRows = mesProductPickDetail.value.getSelectRows();
      } else if (typeof mesProductPickDetail.value.getSelectionData === 'function') {
        currentSelectedRows = mesProductPickDetail.value.getSelectionData();
      }
    } catch (e) {
      console.error('获取选中行失败:', e);
    }
    
    // 如果表格中没有选中行，使用已保存的选中行数据
    if (!currentSelectedRows || currentSelectedRows.length === 0) {
      currentSelectedRows = selectedRows.value;
    }
    
    // 检查是否选中了行
    if (!currentSelectedRows || currentSelectedRows.length === 0) {
      $message.createMessage.warning('请选择待打印的记录!');
      setModalProps({ loading: false });
      return;
    }

    // 获取主表单的 oldCoilNo（旧钢卷号）作为打印参数
    const mainFormValues = getFieldsValue();
    if (!mainFormValues.oldCoilNo || mainFormValues.oldCoilNo === null || mainFormValues.oldCoilNo === '') {
      $message.createMessage.warning('主表单中缺少旧钢卷号，无法打印!');
      setModalProps({ loading: false });
      return;
    }

    const oldCoilNo = mainFormValues.oldCoilNo;

    // 获取报表ID
    defHttp
      .get({
        url: '/template/basTemplate/getReportIdByIds',
        params: { ids: values.templateId, type: 'gx_sn' },
      }).then(async (reportRs) => {
        console.log('获取报表ID成功:', reportRs);
        console.log('打印参数 - 旧钢卷号:', oldCoilNo);
        setModalProps({ loading: false });
        
        // 检查报表ID是否为空
        if (!reportRs || Object.keys(reportRs).length === 0) {
          $message.createMessage.error('获取报表ID失败，请检查打印模板配置!');
          return;
        }
        
        // 打印数据集 { reportId, parameters }，使用旧钢卷号作为参数
        const printSet: any = {};

        const templateIds = Object.keys(reportRs);
        for (const templateId of templateIds) {
          const reportId = reportRs[templateId];
          printSet[reportId] = { id: oldCoilNo };
        }

        console.log('打印数据集:', printSet);
        
        // 调用打印功能，会显示浏览器打印对话框（参考收料页面的实现）
        loopPrintJimuReport(printSet, getToken, () => {
          closeDyModal();
          $message.createMessage.success('打印成功!');
          // 清空打印数据
          printCoilNumbers.value = [];
        });
      }).catch((error) => {
        setModalProps({ loading: false });
        console.error('获取报表ID失败:', error);
        $message.createMessage.error('获取报表ID失败，请重试!');
      });
  } catch (error) {
    console.log(error);
    setModalProps({ loading: false });
  }
}

/**
 * 打印-弹出选择打印模板（参考冷轧页面的实现）
 * @param coilNumbers 可选参数，如果传入则使用传入的钢卷号数组（用于请求成功后的打印）
 */
function handlePrint(coilNumbers?: string[]) {
  // 如果传入了钢卷号数组（用于请求成功后的打印），直接存储并打开弹窗
  if (coilNumbers && Array.isArray(coilNumbers) && coilNumbers.length > 0) {
    printCoilNumbers.value = coilNumbers;
    openDyModal(true, {});
    return;
  }
  
  // 否则直接打开打印模板选择弹窗（参考冷轧页面的实现）
  openDyModal(true, {});
}


function clearFormAndTableData() {
  setFieldsValue({
    flowCardId: undefined,
    oldCoilNo: undefined,
    materialId: undefined,
    materialNumber: undefined,
    materialName: undefined,
    modelNumber: undefined,
    // exceptedWeight: undefined,
    weight: undefined,
    // limitedProportion: undefined,
    // rangeValue: 3,
    equipmentId: undefined,
    equipmentNumber: undefined,
    qualityReport: undefined,
    // operatorNumber: undefined,  // 不清空操作员编码
    // tenantId: undefined,      // 不清空租户 id
    endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 或者设置为 undefined
  });
  // 清空子表数据源
  mesProductPickDetailTable.dataSource = [];

  // 如果有子表实例，也可以调用其清空方法
  if (mesProductPickDetail.value) {
    mesProductPickDetail.value.reload([]);
  }
  
  // 清空选中行
  selectedRows.value = [];
  // 清空打印数据
  printCoilNumbers.value = [];
  // 清空请求成功后的打印按钮状态
  showPrintButtonAfterSubmit.value = false;
  allRowsCoilNumbers.value = [];
  // 隐藏钢卷号列
  showCoilNoColumn.value = false;
  // 重置"打码完工"按钮的禁用状态，允许再次提交
  submitDisabled.value = false;
  // 确保提交加载状态复位
  submitLoading.value = false;
  // 显式清空本地表格数据缓存与选择状态
  tableData.value = [];
  try {
    if (mesProductPickDetail.value && typeof mesProductPickDetail.value.clearSelection === 'function') {
      mesProductPickDetail.value.clearSelection();
    }
  } catch (e) {}
  // 更新表格数据
  updateTableData();
  // 确保表单未被禁用
  formDisabled.value = false;
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
          :columns="detailJVxeColumns"
          :dataSource="mesProductPickDetailTable.dataSource"
          :height="250"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="!formDisabled"
          :toolbar="!formDisabled && !submitDisabled"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: submitDisabled ? [] : ['remove', 'clearSelection'] }"
          @selectRowChange="handleSelectRowChange"
        >
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddDetail" preIcon="ant-design:plus-outlined"> 新增</a-button>
            <a-button v-if="showEditButton" type="primary" @click="handleEditDetail" preIcon="ant-design:edit-outlined" style="margin-left: 8px;"> 编辑</a-button>
          </template>
        </JVxeTable>
        <!-- 将按钮放在表格容器内右下角 -->
        <div class="button-wrapper">
          <div class="button-group">
            <a-button v-if="false" type="primary" class="clear-button" @click="clearFormAndTableData">清空数据</a-button>
<!--            <a-button  type="primary" preIcon="ant-design:printer-outlined" @click="handlePrintAfterSubmit">打印标签</a-button>-->
            <a-button v-if="showPrintButtonAfterSubmit" type="primary" preIcon="ant-design:printer-outlined" :disabled="!enablePrintButton" @click="handlePrint">打印</a-button>
            <a-button @click="handleSubmit" type="primary" class="submit-button" :loading="submitLoading" :disabled="submitDisabled" style="background-color: red">打码完工</a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!--新增/编辑选择产品弹框-->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :title="isEditMode ? '编辑产出品明细' : '添加产出品明细'"
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

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

