<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="物料属性" key="basProductProperty" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basProductProperty"
          :loading="basProductPropertyTable.loading"
          :columns="basProductPropertyTable.columns"
          :dataSource="basProductPropertyTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
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
  import { formSchema, basProductPropertyColumns } from '../BasProduct.data';
  import { saveOrUpdate, basProductPropertyList } from '../BasProduct.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  // 隐藏字段按原始值提交，避免表单控件转换或默认值覆盖历史数据。
  const hiddenValues = ref<Recordable>({});
  const refKeys = ref(['basProductProperty']);
  const activeKey = ref('basProductProperty');
  const basProductProperty = ref();
  const tableRefs = {
    basProductProperty,
  };
  const basProductPropertyTable = reactive({
    loading: false,
    dataSource: [],
    columns: basProductPropertyColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: {
      span: 8,
    },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: data?.showFooter,
      showOkBtn: data?.showFooter,
      defaultFullscreen: true,
    });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      const record = data.record;
      formSchema.forEach(({ field, show }) => {
        if (show === false && Object.prototype.hasOwnProperty.call(record, field)) {
          hiddenValues.value[field] = record[field];
        }
      });
      //表单赋值
      await setFieldsValue({
        ...record,
        xName: record.xName ?? record.xname ?? '',
      });
      requestSubTableData(
        basProductPropertyList,
        {
          id: record.id,
        },
        basProductPropertyTable
      );
    }
    // 隐藏底部时禁用整个表单
    setProps({
      disabled: !data?.showFooter,
    });
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
    hiddenValues.value = {};
    await resetFields();
    activeKey.value = 'basProductProperty';
    basProductPropertyTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    const main = {
      ...allValues.formValue,
      ...hiddenValues.value,
    };
    // 文本输入清空后明确写入空串，避免 null 被非空更新策略忽略。
    for (const field of ['erpId', 'useOrgId', 'baseUnitId', 'weightUnitId', 'modelNumber', 'cgdj', 'xsyj', 'xName', 'bb']) {
      main[field] = main[field] ?? '';
    }
    return {
      ...main,
      basProductPropertyList: allValues.tablesValue[0].tableData,
    };
  }
  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({
        confirmLoading: true,
      });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({
        confirmLoading: false,
      });
    }
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
