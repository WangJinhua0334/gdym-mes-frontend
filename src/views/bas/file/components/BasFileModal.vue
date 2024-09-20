<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, fileName, clickTime } from '../BasFile.data';
  import { saveOrUpdate, getFileVersion } from '../BasFile.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  let fileID = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      fileID.value = data.record.id;
      //表单赋值
      await setFieldsValue({
        ...data.record,
        version: data.record.version.replace('V', '').replace('v', '') * 1,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  /**上传文件变更 */
  watch(
    () => unref(clickTime),
    async () => {
      const params = {};
      params['name'] = fileName.value;
      params['id'] = fileID.value;
      await getFileVersion(params).then((res) => {
        if (res) {
          let version = res.version;
          setFieldsValue({ version: version.replace('V', '').replace('v', '') * 1 + 1 });
        }
      });
    },
    { immediate: false, deep: true }
  );
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '上传文件' : '编辑'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      values.version = 'V' + ((values.version + '').includes('.') ? values.version : values.version + '.0');
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
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
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
