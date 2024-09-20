<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="工序动作" key="basStationAction" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basStationAction"
          :loading="basStationActionTable.loading"
          :columns="basStationActionTable.columns"
          :dataSource="basStationActionTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
      <a-tab-pane tab="工序技能" key="basStationSkill" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basStationSkill"
          :loading="basStationSkillTable.loading"
          :columns="basStationSkillTable.columns"
          :dataSource="basStationSkillTable.dataSource"
          @valueChange="basStationSkillTableValueChange"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
      <a-tab-pane tab="子工序" key="basChildStation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basChildStation"
          :loading="basChildStationTable.loading"
          :columns="basChildStationTable.columns"
          :dataSource="basChildStationTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, basStationActionJVxeColumns, basStationSkillJVxeColumns, basChildStationJVxeColumns } from '../BasStation.data';
  import { saveOrUpdate, queryBasStationAction, queryBasStationSkill, queryBasChildStation } from '../BasStation.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['basStationAction', 'basStationSkill', 'basChildStation']);
  const activeKey = ref('basStationAction');
  const basStationAction = ref();
  const basStationSkill = ref();
  const basChildStation = ref();
  const tableRefs = { basStationAction, basStationSkill, basChildStation };
  const basStationActionTable = reactive({
    loading: false,
    dataSource: [],
    columns: basStationActionJVxeColumns,
  });
  const basStationSkillTable = reactive({
    loading: false,
    dataSource: [],
    columns: basStationSkillJVxeColumns,
  });
  const basChildStationTable = reactive({
    loading: false,
    dataSource: [],
    columns: basChildStationJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      requestSubTableData(queryBasStationAction, { id: data?.record?.id }, basStationActionTable);
      requestSubTableData(queryBasStationSkill, { id: data?.record?.id }, basStationSkillTable);
      requestSubTableData(queryBasChildStation, { id: data?.record?.id }, basChildStationTable);
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
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
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function reset() {
    await resetFields();
    activeKey.value = 'basStationAction';
    basStationActionTable.dataSource = [];
    basStationSkillTable.dataSource = [];
    basChildStationTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      basStationActionList: allValues.tablesValue[0].tableData,
      basStationSkillList: allValues.tablesValue[1].tableData,
      basStationChildList: allValues.tablesValue[2].tableData,
    };
  }
  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // 工序技能值变更事件
  function basStationSkillTableValueChange(args) {
    const { oldValue, value, row, column } = args;
    if (column.property != 'skillId') return;
    if (oldValue == value) return;

    row.skillLevelId = null;
    row.skillLevelId_dictText = null;
    row.skillLevelName = null;
    row.skillLevelName_dictText = null;
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
