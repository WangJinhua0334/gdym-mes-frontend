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
  import { ref, unref, onMounted, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, doEnterPress } from './DistributeLine.data';
  import { save, getSnData } from './DistributeLine.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
    //通过其他界面需要传递sn数据
    sn: {
      type: String,
      default: '',
    },
  });
  const workBenchData = unref(props.componentData).record;
  const sn = ref('');

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  /**
   * 监听SN回车事件
   */
  watch(
    () => doEnterPress.value,
    () => {
      if (doEnterPress.value) {
        Scan(unref(getFieldsValue()).sn);
      }
    },
    { immediate: false, deep: true }
  );
  /**
   * 页面加载时方法
   */
  onMounted(() => {
    setTimeout(() => {
      reset();
      //工作台调用界面传递sn值
      if (unref(workBenchData).scanInfo.sn) {
        setFieldsValue({
          sn: unref(workBenchData).scanInfo.sn,
        });
        Scan(unref(workBenchData).scanInfo.sn);
      }
      //通过其他界面调过来传递sn
      if (props.sn) {
        setFieldsValue({
          sn: props.sn,
        });
        Scan(props.sn);
      }
    }, 500);
  });
  /**
   * 重置数据
   */
  function reset() {
    sn.value = '';

    //给页面数据进行赋值
    setFieldsValue({
      moCode: '',
      moPlanCode: '',
      title: '',
      prodCode: '',
      prodName: '',
      qty: '',
      notQty: 0,
    });
  }
  /**
   * 根据SN查询数据
   */
  function Scan(snData) {
    emit('setModalProps', { confirmLoading: true });
    reset();
    getSnData({ sn: snData })
      .then((res) => {
        if (res) {
          sn.value = unref(res).sn;

          //给页面数据进行赋值
          setFieldsValue({
            moCode: unref(res).mesMo.code,
            moPlanCode: unref(res).mesMoPlan.code,
            title: unref(res).basWorkflowStation.title,
            prodCode: unref(res).basProduct.code,
            prodName: unref(res).basProduct.name,
            sn: unref(res).sn,
            qty: unref(res).qty,
            notQty: unref(res).qty,
          });
        }
        emit('setModalProps', { confirmLoading: false });
        //增加扫描之后，自动下发产线功能
        doSave();
      })
      .catch((err) => {
        //close();
        emit('setModalProps', { confirmLoading: false });
      });
  }
  // 下发任务到产线
  function doSave() {
    emit('setModalProps', { confirmLoading: true });
    save({
      sn: sn.value,
      qty: unref(getFieldsValue()).notQty,
      wkpId: unref(getFieldsValue()).wkpId,
    })
      .then((res) => {
        //emit('success');
        setFieldsValue({
          sn: '',
        });
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('setModalProps', { confirmLoading: false });
      });
  }

  function close() {
    emit('close');
  }

  async function submit() {
    await validate();
    await doSave();
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
