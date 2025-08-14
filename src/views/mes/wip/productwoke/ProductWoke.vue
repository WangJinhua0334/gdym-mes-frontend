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
  import { formSchema, wkpId } from './ProductWoke.data';
  import { getWokeData, woke } from './ProductWoke.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const $message = useMessage();
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  console.log(props.componentData.record);
  const workBenchData = props.componentData.record;

  const sn = ref();
  const wokeData = ref();

  watch(
    () => unref(wokeData),
    () => {
      if (unref(wokeData)) {
        /*setFieldsValue({
          ...unref(scanResult),
        });*/

        setFieldsValue({ moCode: unref(wokeData).mesMo.code });
        setFieldsValue({ moPlanCode: unref(wokeData).mesMoPlan.code });
        setFieldsValue({ title: unref(wokeData).basWorkflowStation.title });
        setFieldsValue({ prodCode: unref(wokeData).basProduct.code });
        setFieldsValue({ prodName: unref(wokeData).basProduct.name });
        //setFieldsValue({ prodSpec: unref(scanResult).basProduct.specification });
        setFieldsValue({ sn: unref(wokeData).sn });
        setFieldsValue({ qty: unref(wokeData).qty });
        setFieldsValue({ wokenQty: unref(wokeData).wokenQty });
        setFieldsValue({ ngnQty: unref(wokeData).ngnQty });
        setFieldsValue({ wokeQty: unref(wokeData).qty - unref(wokeData).wokenQty - unref(wokeData).ngnQty });
        setFieldsValue({ ngQty: 0 });
        setFieldsValue({ scrapedQty: 0 });
        setFieldsValue({ startTime: new Date() });
        setFieldsValue({ completeTime: new Date() });
        setFieldsValue({ operator: unref(workBenchData).operateBy ?? userStore.getUserInfo.username });
        setFieldsValue({ equipmentId: unref(wokeData).equipmentId });
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  onMounted(() => {
    setTimeout(() => {
      if (unref(workBenchData).workPostId) {
        wkpId.value = unref(workBenchData).workPostId;
        if (unref(workBenchData).scanInfo) {
          sn.value = workBenchData.scanInfo.sn;
          doGetWokeData();
        } else {
          $message.createMessage.warning('请先扫描流转卡！');
          emit('close');
        }
      } else {
        $message.createMessage.warning('请先选择工位！');
        emit('close');
      }
    }, 500);
  });

  // 过站校验
  async function doGetWokeData() {
    emit('setModalProps', { confirmLoading: true });
    getWokeData({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      operateBy: getFieldsValue().operator,
    })
      .then((res) => {
        wokeData.value = res;
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  // 过站
  async function doWoke() {
    emit('setModalProps', { confirmLoading: true });
    await woke({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      equipmentId: getFieldsValue().equipmentId,
      qty: getFieldsValue().wokeQty,
      ngQty: getFieldsValue().ngQty,
      scrapedQty: getFieldsValue().scrapedQty,
      startTime: getFieldsValue().startTime,
      completeTime: getFieldsValue().completeTime,
      operateBy: getFieldsValue().operator,
      stopTime: getFieldsValue().stopTime,
      stopCause: getFieldsValue().stopCause,
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
