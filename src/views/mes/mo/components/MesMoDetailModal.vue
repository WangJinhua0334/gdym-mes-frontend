<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'工单详情'" @cancel="closeModal" :width="896">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="工单BOM" key="mesMoBom" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoBom"
          :loading="mesMoBomTable.loading"
          :columns="mesMoBomTable.columns"
          :dataSource="mesMoBomTable.dataSource"
          :height="340"
          :disabled="true"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
        >
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
              disabled
            /> </template
        ></JVxeTable>
      </a-tab-pane>
      <a-tab-pane tab="工单工序" key="mesMoStation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoStation"
          :loading="mesMoStationTable.loading"
          :columns="mesMoStationTable.columns"
          :dataSource="mesMoStationTable.dataSource"
          :height="340"
          :disabled="true"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
        >
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
              disabled
            /> </template
        ></JVxeTable>
      </a-tab-pane>

      <a-tab-pane tab="工单工序BOM" key="mesMoStationBom" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoStationBom"
          :loading="mesMoStationBomTable.loading"
          :columns="mesMoStationBomTable.columns"
          :dataSource="mesMoStationBomTable.dataSource"
          :height="340"
          :disabled="true"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
        >
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
              disabled
            /> </template
        ></JVxeTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, mesMoBomJVxeColumns, mesMoStationJVxeColumns, mesMoStationBomJVxeColumns } from './MesMoDetail.data';
  import { queryMesMoBom, queryMesMoStation, queryMesMoStationBom } from '../MesMo.api';

  const refKeys = ref(['mesMoBom', 'mesMoStation', 'mesMoStationBom']);
  const activeKey = ref('mesMoBom');
  const mesMoBom = ref();
  const mesMoStation = ref();
  const mesMoStationBom = ref();

  const tableRefs = { mesMoBom, mesMoStation, mesMoStationBom };
  const mesMoBomTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoBomJVxeColumns,
  });

  const mesMoStationTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoStationJVxeColumns,
  });

  const mesMoStationBomTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoStationBomJVxeColumns,
  });

  //表单配置
  const [registerForm, { resetFields, setFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: true,
  });

  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: true, showOkBtn: false, showCancelBtn: true, cancelText: '返回', defaultFullscreen: true });

    /**表单赋值 */
    await setFieldsValue({ ...data.record });

    requestSubTableData(queryMesMoBom, { mainId: data?.record?.id }, mesMoBomTable);
    requestSubTableData(queryMesMoStation, { mainId: data?.record?.id }, mesMoStationTable);
    requestSubTableData(queryMesMoStationBom, { mainId: data?.record?.id }, mesMoStationBomTable);
  });

  async function reset() {
    await resetFields();
    activeKey.value = 'mesMoBom';
    mesMoBomTable.dataSource = [];
    mesMoStationTable.dataSource = [];
    mesMoStationBomTable.dataSource = [];
  }

  // 构建表单数据
  function classifyIntoFormData(allValues) {}
  //表单提交事件
  async function requestAddOrEdit(values) {}
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-picker) {
    width: 100%;
  }
</style>
