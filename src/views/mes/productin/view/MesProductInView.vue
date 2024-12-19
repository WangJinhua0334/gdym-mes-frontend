<template>
  <BasicModal v-bind="$attrs" @register="registerViewModal" destroyOnClose :title="'入库申请详情'" :cancelText="'关闭'" :width="800">
    <BasicForm @register="registerViewForm" ref="formRef" />
    <!-- 子表单区域 -->
    <!--引用表格-->
    <BasicTable @register="registerViewTableSn" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { formSchema, columns } from './MesProductInView.data';
  import { list } from './MesProductInView.api';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useModal } from '/@/components/Modal';

  //表单配置
  const [registerViewForm, { setProps, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '',
      api: (params) => {
        params['inId'] = getFieldsValue().id;
        return list(params);
      },
      columns,
      canResize: false,
      immediate: false,
      showTableSetting: false,
      useSearchForm: false,
      showActionColumn: false,
      pagination: true,
    },
  });
  const [registerViewTableSn, { reload }] = tableContext;

  //表单赋值
  const [registerViewModal, { setModalProps }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: false, defaultFullscreen: true });
    await setFieldsValue({ ...data.record });
    setProps({ disabled: true });
    reload();
  });
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
