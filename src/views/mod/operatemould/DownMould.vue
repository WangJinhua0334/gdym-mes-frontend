<template>
  <BasicForm @register="registerForm" />
  <!--页脚-->
  <slot>
    <div class="footer">
      <a-button @click="close">关闭</a-button>
      <a-button type="primary" @click="submit">提交</a-button>
    </div>
  </slot>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { downFormSchema, doDownMould } from './OperateMould.data';
  import { scanDownMould, downMould } from './OperateMould.api';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  //获取父组件传递的数据
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  /**
   * 监听SN回车事件
   */
  watch(
    () => doDownMould.value,
    () => {
      if (doDownMould.value) {
        scan(unref(getFieldsValue()).mouldCode);
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: downFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  onMounted(() => {
    setTimeout(() => {
      document.getElementById('form_item_mouldCode')?.focus();
    }, 100);
  });
  // 过站校验
  async function scan(mouldCode) {
    emit('setModalProps', { confirmLoading: true });
    scanDownMould({
      mouldCode: mouldCode,
    }).then((res) => {
      if (res.mouldId) {
        setFieldsValue({
          id: res.id,
          mouldId: res.mouldId,
          mouldId_dictText: res.mouldId_dictText,
          cavityOk: res.cavityOk,
          equipId: res.equipId,
          equipId_dictText: res.equipId_dictText,
          remark: res.remark,
        });
      }
      document.getElementById('form_item_mouldCode')?.focus();
      emit('setModalProps', { confirmLoading: false });
    });
  }

  function close() {
    emit('close');
  }
  async function submit() {
    const values = await validate();
    try {
      emit('setModalProps', { confirmLoading: true });
      await downMould(values);
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
    padding: 5px 5px;
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
