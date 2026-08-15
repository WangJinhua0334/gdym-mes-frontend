<script setup lang="ts" name="mo-OutBound">
import { getFormSchema ,getDetailJVxeColumns,formSchema, printFormSchema} from './OutBound.data';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "./OutBound.api";
import {useMessage} from "@/hooks/web/useMessage";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {computed, onMounted, reactive, ref, watch} from "vue";
import { BasicModal, useModal } from '@/components/Modal';
import {buildUUID} from "@/utils/uuid";
import dayjs from "dayjs";
import {loopPrintJimuReport} from "@/utils";
import { getReportIdByTemplateCode } from '@/utils/printTemplate';
import {getToken, getTenantId} from "@/utils/auth";
import {useUserStore} from "@/store/modules/user";
// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);
const formDisabled = ref(false);
const detailJVxeColumns = computed(() => getDetailJVxeColumns());
// 编辑模式标识
const isEditMode = ref(false);
// 当前编辑的行ID
const editingRowId = ref('');
// 选中的行数据
const selectedRows = ref<any[]>([]);
// 表格数据
const tableData = ref<any[]>([]);

// 计算属性：是否显示编辑按钮（表格有数据且选中了一行）
const showEditButton = computed(() => {
  return tableData.value.length > 0 && selectedRows.value.length === 1;
});

const activeKey = ref('mesProductPickDetail');
const mesProductPickDetail = ref();
const mesProductPickDetailTable = reactive({
  loading: false,
  dataSource: [],
  columns: detailJVxeColumns,
});

