<template>
  <BasicForm @register="registerForm" />
  <!--页脚-->
  <slot>
    <div class="footer">
      <a-button @click="doClose">关闭</a-button>
      <a-button type="primary" v-show="viewType != 'detail'" @click="doSubmit">提交</a-button>
    </div>
  </slot>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, viewType } from '../MesTemporaryWork.data';
  import { saveOrUpdate } from '../MesTemporaryWork.api';
  import { useUserStore } from '/@/store/modules/user';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const userStore = useUserStore();

  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  const isUpdate = ref(true);
  const operateBy = ref<string>('');

  //表单配置
  const [registerForm, { setProps, setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  onMounted(() => {
    setTimeout(() => {
      viewType.value = 'add';
      if (!!props.componentData?.viewType) viewType.value = props.componentData.viewType;

      isUpdate.value = false;
      if (!!props.componentData?.isUpdate) isUpdate.value = props.componentData.isUpdate;

      operateBy.value = userStore.getUserInfo.username;
      if (!!props.componentData?.record?.operateBy) operateBy.value = props.componentData.record.operateBy;

      if (isUpdate.value) {
        setFieldsValue({
          ...unref(props.componentData.record),
        });
      } else {
        setFieldsValue({ operateBy: unref(operateBy) });
      }

      // 隐藏底部时禁用整个表单
      setProps({ disabled: !!props.componentData.showFooter ? !props.componentData.showFooter : false });
    }, 500);
  });

  function doClose() {
    emit('close');
  }

  async function doSubmit() {
    try {
      let values = await validate();
      values.startTime = getFieldsValue().startTime;
      values.completeTime = getFieldsValue().completeTime;

      emit('setModalProps', { confirmLoading: true });

      //提交表单
      await saveOrUpdate(values, isUpdate.value);

      //刷新列表
      emit('success');
    } finally {
      emit('setModalProps', { confirmLoading: false });
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
