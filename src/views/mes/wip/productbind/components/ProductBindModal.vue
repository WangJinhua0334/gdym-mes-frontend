<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @cancel="handleCancel" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { bindFormSchema, scanFunc, wkpId, action } from '../ProductBind.data';
  import { scan, bind, bindReplace } from '../ProductBind.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const $message = useMessage();

  /**绑定ID：详情、替换时不为空 */
  const bindId = ref<string>('');
  const operateBy = ref<string>('');

  /**在制条码 */
  const sn = ref<string>('');
  /**工序 */
  const stationId = ref<string>('');
  /**动作代码 */
  const actionCode = ref<string>('');
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
    /**工位 */
    wkpId.value = data.wkpId;
    /**操作员 */
    operateBy.value = data.operateBy;

    if (unref(action) === 'bind') {
      prodId.value = data.record.prodId;
      sn.value = data.sn;
      stationId.value = data.stationId;
      actionCode.value = data.actionCode;
    } else {
      bindId.value = data.record.id;
      prodId.value = data.record.prodId;
      if (unref(action) === 'detail') {
        //表单赋值
        await setFieldsValue({
          sn: data.record.materialSn,
          batch: data.record.materialBatch,
          qty: data.record.qty,
          type: data.record.materialSnType,
          suppId: data.record.suppId,
          image: data.record.image,
          remark: data.record.remark,
        });
      }
    }

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

  /**绑定 */
  async function doBind(values) {
    values.prodId = unref(prodId);
    await bind({
      sn: unref(sn),
      stationId: unref(stationId),
      actionCode: unref(actionCode),
      wkpId: unref(wkpId),
      materialLotList: [values],
      remark: values.remark,
      isMove: 'N',
      operateBy: unref(operateBy),
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
    wkpId.value = null;
    action.value = null;

    closeModal();
  }

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      if (unref(action) === 'bind') {
        await doBind(values);
      } else if (unref(action) === 'bindReplace') {
        await doBindReplace(values);
      }

      scanFunc.value = null;
      wkpId.value = null;
      action.value = null;

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
