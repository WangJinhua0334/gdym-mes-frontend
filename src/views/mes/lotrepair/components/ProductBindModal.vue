<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @cancel="handleCancel" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { bindFormSchema, scanFunc, wkpId, action } from '../RepairModal.data';
  import { scan, bindReplace } from '../RepairModal.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const $message = useMessage();

  /**绑定ID：详情、替换时不为空 */
  const bindId = ref<string>('');
  const operateBy = ref<string>('');

  /**物料ID */
  const prodId = ref<string>('');

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: bindFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    const disabled = data.action === 'detail';

    setModalProps({ confirmLoading: false, showCancelBtn: true, cancelText: '返回', showOkBtn: !unref(disabled), okText: '确定' });
    /**操作类型：详情、替换、手动录入 */
    action.value = data.action;
    /**扫描方法 */
    scanFunc.value = doScan;
    wkpId.value = data.wkpId;
    operateBy.value = data.operateBy;
    bindId.value = data.record.id;
    prodId.value = data.record.prodId;

    // 隐藏底部时禁用整个表单
    setProps({ disabled: unref(disabled) });
  });

  //设置标题
  const title = computed(() => (unref(action) === 'bind' ? '手动录入' : unref(action) === 'bindReplace' ? '替换' : '详情'));

  /**扫描 */
  function doScan(materialSn) {
    scan({ materialSn: materialSn }).then((res) => {
      if (res.prodId != unref(prodId)) {
        $message.createMessage.warning('物料条码非当前操作物料，请重新扫描！');
        return;
      } else {
        setFieldsValue({
          sn: res.sn,
          batch: res.batch,
          qty: res.qty,
          type: res.type,
          suppId: res.suppId,
        });
      }
    });
  }
  /**替换 */
  async function doBindReplace(values) {
    await bindReplace({
      bindId: unref(bindId),
      materialLot: values,
      reason: values.reason,
      operateBy: unref(operateBy),
    });
  }

  function handleCancel() {
    scanFunc.value = null;
    closeModal();
  }

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      await doBindReplace(values);

      scanFunc.value = null;

      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } catch {
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
