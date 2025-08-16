<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { splitFormSchema } from '../MesLwmsLot.data';
  import { splitLwmsSn } from '../MesLwmsLot.api';
import { defHttp } from '/@/utils/http/axios';
import { printJimuReport } from '/@/utils';
import { getToken } from '/@/utils/auth';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 130,
    schemas: splitFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log(data);
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '条码拆分' : '条码拆分'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      let res = await splitLwmsSn(values);
      let ids = res.ids;
      //console.log('ids', ids);
      defHttp.get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'lwms_lot_sn' } }).then((res) => {
        printJimuReport(res, { printAll: true, id: `${unref(ids).join(',')}` }, getToken(), false, () => {
          //关闭弹窗
          closeModal();
          //刷新列表s
          emit('success');
        });
      });
    } catch (e) {
      console.log(e);
    } finally {
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
</style>
