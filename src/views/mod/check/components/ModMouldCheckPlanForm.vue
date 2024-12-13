<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="模具点检项目子表" key="modMouldCheckRecItem" :forceRender="true">
        <JVxeTable
          v-if="modMouldCheckRecItemTable.show"
          keep-source
          resizable
          ref="modMouldCheckRecItem"
          :loading="modMouldCheckRecItemTable.loading"
          :columns="modMouldCheckRecItemTable.columns"
          :dataSource="modMouldCheckRecItemTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>
    <div style="width: 100%; text-align: center; margin-top: 10px" v-if="showFlowSubmitButton">
      <a-button preIcon="ant-design:check-outlined" style="width: 126px" type="primary" @click="handleSubmit">提 交</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defHttp } from '/@/utils/http/axios';
  import { ref, computed, unref, reactive, onMounted, defineProps } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, modMouldCheckRecItemJVxeColumns } from '../ModMouldCheckPlan.data';
  import { saveOrUpdate, queryModMouldCheckRecItem } from '../ModMouldCheckPlan.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  const isUpdate = ref(true);

  const refKeys = ref(['modMouldCheckRecItem']);
  const activeKey = ref('modMouldCheckRecItem');
  const modMouldCheckRecItem = ref();
  const tableRefs = { modMouldCheckRecItem };
  const modMouldCheckRecItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: modMouldCheckRecItemJVxeColumns,
    show: false,
  });

  const props = defineProps({
    formData: { type: Object, default: () => {} },
    formBpm: { type: Boolean, default: true },
  });
  const formDisabled = computed(() => {
    if (props.formBpm === true) {
      if (props.formData.disabled === false) {
        return false;
      }
    }
    return true;
  });
  // 是否显示提交按钮
  const showFlowSubmitButton = computed(() => {
    if (props.formBpm === true) {
      if (props.formData.disabled === false) {
        return true;
      }
    }
    return false;
  });

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });

  onMounted(() => {
    initFormData();
  });
  //渲染流程表单数据
  const queryByIdUrl = '/mod/check/queryById';
  async function initFormData() {
    if (props.formBpm === true) {
      await reset();
      let params = { id: props.formData.dataId };
      const data = await defHttp.get({ url: queryByIdUrl, params });
      //表单赋值
      await setFieldsValue({
        ...data,
      });
      requestSubTableData(queryModMouldCheckRecItem, { id: data.id }, modMouldCheckRecItemTable, () => {
        modMouldCheckRecItemTable.show = true;
      });
      // 隐藏底部时禁用整个表单
      setProps({ disabled: formDisabled.value });
    }
  }

  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  async function reset() {
    await resetFields();
    activeKey.value = 'modMouldCheckRecItem';
    modMouldCheckRecItemTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      modMouldCheckRecItemList: allValues.tablesValue[0].tableData,
    };
  }
  //表单提交事件
  async function requestAddOrEdit(values) {
    //提交表单
    await saveOrUpdate(values, true);
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
