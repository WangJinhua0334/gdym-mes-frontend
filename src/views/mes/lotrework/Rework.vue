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
  import { ref, unref, computed, onMounted, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, moId, prodId, doEnterPress } from './Rework.data';
  import { rework, getScan } from './Rework.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

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
  const sn = computed(() => getFieldsValue().sn);

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
        Scan(unref(sn));
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
      if (unref(workBenchData).scanInfo.sn) {
        //工作台传过来的SN信息
        setFieldsValue({ sn: unref(workBenchData).scanInfo.sn });
        Scan(unref(workBenchData).scanInfo.sn);
      } else if (props.sn) {
        //通过其他界面调过来传递sn
        setFieldsValue({ sn: props.sn });
        Scan(props.sn);
      }
    }, 500);
  });
  /**
   * 重置数据
   */
  function reset() {
    moId.value = '';
    prodId.value = '';

    //给页面数据进行赋值
    setFieldsValue({
      sn: '',
      moCode: '',
      moPlanCode: '',
      title: '',
      prodCode: '',
      prodName: '',
    });
  }
  /**
   * 根据SN查询数据
   */
  function Scan(snData) {
    emit('setModalProps', { confirmLoading: true });
    reset();
    getScan({ sn: snData })
      .then((res) => {
        if (res) {
          moId.value = unref(res).moId;
          prodId.value = unref(res).prodId;

          //给页面数据进行赋值
          setFieldsValue({
            moCode: unref(res).mesMo.code,
            moPlanCode: unref(res).mesMoPlan.code,
            title: unref(res).basWorkflowStation.title,
            prodCode: unref(res).basProduct.code,
            prodName: unref(res).basProduct.name,
            sn: unref(res).sn,
          });
        }
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        close();
        emit('setModalProps', { confirmLoading: false });
      });
  }
  // 重工
  function doReWork() {
    emit('setModalProps', { confirmLoading: true });
    rework({
      sn: sn.value,
      wfsId: unref(getFieldsValue()).wfsId,
      remark: unref(getFieldsValue()).remark,
    })
      .then((res) => {
        emit('success');
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
    await doReWork();
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
