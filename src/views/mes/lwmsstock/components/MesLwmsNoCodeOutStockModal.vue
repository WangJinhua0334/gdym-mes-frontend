<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
    <BasicForm @register="registerForm" @submit="basicFormSubmit" />
    <JVxeTable
      keep-source
      resizable
      ref="noCodeOutStockBinding"
      :loading="noCodeOutStockTable.loading"
      :columns="noCodeOutStockTable.columns"
      :dataSource="noCodeOutStockTable.dataSource"
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
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaMesLwmsNoCodeOutStockModal, noCodeOutStockTableJVxeColumns, noCodePutStockTableJVxeColumns } from '../MesLwmsStock.data';
  import {
    outNoCodeStock,queryStockByMoCodeInStock,
    saveOrUpdate
  } from '../MesLwmsStock.api';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import {message} from "ant-design-vue";
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const whId = ref<string | null>(null);
  const noCodeOutStockBinding = ref<any>(null);
  const formDisabled = ref(false);
  const noCodeOutStockTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
  }>({
    loading: false,
    dataSource: [],
    columns: noCodeOutStockTableJVxeColumns,
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchemaMesLwmsNoCodeOutStockModal,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: !!data?.showFooter,
      showOkBtn: !!data?.showFooter,
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
  });
  //设置标题
  const title = computed(() => '工单批量出库');
  const handleDelete = (row) => {
    //console.log("row.rowId",row.rowId)
    noCodeOutStockBinding?.value?.removeRows(row.row);
  };

  const basicFormSubmit = async (values) => {
    noCodeOutStockBinding?.value?.removeRowsById(noCodeOutStockBinding?.value?.getTableData()?.map(row=>row.lwmsSn));

    let res = await queryStockByMoCodeInStock(values.moCode);
    if (!res ||res.length == 0){
      message.error("此工单下未查询到可出库的条码信息")
    }
    const v = res.map((_) => ({
      id: _.lwmsSn,
      moId: _.moId,
      prodCode: _.prodIdCode_dictText,
      prodName: _.prodId_dictText,
      lwmsSn: _.lwmsSn,
      qty:_.qty,
      whBinId_dictText:_.whBinId_dictText,
      outQty:0,
    }));
    noCodeOutStockBinding?.value?.addRows(v);
  };

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let formValues = await validate();
      setModalProps({ confirmLoading: true });
      let validateTable = await noCodeOutStockBinding?.value?.validateTable();
      if (validateTable != null){
        setModalProps({ confirmLoading: false });
        return;
      }
      const values = noCodeOutStockBinding?.value?.getTableData();
      //提交表单
      await outNoCodeStock({ outStockBy:formValues.outStockBy, useBy:formValues.useBy, outStocks:values });
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

  :deep(.ant-select-tree-node-content-wrapper) {
    color: #000000 !important;
  }
</style>
