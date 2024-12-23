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
  import { downFormSchema, doDownEnterPress } from './WkpStock.data';
  import { scranDownMat, downMat } from './WkpStock.api';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
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
    () => doDownEnterPress.value,
    () => {
      if (doDownEnterPress.value) {
        scanSN(unref(getFieldsValue()).sn);
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
      document.getElementById('form_item_sn')?.focus();
    }, 100);
  });
  // 过站校验
  async function scanSN(sn) {
    emit('setModalProps', { confirmLoading: true });
    scranDownMat({
      sn: sn,
    })
      .then((res) => {
        if (res.materialSn) {
          setFieldsValue({
            ...res,
          });
        }
        document.getElementById('form_item_sn')?.focus();
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        //emit('close');
        emit('setModalProps', { confirmLoading: false });
      })
      .finally(() => {
        setFieldsValue({
          sn: '',
        });
      });
  }

  function close() {
    emit('close');
  }
  // 下料
  async function doWoke() {
    try {
      let values = await validate();
      values.wkpId = props.componentData?.record?.workPostId;
      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await downMat(values);
      //刷新列表
      emit('success');
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  async function submit() {
    await validate();
    try {
      emit('setModalProps', { confirmLoading: true });
      await doWoke();
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
