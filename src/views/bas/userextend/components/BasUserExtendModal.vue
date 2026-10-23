<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="title"
    :width="900"
    wrapClassName="bas-user-extend-modal"
    @ok="handleSubmit"
  >
    <div class="form-content">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../BasUserExtend.data';
  import { saveOrUpdate } from '../BasUserExtend.api';
  import { defHttp } from '@/utils/http/axios';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: !!data?.showFooter,
      showOkBtn: !!data?.showFooter,
      height: Math.max(180, Math.min(620, window.innerHeight - 220)),
    });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      if (data.record?.wareHouseId) {
        try {
          const warehouse = await defHttp.get({
            url: '/basic/wareHouse/queryById',
            params: { id: data.record.wareHouseId },
          });
          const isOpenLocation = warehouse?.isOpenLocation ?? warehouse?.result?.isOpenLocation;
          await setFieldsValue({
            warehouseIsOpenLocation: isOpenLocation,
            ...(isOpenLocation === 'Y' ? {} : { defaultLocationId: null }),
          });
        } catch {
          await setFieldsValue({ warehouseIsOpenLocation: null, defaultLocationId: null });
        }
      }
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      const payload = { ...values };
      delete payload.warehouseIsOpenLocation;
      await saveOrUpdate(payload, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .form-content {
    padding: 16px 30px 0;
  }

  :deep(.bas-user-extend-modal .ant-modal) {
    max-width: calc(100vw - 32px);
  }

  :deep(.form-content .ant-form-item) {
    margin-bottom: 10px;
  }

  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
