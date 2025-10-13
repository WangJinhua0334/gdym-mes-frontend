<script setup lang="ts" name="mo-PicklingStopwork">
import { getFormSchema ,getDetailJVxeColumns,formSchema} from './PicklingStopwork.ts';
import {BasicForm, useForm} from "@/components/Form";
import {saveOrUpdate} from "@/views/mes/stopwork/pickling/PicklingStopwork.api";
import {useMessage} from "@/hooks/web/useMessage";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {computed, reactive, ref, unref} from "vue";
import { BasicModal, useModal, useModalInner } from '@/components/Modal';
import {buildUUID} from "@/utils/uuid";

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

//表单配置 酸洗扫码完工表单
const [registerForm,{validate}] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});

// 酸洗扫码完工提交事件
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
}
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    //提交表单
    await saveOrUpdate(values);
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  }
}
// 注册弹框
const [registerModal, { openModal ,closeModal}] = useModal();
//酸洗扫码完工新增引用弹框
const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields }] = useForm({
  labelWidth: 160,
  schemas: formSchema,
  showActionButtonGroup: false,
  disabled: false,
});
//新增按钮点击事件
function handleAddDetail() {
  openModal(true, {});
}
//子表单弹框确定按钮点击事件
async function handleModalOk() {
  try {
    const values = await validateExtendedForm();
    // 字段映射（根据实际需求调整）
    const rowData = {
      id: buildUUID(),
      prodId_dictText1: values.licensePlateNumber1 || '',           // 条码
      prodId_dictText2: values.licensePlateNumber2 || '',   // 钢卷号
      prodId_dictText3: values.licensePlateNumber3 || '',           // 物料编码
      prodId_dictText4: values.licensePlateNumber4 || '',   // 物料名称（这里可能需要调整）
      prodId_dictText5: values.licensePlateNumber5 || '',           // 规格型号
      prodId_dictText6: values.licensePlateNumber6 || '',   // 重量
      prodId_dictText7: values.licensePlateNumber7 || '',   // 流转去向
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
</script>
<template>
  <div class="custom-form-wrapper">
    <BasicForm @register="registerForm" :width="896"/>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="产出品明细" key="mesProductPickDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesProductPickDetail"
          :loading="mesProductPickDetailTable.loading"
          :columns="mesProductPickDetailTable.columns"
          :dataSource="mesProductPickDetailTable.dataSource"
          :height="340"
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
      </a-tab-pane>
    </a-tabs>
    <!--新增选择产品弹框-->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      title="添加产出品明细"
      :width="800"
      @ok="handleModalOk"
    >
      <BasicForm @register="registerExtendedFormModal" />
    </BasicModal>
    <a-button @click="handleSubmit" type="primary" >扫码完工</a-button>
  </div>
</template>

<style scoped>.custom-form-wrapper{
  background-color: white; /* 设置背景颜色 */
  padding: 20px; /* 可选：添加内边距 */
  border-radius: 4px; /* 可选：添加圆角 */
  min-height: calc(100vh - 40px);
  box-sizing: border-box;
  overflow: hidden; /* 隐藏溢出内容 */
}

</style>
