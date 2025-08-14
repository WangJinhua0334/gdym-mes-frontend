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
  import { upFormSchema, doEnterPress } from './MesMoPack.data';
  import { scranPack, pack } from './MesMoPack.api';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  /**
   * 监听SN回车事件
   */
  watch(
    () => doEnterPress.value,
    () => {
      if (doEnterPress.value) {
        scanSN(unref(getFieldsValue()).sn);
      }
    },
    { immediate: false, deep: true }
  );
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: upFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  onMounted(() => {
    setTimeout(() => {
      if (props.componentData && unref(props.componentData.record.scanInfo).sn) {
        scanSN(unref(props.componentData.record.scanInfo).sn);
      }
    }, 100);
  });
  // 查询数据
  async function scanSN(sn) {
    emit('setModalProps', { confirmLoading: true });
    scranPack({
      sn: sn,
    })
      .then((res) => {
        if (res.lotSn) {
          setFieldsValue({
            ...res,
            wkpId: props.componentData?.record?.workPostId,
            workPostName: props.componentData?.record?.workPostName,
          });
        }
        document.getElementById('form_item_sn')?.focus();
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
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
  // 包装
  async function doPack() {
    let values = await validate();
    values.wkpId = props.componentData?.record?.workPostId;
    emit('setModalProps', { confirmLoading: true });
    //提交表单
    await pack(values).then((res) => {
      if (!unref(res)) {
        return;
      }
      console.log(res);
      const ids = Object.keys(res);
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: ids.join(','), type: 'pack_sn' },
        })
        .then(async (reportRs) => {
          // 打印数据集 { reportId, parameters }
          const printSet: any = {};

          const templateIds = Object.keys(reportRs);
          for (const templateId of templateIds) {
            const reportId = reportRs[templateId];
            printSet[reportId] = { id: `${res[templateId].join(',')}` };
          }
          loopPrintJimuReport(printSet, getToken, () => {
            //设置非加载中
            emit('setModalProps', { confirmLoading: false });
            //刷新列表
            emit('success');
          });
        });
    });
  }

  async function submit() {
    await validate();
    try {
      emit('setModalProps', { confirmLoading: true });
      await doPack();
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
