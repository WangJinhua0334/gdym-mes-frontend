<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @cancel="closeModal">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="工序任务" key="mesMoPlanTask" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoPlanTask"
          :loading="mesMoPlanTaskTable.loading"
          :columns="mesMoPlanTaskTable.columns"
          :dataSource="mesMoPlanTaskTable.dataSource"
          :height="340"
          :disabled="true"
          :rowNumber="true"
          :sortKey="''"
          :rowSelection="false"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, mesMoPlanTaskJVxeColumns } from './MesMoPlanDetail.data';
  import { listMoPlanTaskByMoPlanId } from '../MesMoPlan.api';

  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const moPlanId = ref<string>();

  const refKeys = ref(['mesMoPlanTask']);
  const activeKey = ref('mesMoPlanTask');
  const mesMoPlanTask = ref();

  const tableRefs = { mesMoPlanTask };
  const mesMoPlanTaskTable = reactive({
    loading: false,
    dataSource: [],
    columns: mesMoPlanTaskJVxeColumns,
  });

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: true,
  });

  /**子表格方法配置*/
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  /**表单赋值*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: false, showOkBtn: false, showCancelBtn: true, cancelText: '返回', defaultFullscreen: true });

    moPlanId.value = data.record.id;

    /**表单赋值 */
    await setFieldsValue({ ...data.record });
    /**子表格赋值 */
    requestSubTableData(listMoPlanTaskByMoPlanId, { moPlanId: data.record.id }, mesMoPlanTaskTable);
  });

  //设置标题
  const title = computed(() => '详情');

  /**提交参数构造 */
  function classifyIntoFormData(allValues) {}

  /**表单提交事件*/
  async function requestAddOrEdit(values) {}

  async function reset() {
    await resetFields();
    mesMoPlanTaskTable.dataSource = [];
    mesMoPlanTask?.value?.getXTable()?.updateData();
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

  :deep(.ant-picker) {
    width: 100%;
  }
</style>
