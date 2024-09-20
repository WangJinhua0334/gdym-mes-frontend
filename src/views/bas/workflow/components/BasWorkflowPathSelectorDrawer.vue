<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="编辑工序" width="550px" @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm" />
    <!--右下角按钮-->
    <template #footer>
      <a-button @click="closeDrawer" type="ghost">取消</a-button>
      <a-button @click="handleSubmit" type="primary" :loading="loading">保存</a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, useAttrs } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { formSchema, formSchemaDrawer, formSchemaPathSelectorDrawer } from '../BasWorkflowStation.data';

  const workflowId = ref();

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const attrs = useAttrs();
  const loading = ref(false);

  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 110,
    schemas: formSchemaPathSelectorDrawer,
    showActionButtonGroup: false,
  });
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    console.log(data);

    workflowId.value = data.workflowId;
    let stationData = data.record;

    setDrawerProps({ confirmLoading: true });
    setFieldsValue({
      ...stationData,
    });

    //禁用表单
    setProps({ disabled: !attrs.showFooter });
  });

  /**
   * 提交
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      //提交表单
      if (unref(workflowId)) {
        values['workflowId'] = unref(workflowId);
      }

      closeDrawer();
      emit('success', values);
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
