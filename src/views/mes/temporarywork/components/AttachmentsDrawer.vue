<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :width="500">
    <BasicForm @register="registerForm" />
    <slot>
      <div class="footer">
        <a-button @click="closeDrawer">返回</a-button>
      </div>
    </slot>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { attachmentsFormSchema } from '../MesTemporaryWork.data';

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue }] = useForm({
    //labelWidth: 150,
    schemas: attachmentsFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    //重置表单
    await resetFields();

    setDrawerProps({ loading: false, showCancelBtn: true, cancelText: '返回', showOkBtn: false });

    await setFieldsValue({ id: data.record.id, attachments: data.record.attachments });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: true });
  });

  //设置标题
  const title = computed(() => '附件');
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }

  .footer {
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 10px 5px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    /* background: #f5f5f5; */
    border-top: 1px solid #f0f0f0;
  }
  .footer button {
    margin: 0px 10px;
  }
</style>
