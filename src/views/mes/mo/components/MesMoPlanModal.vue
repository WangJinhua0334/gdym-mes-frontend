<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @cancel="handleCancel" @ok="handleSubmit">
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
          :max-height="450"
          :disabled="disabled"
          :rowNumber="true"
          :sortKey="''"
          :rowSelection="false"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { getFormSchema, mesMoPlanTaskJVxeColumns, moId, wkcIds, planStartTime, planEndTime } from '../MesMoPlan.data';
  import {
    moCompleteKitCheck,
    getAddData,
    listMoPlanTaskByMoId,
    getEditData,
    listMoPlanTaskByMoPlanId,
    saveOrUpdate,
    getCreateSnData,
    createSn,
    fillRule,
  } from '../MesMoPlan.api';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import console from 'console';

  const props = defineProps({
    moId: {
      type: String,
      default: '',
    },
  });

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref<boolean>(false);
  const disabled = ref<boolean>(false);

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

  /**是否开启齐套检查 */
  const completeKitCheck = ref(false);

  /**是否开启工单齐套检查 */
  setTimeout(() => {
    moCompleteKitCheck({}).then((res) => {
      completeKitCheck.value = res;
    });
  }, 50);

  /**表单配置 */
  const formSchema = computed(() => getFormSchema(unref(completeKitCheck)));

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
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

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: true });

    isUpdate.value = !!data?.isUpdate;
    disabled.value = !!data?.disabled;
    if (unref(isUpdate)) {
      moPlanId.value = data.record.id;
      wkcIds.value = data.record.wkcIds.split(',');

      try {
        setModalProps({ confirmLoading: true });

        /**表单赋值 */
        await getEditData({ moPlanId: data.record.id }).then((res) => {
          setFieldsValue({ ...res });
          requestSubTableData(listMoPlanTaskByMoPlanId, { moPlanId: data.record.id }, mesMoPlanTaskTable);
        });
      } catch (error) {
        closeModal();
        console.log(error);
      } finally {
        setModalProps({ confirmLoading: false });
      }
    } else {
      if (props.moId && props.moId != '') {
        moId.value = props.moId;
        setFieldsValue({ moId: props.moId });
        updateSchema({ field: 'moId', dynamicDisabled: true });
      } else {
        setFieldsValue({ planStartTime: new Date().setMinutes(0, 0), planCompleteTime: new Date().setMinutes(0, 0) });
      }
    }

    setProps({ disabled: unref(disabled) });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  /**监听工单选择 */
  watch(
    () => unref(moId),
    async () => {
      if (unref(moId)) {
        getAddData({ moId: unref(moId) }).then((res) => {
          setFieldsValue({ ...res });
          requestSubTableData(
            listMoPlanTaskByMoId,
            {
              moId: unref(moId),
              wkcIds: !unref(wkcIds) ? '' : unref(wkcIds).join(),
            },
            mesMoPlanTaskTable
          );
          //mesMoPlanTaskTable.dataSource = res.moPlanTaskList;
          //mesMoPlanTask.value.getXTable().updateData();
        });
      } else {
        reset();
      }
    },
    { immediate: false, deep: true }
  );

  /**监听工作中心选择 */
  watch(
    () => unref(wkcIds),
    async () => {
      const tmpMoId = getFieldsValue().moId;
      if (tmpMoId) {
        requestSubTableData(listMoPlanTaskByMoId, { moId: unref(tmpMoId), wkcIds: !unref(wkcIds) ? '' : unref(wkcIds).join() }, mesMoPlanTaskTable);
      }
    },
    { immediate: false, deep: true }
  );
  /**监听计划开始时间选择 */
  watch(
    () => unref(planStartTime),
    async () => {
      const data = mesMoPlanTask.value.getTableData();
      //循环data
      data.forEach((item) => {
        item.planStartTime = planStartTime;
      });
      mesMoPlanTaskTable.dataSource = data;
    },
    { immediate: false, deep: true }
  );

  /**监听计划结束时间选择 */
  watch(
    () => unref(planEndTime),
    async () => {
      const data = mesMoPlanTask.value.getTableData();
      //循环data
      data.forEach((item) => {
        item.planCompleteTime = planEndTime;
      });
      mesMoPlanTaskTable.dataSource = data;
    },
    { immediate: false, deep: true }
  );

  /**提交参数构造 */
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      moPlanTaskList: allValues.tablesValue[0].tableData,
    };
  }

  /**表单提交事件*/
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      await saveOrUpdate(values, isUpdate.value);

      clearCache();
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } catch (error) {
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function reset() {
    await resetFields();
    mesMoPlanTaskTable.dataSource = [];
    mesMoPlanTask?.value?.getXTable()?.updateData();
  }

  /**清除缓存 */
  function clearCache() {
    moId.value = null;
    wkcIds.value = null;
  }

  /**取消事件 */
  function handleCancel() {
    clearCache();
    //关闭弹窗
    closeModal();
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
