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
  import { upFormSchema, doUpEnterPress } from './WkpStock.data';
  import { scranDownMat } from './WkpStock.api';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  /**
   * 监听SN回车事件
   */
  watch(
    () => doUpEnterPress.value,
    () => {
      if (doUpEnterPress.value) {
        scanSN(unref(getFieldsValue()).sn);
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: upFormSchema,
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
        console.log(res);
        if (res.sn) {
          setFieldsValue({
            snCode: res.sn,
            sn: '',
          });
        }
        if (res.mesMo) {
          setFieldsValue({
            moCode: res.mesMo.code,
          });
        }
        if (res.mesMoPlan) {
          setFieldsValue({
            moPlanCode: res.mesMoPlan.code,
          });
        }
        if (res.mesMoSn) {
          setFieldsValue({
            qty: res.mesMoSn.qty,
            prodCode: res.basProduct.code + '[' + res.basProduct.version + ']',
            prodName: res.basProduct.name,
          });
        }
        if (res.basWorkflowStation) {
          setFieldsValue({
            title: res.basWorkflowStation.title,
          });
        }
        if (res.mesLwmsLot) {
          setFieldsValue({
            lwmsQty: res.mesLwmsLot.qty,
            lwmsBatch: res.mesLwmsLot.batchNo,
            lwmsCode: res.lwmsProduct.code + '[' + res.lwmsProduct.version + ']',
            lwmsName: res.lwmsProduct.name,
          });
        }
        document.getElementById('form_item_sn')?.focus();
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  function close() {
    emit('close');
  }
  // 过站
  async function doWoke() {
    emit('setModalProps', { confirmLoading: true });
    // await woke({
    //   sn: unref(sn),
    //   stationId: unref(workBenchData).scanInfo.stationId,
    //   actionCode: unref(workBenchData).actionId_dictText,
    //   wkpId: unref(workBenchData).workPostId,
    //   equipmentId: getFieldsValue().equipmentId,
    //   qty: getFieldsValue().wokeQty,
    //   scrapedQty: getFieldsValue().scrapedQty,
    //   startTime: getFieldsValue().startTime,
    //   completeTime: getFieldsValue().completeTime,
    //   operateBy: getFieldsValue().operator,
    // })
    //   .then((res) => {
    //     emit('success');
    //   })
    //   .catch((err) => {
    //     emit('setModalProps', { confirmLoading: false });
    //   });
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
