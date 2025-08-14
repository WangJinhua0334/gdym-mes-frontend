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
  import { formSchema, scanSn } from '../MesWkpMo.data';
  import { queryByWkpId, changeMo, getScan } from '../MesWkpMo.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  //提示弹窗
  const $message = useMessage();
  //调用ts页面的方法
  scanSn.value = (sn) => {
    scranLotSn(sn);
  };
  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
    wkpId: {
      type: String,
      default: '',
    },
  });
  //表单配置
  const [registerForm, { setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  onMounted(() => {
    setTimeout(() => {
      if (props.componentData?.record?.workPostId != '' && props.componentData?.record?.workPostId != null) {
        scan(props.componentData?.record?.workPostId);
      } else {
        scan(props.wkpId);
      }
      if (props.componentData && unref(props.componentData.record.scanInfo).sn) {
        scranLotSn(unref(props.componentData.record.scanInfo).sn);
      }
    }, 100);
  });
  // 查询工位工单信息
  async function scan(wkpId) {
    emit('setModalProps', { confirmLoading: true });
    queryByWkpId({
      wkpId: wkpId,
    })
      .then((res) => {
        if (res?.wkpId) {
          setFieldsValue({
            ...res,
          });
        } else {
          setFieldsValue({
            wkpId: props.componentData?.record?.workPostId,
            wkpCode: props.componentData?.record?.workPostCode,
            wkpName: props.componentData?.record?.workPostName,
          });
        }
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('close');
        emit('setModalProps', { confirmLoading: false });
      });
  }
  //扫描流转卡事件
  async function scranLotSn(sn: any) {
    try {
      emit('setModalProps', { confirmLoading: true });
      //查询表单
      await getScan({ sn: sn }).then((data) => {
        if (data) {
          setFieldsValue({
            snId: data?.moSnId,
            moId: data?.moId,
          });
        }
      });
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  function close() {
    emit('close');
  }
  // 修改工位工单
  async function doWoke() {
    try {
      let values = await validate();
      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await changeMo(values);
      close();
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
