<template>
  <BasicForm @register="registerCompleteForm" />
  <!--页脚-->
  <slot>
    <div class="footer">
      <a-button @click="doClose">关闭</a-button>
      <a-button type="primary" @click="handleSubmit">确认</a-button>
    </div>
  </slot>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, selectHandleMethod, scanSn } from './MesLotDefectiveCompleteModal.data';
  import { saveOrUpdate, scanSnQuery } from './MesLotDefectiveCompleteModal.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  // Emits声明
  const emit = defineEmits(['success', 'close', 'setModalProps']);
  //提示弹窗
  const $message = useMessage();
  //调用ts页面的方法
  scanSn.value = (sn) => {
    scranLotSn(sn);
  };
  //获取父组件传递的数据
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
    defectiveCardSn: {
      type: String,
      default: '',
    },
  });
  //监听处理方式下拉框切换事件
  watch(
    () => selectHandleMethod.value,
    () => {
      if (unref(selectHandleMethod) == 'scrap') {
        updateSchema({ field: 'scrapQty', show: true });
      } else {
        updateSchema({ field: 'scrapQty', show: false });
      }
    },
    { immediate: false, deep: true }
  );

  watch(
    () => props.defectiveCardSn,
    () => {
      if (props.defectiveCardSn) {
        scranLotSn(props.defectiveCardSn);
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerCompleteForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //加载事件
  onMounted(() => {
    resetFields();
    setTimeout(() => {
      if (props.componentData && unref(props.componentData.record.scanInfo).sn) {
        scranLotSn(unref(props.componentData.record.scanInfo).sn);
        updateSchema({ field: 'sn', componentProps: { disabled: true } });
      } else {
        updateSchema({ field: 'sn', componentProps: { disabled: false } });
      }
    }, 500);
  });
  //扫描流转卡事件
  async function scranLotSn(sn: any) {
    try {
      emit('setModalProps', { confirmLoading: true });
      resetFields();
      //查询表单
      await scanSnQuery({ sn: sn }).then((data) => {
        if (!data.success) {
          $message.createMessage.error(data.message);
        } else {
          setFieldsValue({
            ...data.result,
            defectId: data.result.defectId || '',
          });
        }
      });
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await saveOrUpdate(values);
      //关闭弹窗
      emit('close');
      //刷新列表
      emit('success');
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  /**
   * 关闭窗口事件
   */
  function doClose() {
    emit('close');
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
