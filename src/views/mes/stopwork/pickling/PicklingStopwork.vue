<script setup lang="ts" name="mo-PicklingStopwork">
import { getFormSchema ,getDetailJVxeColumns,formSchema} from './PicklingStopwork.ts';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "@/views/mes/stopwork/pickling/PicklingStopwork.api";
import {useMessage} from "@/hooks/web/useMessage";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {computed, onMounted, reactive, ref, unref} from "vue";
import { BasicModal, useModal, useModalInner } from '@/components/Modal';
import {buildUUID} from "@/utils/uuid";
import dayjs from "dayjs";

//租户id
const tenantId = ref<string>('');
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
function handleDelete(record: Recordable) {
  console.log('点击了删除', record);
}
function handleOpen(record: Recordable) {
  console.log('点击了启用', record);
}
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
const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields,setFieldsValue: setExtendedFieldsValue, }] = useForm({
  labelWidth: 160,
  schemas: formSchema,
  showActionButtonGroup: false,
  disabled: false,
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
  try {
    // 验证表单
    const mainFormValues = await validate();
    // 获取子表数据
    let detailData = [];
    if (mesProductPickDetail.value) {
      detailData = mesProductPickDetail.value.getTableData();
    }
    // 组装完整数据 - 将主表数据和子表数据平级合并
    const submitData = {
      ...mainFormValues,
      pickingProductInfoList: detailData
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
  const coilNo = formData.flowCardId?.steelId || formData.flowCardId || '';

  // 获取当前子表的数据源长度作为序号（确保每次都获取最新的数据长度）
  const currentDataSource = mesProductPickDetail.value ? mesProductPickDetail.value.getTableData() : mesProductPickDetailTable.dataSource;
  const currentIndex = Array.isArray(currentDataSource) ? currentDataSource.length + 1 : 1;
  // 拼接新的钢卷号
  const newCoilNo = `10-${coilNo}-${currentIndex}`;
  // 先打开弹框
  openModal(true, {});
  // 延迟设置值，确保弹框已打开并且表单已初始化
  setTimeout(() => {
    setExtendedFieldsValue({
      newCoilNo: newCoilNo
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
    if (!values.warehouseId) {
      $message.createMessage.warning('请选择仓库');
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
      destination: destinationLabel || values.destination || '',   // 流转去向
      warehouseId: values.warehouseId || '',   // 仓库id
      warehouseName: values.warehouseName || '',   // 仓库名称
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
          <a-button @click="handleSubmit" type="primary">扫码完工</a-button>
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

/* 为表格区域添加滚动条 */
.tabs-container {
  height: calc(100% - 100px); /* 减去表单高度 */
  overflow-y: auto;
}

.button-wrapper {
  position: absolute;
  bottom: -40px;
  right: 0;
}
</style>

