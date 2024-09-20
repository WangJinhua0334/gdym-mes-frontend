<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'分配流转卡'" @ok="handleSubmit" :width="896">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getCreateSnData, createSn } from '../MesMo.api';
  import { formSchema } from './MesMoCreateSn.data';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: true, showCancelBtn: true, showOkBtn: true, defaultFullscreen: false });

    try {
      await getCreateSnData({ id: data.record.id }).then((res) => {
        setFieldsValue({ ...res });
      });
    } catch (error) {
      closeModal();
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  });

  async function reset() {
    await resetFields();
  }

  //表单提交事件
  async function handleSubmit(v) {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      let values = await validate();

      await createSn(values).then((res) => {
        /*
        if (!unref(res)) {
          return;
        }

        const ids = Object.keys(res);

        defHttp
          .get({
            url: '/template/basTemplate/getReportIdByIds',
            params: { ids: ids.join(','), type: 'mo_sn' },
          })
          .then(async (reportRs) => {
            // 打印数据集 { reportId, parameters }
            const printSet: any = {};

            const templateIds = Object.keys(reportRs);
            for (const templateId of templateIds) {
              const reportId = reportRs[templateId];
              printSet[reportId] = { id: `'${res[templateId].join("','")}'` };
            }

            loopPrintJimuReport(printSet, getToken, () => {
              //设置非加载中
              setModalProps({ confirmLoading: false });
              //打印提示
              $message.createMessage.success('打印成功!');
              //关闭弹窗
              closeModal();
              //刷新列表
              emit('success', res);
            });
          });*/
        closeModal();
        emit('success', res);
        setModalProps({ confirmLoading: false });
      });
    } catch (error) {
      console.log(error);
      setModalProps({ confirmLoading: false });
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

  :deep(.ant-picker) {
    width: 100%;
  }
</style>
