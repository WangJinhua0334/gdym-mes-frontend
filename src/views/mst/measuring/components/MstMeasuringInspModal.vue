<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'量具校验'" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="量具校验明细" key="mstMeasuringInspItem" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mstMeasuringInspItem"
          :loading="mstMeasuringInspItemTable.loading"
          :columns="mstMeasuringInspItemTable.columns"
          :dataSource="mstMeasuringInspItemTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        >
          <template #resultslot="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              v-model:unCheckedValue="record.column.customValue[1]"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
    <template #centerFooter>
      <a-button type="primary" @click="handleSave">暂存</a-button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, mstMeasuringInspItemJVxeColumns } from '../insp/MstMeasuringInsp.data';
  import { save, mstMeasuringInspItemList } from '../insp/MstMeasuringInsp.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  import { status } from 'nprogress';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const refKeys = ref(['mstMeasuringInspItem']);
  const activeKey = ref('mstMeasuringInspItem');
  const mstMeasuringInspItem = ref();
  const tableRefs = { mstMeasuringInspItem };
  const mstMeasuringInspItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: mstMeasuringInspItemJVxeColumns,
  });

  const isSubmit = ref(true);

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true });
    //
    await setFieldsValue({
      measuringId: data.measuringId,
    });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: false });
  });
  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  //设置标题
  // const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'mstMeasuringInspItem';
    mstMeasuringInspItemTable.dataSource = [];
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({ isSubmit: unref(isSubmit) }, allValues.formValue);

    return {
      ...main, // 展开
      mstMeasuringInspItemList: allValues.tablesValue[0].tableData,
    };
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });

      console.log(values);

      //提交表单
      await save(values);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /**
   * 暂存
   */
  function handleSave() {
    isSubmit.value = false;
    handleSubmit();
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
