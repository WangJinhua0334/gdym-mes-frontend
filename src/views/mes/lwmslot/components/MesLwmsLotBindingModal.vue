<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit" @cancel="closeModal">
    <BasicForm @register="registerForm" @submit="basicFormSubmit" />
    <div>
      <JVxeTable
        keep-source
        resizable
        ref="lwmsLotBinding"
        :loading="lwmsLotBindingTable.loading"
        :columns="lwmsLotBindingTable.columns"
        :dataSource="lwmsLotBindingTable.dataSource"
        :editConfig="lwmsLotBindingTable.editConfig"
        :height="340"
        :disabled="formDisabled"
        :rowNumber="true"
        :rowSelection="false"
        :toolbar="false"
      >
        <!-- 定义插槽 -->
        <template #action="props">
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗？" @confirm="handleDelete(props)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </JVxeTable>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, lwmsLotBindingJVxeColumns } from '../MesLwmsLot.data';
  import { binding, generateBatchNo, saveOrUpdate } from '../MesLwmsLot.api';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { message } from 'ant-design-vue';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const lwmsLotBinding = ref<any>(null);
  const isUpdate = ref(true);
  const batchNo = ref('');
  const formDisabled = ref(false);
  const lwmsLotBindingTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
    editConfig: any;
  }>({
    loading: false,
    dataSource: [],
    columns: lwmsLotBindingJVxeColumns,
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      activeMethod: ({ row, column }) => {
        if (column.property === 'qty') {
          if (!row.hasEditQty) {
            return false;
          }
        }
        return true;
      },
    },
  });

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    // await resetFields();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: !!data?.showFooter,
      showOkBtn: !!data?.showFooter,
      maskClosable: false,
    });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
    generateBatchNo().then((res: any) => {
      setFieldsValue({ batchNo: res });
      batchNo.value = res;
    });
  });
  //设置标题
  const title = computed(() => '物料条码绑定');

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = lwmsLotBinding?.value?.getTableData();
      if (!values || values.length == 0) {
        message.error('请先扫描绑定物料条码');
        return;
      }
      let validateTable = await lwmsLotBinding?.value?.validateTable();
      if (validateTable != null) {
        return;
      }
      await binding({ mesLwmsLots: values });
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  const basicFormSubmit = (values) => {
    const tableDataValues = lwmsLotBinding?.value?.getTableData();
    let snIndex = tableDataValues.findIndex((_) => _.lwmsSn === values.lwmsSn);
    const v = { ...values, id: values.lwmsSn };
    if (snIndex === -1) {
      lwmsLotBinding?.value?.addRows(v);
    }
    lwmsLotBinding?.value?.setValues([{ rowKey: v.id, values }]);
    //resetFields().then(() => {
    setFieldsValue({ batchNo: batchNo.value });
    //});
  };

  const handleDelete = (row) => {
    console.log('row', row);
    lwmsLotBinding?.value?.removeRowsById(row.rowId);
  };
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
