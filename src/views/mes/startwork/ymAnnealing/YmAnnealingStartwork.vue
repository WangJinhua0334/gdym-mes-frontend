<script setup lang="ts" name="mes-YmAnnealingStartwork">
import { getFormSchema, materialFormSchema, getMaterialColumns } from './YmAnnealingStartwork';
import { BasicForm, useForm } from "@/components/Form";
import { saveOrUpdate } from "./YmAnnealingStartwork.api";
import { useMessage } from "@/hooks/web/useMessage";
import { JVxeTable } from "@/components/jeecg/JVxeTable";
import { computed, reactive, ref } from "vue";
import { BasicModal, useModal } from '@/components/Modal';
import { buildUUID } from "@/utils/uuid";
import dayjs from "dayjs";

// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);
const formDisabled = ref(false);
// 编辑模式标识
const isEditMode = ref(false);
// 当前编辑的行ID
const editingRowId = ref('');
// 选中的行数据
const selectedRows = ref<any[]>([]);
// 表格数据
const tableData = ref<any[]>([]);
// 控制提交按钮加载状态
const submitLoading = ref(false);
// 开工按钮禁用状态（成功后禁用）
const submitDisabled = ref(false);

// 计算属性：是否显示编辑按钮（表格有数据且选中了一行，且未提交成功）
const showEditButton = computed(() => {
  return tableData.value.length > 0 && selectedRows.value.length === 1 && !submitDisabled.value;
});

const activeKey = ref('materialDetail');
const materialDetail = ref();
const materialColumns = getMaterialColumns();
const materialDetailTable = reactive({
  loading: false,
  dataSource: [],
  columns: materialColumns,
});

// 主表单配置
const [registerForm, { validate, setFieldsValue, getFieldsValue, resetFields }] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});

// 注册领料弹框
const [registerModal, { openModal, closeModal }] = useModal();

// 领料弹框表单配置
const [registerMaterialFormModal, { validate: validateMaterialForm, resetFields: resetMaterialFields, setFieldsValue: setMaterialFieldsValue }] = useForm({
  labelWidth: 160,
  schemas: materialFormSchema,
  showActionButtonGroup: false,
  disabled: false,
});

/**
 * 开工提交事件
 */
async function handleSubmit() {
  // 防止重复提交
  if (submitLoading.value) {
    return;
  }
  
  try {
    // 验证表单
    const mainFormValues = await validate();
    
    // 校验表格中是否有数据
    if (!materialDetail.value || materialDetail.value.getTableData().length === 0) {
      $message.createMessage.warning('请先添加领料信息');
      return;
    }
    
    // 获取子表数据
    let detailData: any[] = [];
    if (materialDetail.value) {
      const tableData = materialDetail.value.getTableData() as any;
      if (Array.isArray(tableData)) {
        detailData = tableData;
      }
    }
    
    // 验证通过后，开始提交请求
    submitLoading.value = true;
    
    // 组装完整数据 - 将主表数据和子表数据平级合并
    const submitData = {
      ...mainFormValues,
      materialList: detailData  // 包含表格中所有的行数据
    };
    
    // 调用提交方法
    const success = await requestAddOrEdit(submitData);
    
    // 只有请求成功后才禁用开工按钮
    if (success) {
      submitDisabled.value = true;
      // 清空选中行
      selectedRows.value = [];
      // 清空表格选中状态
      if (materialDetail.value && typeof materialDetail.value.clearSelection === 'function') {
        materialDetail.value.clearSelection();
      }
    } else {
      submitDisabled.value = false;
    }
  } catch (error) {
    console.log('表单验证失败:', error);
    submitDisabled.value = false;
    $message.createMessage.error('提交失败，请检查数据');
  } finally {
    submitLoading.value = false;
  }
}

/**
 * 表单提交事件
 */
