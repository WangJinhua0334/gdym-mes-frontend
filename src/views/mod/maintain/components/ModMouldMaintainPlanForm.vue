<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="模具保养计划项目表" key="modMouldMaintainRecItem" :forceRender="true">
        <JVxeTable
          v-if="modMouldMaintainRecItemTable.show"
          keep-source
          resizable
          ref="modMouldMaintainRecItem"
          :loading="modMouldMaintainRecItemTable.loading"
          :columns="modMouldMaintainRecItemTable.columns"
          :dataSource="modMouldMaintainRecItemTable.dataSource"
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
  import { formSchema, modMouldMaintainRecItemJVxeColumns } from '../ModMouldMaintainPlan.data';
  import { saveOrUpdate, queryModMouldMaintainRecItem } from '../ModMouldMaintainPlan.api';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  const isUpdate = ref(true);

  const refKeys = ref(['modMouldMaintainRecItem']);
  const activeKey = ref('modMouldMaintainRecItem');
  const modMouldMaintainRecItem = ref();
  const tableRefs = { modMouldMaintainRecItem };
  const modMouldMaintainRecItemTable = reactive({
    loading: false,
    dataSource: [],
    columns: modMouldMaintainRecItemJVxeColumns,
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
  const queryByIdUrl = '/mod/maintain/queryById';
  async function initFormData() {
    if (props.formBpm === true) {
      await reset();
      let params = { id: props.formData.dataId };
      const data = await defHttp.get({ url: queryByIdUrl, params });
      //表单赋值
      await setFieldsValue({
        ...data,
      });
      requestSubTableData(queryModMouldMaintainRecItem, { id: data.id }, modMouldMaintainRecItemTable, () => {
        modMouldMaintainRecItemTable.show = true;
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
    activeKey.value = 'modMouldMaintainRecItem';
    modMouldMaintainRecItemTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      modMouldMaintainRecItemList: allValues.tablesValue[0].tableData,
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