//表单配置 退火扫码完工表单
const [registerForm,{validate,setFieldsValue,getFieldsValue,resetFields}] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
// 注册弹框
const [registerModal, { openModal, closeModal }] = useModal();
//冷轧扫码完工新增引用弹框
const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields: resetExtendedFields,setFieldsValue: setExtendedFieldsValue }] = useForm({
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

// 退火扫码完工提交事件
async function handleSubmit() {
  try {
    // 验证表单
    const mainFormValues = await validate();
    if(!mainFormValues.oldCoilNo){
      $message.createMessage.warning('请先扫码钢卷号');
      return;
    }
    if(mesProductPickDetail.value.getTableData().length === 0){
      $message.createMessage.warning('请先添加产出品');
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
      return;
    }
    // 组装完整数据 - 将主表数据和子表数据平级合并，包含表格中所有的行数据
    const submitData = {
      ...mainFormValues,
      productInfoList: detailData  // 包含表格中所有的行数据
    };
    // 调用提交方法
    await requestAddOrEdit(submitData);
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
    setFieldsValue({
      flowCardId: undefined,
      oldCoilNo: undefined,
      materialId: undefined,
      materialNumber: undefined,
      materialName: undefined,
      modelNumber: undefined,
      weight: undefined,
      // operatorNumber: undefined,
      // tenantId: undefined,
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 或者设置为 undefined
    });

    //重置子表数据源
    mesProductPickDetailTable.dataSource = [];
    // 清空选中行
    selectedRows.value = [];
    // 更新表格数据
    updateTableData();
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
  const flowCardId = formData.flowCardId;
  if (!formData.oldCoilNo) {
    $message.createMessage.warning('请先输入钢卷号');
    return;
  }
  // 将 coilNo根据 - 只划分一次子串，只保留后面这段
  const str = formData.oldCoilNo;
  const coilNo = str.substring(3);
  // const oldMaterialId = formData.materialId;
  // 获取当前子表的数据源长度作为序号（确保每次都获取最新的数据长度）
  const currentDataSource = mesProductPickDetail.value ? mesProductPickDetail.value.getTableData() : mesProductPickDetailTable.dataSource;
  const currentIndex = Array.isArray(currentDataSource) ? currentDataSource.length + 1 : 1;
  // 拼接新的钢卷号
  const newCoilNo = currentIndex > 9? `40-${coilNo}-${currentIndex}`: `40-${coilNo}-0${currentIndex}`;
  
  // 设置为新增模式
  isEditMode.value = false;
  editingRowId.value = '';
  
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
  if (!selectedRow || !selectedRow.id) {
    $message.createMessage.warning('选中的行数据无效');
    return;
  }
  
  // 设置为编辑模式
  isEditMode.value = true;
  editingRowId.value = selectedRow.id;
  
  // 先重置表单，确保表单是干净的状态
  resetExtendedFields();
  
  // 打开弹框
  openModal(true, {});
  
  // 延迟填充数据，确保弹框和表单都已完全初始化
  setTimeout(() => {
    try {
      setExtendedFieldsValue({
        newCoilNo: selectedRow.newCoilNo || '',
        weight: selectedRow.weight || '',
        newMaterialId: selectedRow.newMaterialId || '',
        newMaterialNumber: selectedRow.newMaterialNumber || '',
        newMaterialName: selectedRow.newMaterialName || '',
        newModelNumber: selectedRow.newModelNumber || '',
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
        // 使用 setValues 方法更新行数据
        mesProductPickDetail.value.setValues([{
          rowKey: editingRowId.value,
          values: {
            newCoilNo: values.newCoilNo || '',
            weight: values.weight || '',
            newMaterialId: values.newMaterialId || '',
            newMaterialNumber: values.newMaterialNumber || '',
            newMaterialName: values.newMaterialName || '',
            newModelNumber: values.newModelNumber || '',
            destination: destinationLabel || values.destination || '',
            qualityReport: values.qualityReport || '',
          }
        }]);
        $message.createMessage.success('修改成功');
      }
    } else {
      // 新增模式：添加新行
      const rowData = {
        id: buildUUID(),
        newCoilNo: values.newCoilNo || '',   // 钢卷号
        weight: values.weight || '',   // 重量
        newMaterialId: values.newMaterialId || '',   //物料id
        newMaterialNumber: values.newMaterialNumber || '',   //物料编码
        newMaterialName: values.newMaterialName || '',   // 物料名称
        newModelNumber: values.newModelNumber || '',   // 规格型号
        destination: destinationLabel || values.destination || '',   // 流转去向
        qualityReport: values.qualityReport || '',   // 质检报告
      };
      // 添加到表格
      mesProductPickDetail.value.addRows([rowData]);
    }
    
    // 更新表格数据
    setTimeout(() => {
      updateTableData();
    }, 100);
    
    // 关闭弹窗并重置表单
    closeModal();
    resetExtendedFields();
    // 重置编辑模式
    isEditMode.value = false;
    editingRowId.value = '';
  } catch (error) {
    console.log('表单验证失败:', error);
  }
}
// 弹框取消事件处理
function handleModalCancel() {
  // 重置表单数据
  resetExtendedFields();
  // 重置编辑模式
  isEditMode.value = false;
  editingRowId.value = '';
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
 * 打印提交 - 打印选中的行标签
 */
async function handleSubmitdy() {
  try {
    setModalProps({ loading: true });
    const values = await validate();
    
    // 获取选中的行数据
    if (!mesProductPickDetail.value) {
      $message.createMessage.warning('表格未初始化!');
      setModalProps({ loading: false });
      return;
    }
    
    const selectedRows = mesProductPickDetail.value.getSelectRows();
    if (!selectedRows || selectedRows.length === 0) {
      $message.createMessage.warning('请选择待打印的记录!');
      setModalProps({ loading: false });
      return;
    }

    // 提取选中行的钢卷号
    const coilNumbers: string[] = [];
    selectedRows.forEach((row: any) => {
      if (row.newCoilNo && row.newCoilNo !== null && row.newCoilNo !== '') {
        coilNumbers.push(row.newCoilNo);
      }
    });

    if (coilNumbers.length === 0) {
      $message.createMessage.warning('选中的记录中没有有效的钢卷号!');
      setModalProps({ loading: false });
      return;
    }

    // 按模板方案编码获取报表ID
    getReportIdByTemplateCode(values.templateCode, 'pack_sn')
      .then(async (reportId) => {
        setModalProps({ loading: false });
        // 打印数据集 { reportId, parameters }，使用钢卷号作为参数
        const printSet: any = { [reportId]: { id: `${coilNumbers.join(',')}` } };

        loopPrintJimuReport(printSet, getToken, () => {
          closeDyModal();
          $message.createMessage.success('打印成功!');
        });
      });
  } catch (error) {
    console.log(error);
    setModalProps({ loading: false });
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
    oldCoilNo: undefined,
    materialId: undefined,
    materialNumber: undefined,
    materialName: undefined,
    modelNumber: undefined,
    weight: undefined,
  });
  // 刷新完工时间、操作员和租户ID
  setTimeout(() => {
    setFieldsValue({
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 刷新完工时间为当前时间
      operatorNumber: useUserStore().getUserInfo.username, // 刷新操作员
      tenantId: getTenantId(), // 刷新租户ID
    });
  }, 100);
  // 清空子表数据源
  mesProductPickDetailTable.dataSource = [];

  // 如果有子表实例，也可以调用其清空方法
  if (mesProductPickDetail.value) {
    mesProductPickDetail.value.reload([]);
  }
  
  // 清空选中行
  selectedRows.value = [];
  // 更新表格数据
  updateTableData();
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
          round =  true
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
            <a-button type="primary" preIcon="ant-design:" @click="clearTableDate">清空数据</a-button>
            <a-button type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint">打印</a-button>
            <a-button @click="handleSubmit" type="primary" class="submit-button" style="background-color: red">扫码完工</a-button>
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
</style>