async function requestAddOrEdit(values) {
  try {
    await saveOrUpdate(values);
    emit('success');
    $message.createMessage.success('开工成功');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * 领料按钮点击事件
 */
function handleAddMaterial() {
  // 设置为新增模式
  isEditMode.value = false;
  editingRowId.value = '';
  
  // 打开弹框
  openModal(true, {});
  
  // 延迟重置表单，确保弹框已打开
  setTimeout(() => {
    resetMaterialFields();
  }, 100);
}

/**
 * 编辑按钮点击事件
 */
function handleEditMaterial() {
  if (!materialDetail.value) {
    $message.createMessage.warning('表格未初始化');
    return;
  }
  
  // 获取选中行数据
  let currentSelectedRows = selectedRows.value;
  
  if (!currentSelectedRows || currentSelectedRows.length === 0) {
    try {
      if (typeof materialDetail.value.getSelectionData === 'function') {
        currentSelectedRows = materialDetail.value.getSelectionData();
      } else if (typeof materialDetail.value.getSelectRows === 'function') {
        currentSelectedRows = materialDetail.value.getSelectRows();
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
  
  // 先重置表单
  resetMaterialFields();
  
  // 打开弹框
  openModal(true, {});
  
  // 延迟填充数据
  setTimeout(() => {
    try {
      setMaterialFieldsValue({
        oldCoilNo: selectedRow.oldCoilNo || '',
        materialName: selectedRow.materialName || '',
        materialNumber: selectedRow.materialNumber || '',
        modelNumber: selectedRow.modelNumber || '',
        weight: selectedRow.weight || '',
      });
    } catch (e) {
      console.error('填充编辑数据失败:', e);
      $message.createMessage.error('填充编辑数据失败，请重试');
    }
  }, 200);
}

/**
 * 监听表格选中行变化
 */
function handleSelectRowChange(event: any) {
  if (event && event.selectedRows) {
    selectedRows.value = event.selectedRows;
  } else if (event && Array.isArray(event)) {
    selectedRows.value = event;
  } else {
    selectedRows.value = [];
  }
}

/**
 * 更新表格数据
 */
function updateTableData() {
  if (materialDetail.value) {
    try {
      const data = materialDetail.value.getTableData();
      if (data && Array.isArray(data)) {
        tableData.value = data;
      }
    } catch (e) {
      tableData.value = materialDetailTable.dataSource || [];
    }
  } else {
    tableData.value = materialDetailTable.dataSource || [];
  }
}

/**
 * 领料弹框确定按钮点击事件
 */
async function handleModalOk() {
  try {
    const values = await validateMaterialForm();
    
    // 验证必填字段
    if (!values.oldCoilNo) {
      $message.createMessage.warning('请选择钢卷号');
      return;
    }
    
    if (isEditMode.value) {
      // 编辑模式：更新现有行
      if (materialDetail.value && editingRowId.value) {
        materialDetail.value.setValues([{
          rowKey: editingRowId.value,
          values: {
            oldCoilNo: values.oldCoilNo || '',
            materialName: values.materialName || '',
            materialNumber: values.materialNumber || '',
            modelNumber: values.modelNumber || '',
            weight: values.weight || '',
          }
        }]);
        $message.createMessage.success('修改成功');
      }
    } else {
      // 新增模式：添加新行
      const rowData = {
        id: buildUUID(),
        oldCoilNo: values.oldCoilNo || '',
        materialName: values.materialName || '',
        materialNumber: values.materialNumber || '',
        modelNumber: values.modelNumber || '',
        weight: values.weight || '',
      };
      // 添加到表格
      materialDetail.value.addRows([rowData]);
    }
    
    // 更新表格数据
    setTimeout(() => {
      updateTableData();
    }, 100);
    
    // 关闭弹窗并重置表单
    closeModal();
    resetMaterialFields();
    // 重置编辑模式
    isEditMode.value = false;
    editingRowId.value = '';
  } catch (error) {
    console.log('表单验证失败:', error);
  }
}

/**
 * 弹框取消事件处理
 */
function handleModalCancel() {
  resetMaterialFields();
  isEditMode.value = false;
  editingRowId.value = '';
  closeModal();
}

/**
 * 清空数据
 */
function clearTableData() {
  resetFields();
  setFieldsValue({
    equipmentNumber: undefined,
    startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    temperature: undefined,
    keepWarmTime: undefined,
    tUsage: undefined,
    dUsage: undefined,
    qUsage: undefined,
    note: undefined,
  });
  
  // 清空子表数据源
  materialDetailTable.dataSource = [];
  
  if (materialDetail.value) {
    materialDetail.value.reload([]);
  }
  
  // 清空选中行
  selectedRows.value = [];
  tableData.value = [];
  
  try {
    if (materialDetail.value && typeof materialDetail.value.clearSelection === 'function') {
      materialDetail.value.clearSelection();
    }
  } catch (e) {}
  
  updateTableData();
  submitDisabled.value = false;
  submitLoading.value = false;
  formDisabled.value = false;
}
</script>

<template>
  <div class="custom-form-wrapper">
    <BasicForm @register="registerForm" :width="896"/>
    
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="领料明细" key="materialDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          round
          ref="materialDetail"
          :loading="materialDetailTable.loading"
          :columns="materialColumns"
          :dataSource="materialDetailTable.dataSource"
          :height="250"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="!formDisabled"
          :toolbar="!formDisabled && !submitDisabled"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: submitDisabled ? [] : ['remove', 'clearSelection'] }"
          @selectRowChange="handleSelectRowChange"
        >
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddMaterial" preIcon="ant-design:plus-outlined"> 领料</a-button>
            <a-button v-if="showEditButton" type="primary" @click="handleEditMaterial" preIcon="ant-design:edit-outlined" style="margin-left: 8px;"> 编辑</a-button>
          </template>
        </JVxeTable>
        
        <!-- 开工按钮 -->
        <div class="button-wrapper">
          <div class="button-group">
            <a-button v-if="false" type="primary" @click="clearTableData" class="clear-button">清空数据</a-button>
            <a-button @click="handleSubmit" type="primary" class="submit-button" :loading="submitLoading" :disabled="submitDisabled || submitLoading">开工</a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    
    <!-- 领料弹框 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :title="isEditMode ? '编辑领料明细' : '添加领料明细'"
      :width="800"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <BasicForm @register="registerMaterialFormModal" ref="materialFormRef" />
    </BasicModal>
  </div>
</template>

<style scoped>
.custom-form-wrapper {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  height: calc(100vh - 40px);
  box-sizing: border-box;
  overflow: hidden;
}

.button-wrapper {
  position: absolute;
  bottom: -40px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-group {
  display: flex;
  gap: 20px;
}

.submit-button {
  margin-left: 0;
}

.clear-button {
  text-align: center;
}
</style>
