<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1500" @ok="handleSubmit">
    <BasicForm @register="registerForm" @submit="basicFormSubmit" />
    <JVxeTable
      keep-source
      resizable
      ref="noCodePutStockBinding"
      :loading="noCodePutStockTable.loading"
      :columns="noCodePutStockTable.columns"
      :dataSource="noCodePutStockTable.dataSource"
      :editConfig="noCodePutStockTable.editConfig"
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
  import { formSchemaMesLwmsNoCodePutStockModal, noCodePutStockTableJVxeColumns } from '../MesLwmsStock.data';
  import {
    putNoCodeStock,queryStockByMoCodeNoStock,
  } from '../MesLwmsStock.api';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { lwmsLotGenerateJVxeColumns } from '/@/views/mes/lwmslot/MesLwmsLot.data';
  import {message} from "ant-design-vue";
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const whId = ref<string | null>(null);
  const noCodePutStockBinding = ref<any>(null);
  const formDisabled = ref(false);
  const noCodePutStockTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
    editConfig:any;
  }>({
    loading: false,
    dataSource: [],
    columns: noCodePutStockTableJVxeColumns,
    editConfig:{
      trigger:'click',
      mode:'cell',
      activeMethod:({row,column}) =>{
        if (column.property === 'whBinId'){
          if (row.hasWhBinId){
            return false;
          }
        }
        return true;

      }
    }
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchemaMesLwmsNoCodePutStockModal,
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
  const title = computed(() => '工单批量入库');

  const handleDelete = (row) => {
    console.log('row', row);
    noCodePutStockBinding?.value?.removeRowsById(row.rowId);
  };

  const basicFormSubmit = async (values) => {
    noCodePutStockBinding?.value?.removeRowsById(noCodePutStockBinding?.value?.getTableData()?.map(row=>row.lwmsSn));

    let res = await queryStockByMoCodeNoStock(values.moCode);
    if (!res ||res.length == 0){
      message.error("此工单下未查询到绑定的条码信息")
    }
    const v = res.map((_) => ({
      id: _.lwmsSn,
      moId:_.moId,
      prodId:_.prodId,
      prodCode: _.prodIdCode_dictText,
      prodName: _.prodId_dictText,
      lwmsSn: _.lwmsSn,
      whBinId:_.whBinId,
      hasWhBinId:!!_.whBinId,
      whBinId_dictText:_.whBinId_dictText,
      qty:_.qty
    }));
    noCodePutStockBinding?.value?.addRows(v);
  };

  //表单提交事件
  async function handleSubmit(v) {
    try {
      let formValues = await validate();
      setModalProps({ confirmLoading: true });
      let validateTable = await noCodePutStockBinding?.value?.validateTable();
      if (validateTable != null){
        setModalProps({ confirmLoading: false });
        return;
      }
      const values = noCodePutStockBinding?.value?.getTableData();
      //提交表单
      await putNoCodeStock({ warehousingBy:formValues.warehousingBy, mesLwmsStocks:values });
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
