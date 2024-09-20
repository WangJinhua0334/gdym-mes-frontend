<template>
  <BasicModal v-bind="$attrs" @register="registerViewModal" destroyOnClose :title="'入库申请详情'" :cancelText="'关闭'" :width="800">
    <BasicForm @register="registerViewForm" ref="formRef" />
    <!-- 子表单区域 -->
    <!--引用表格-->
    <BasicTable @register="registerViewTableSn">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>


    <MesProductInViewSnListModal @register="registerSnListViewModal" ></MesProductInViewSnListModal>


</template>

<script lang="ts" setup>
import { BasicModal, useModalInner } from '/@/components/Modal';
import { JVxeTable } from '/@/components/jeecg/JVxeTable';
import MesProductInAdd from './add/MesProductInAdd.vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { formSchema, doEnterPress, columns } from './MesProductInView.data';
import { list } from './MesProductInView.api';
import { BasicForm, useForm } from '/@/components/Form/index';
    import MesProductInViewSnListModal from './snitem/MesProductInSnListView.vue'
  import {useModal} from '/@/components/Modal';
  const [registerSnListViewModal, {openModal:openSnListViewModal}] = useModal();

//表单配置
const [registerViewForm, { setProps, resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] = useForm({
  labelWidth: 150,
  schemas: formSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 12 },
});
//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
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
    showActionColumn: true,
    pagination: true,
    actionColumn: {
      width: 80,
      fixed: 'right',
    },
  },
});
const [registerViewTableSn, { setTableData,reload }, { rowSelection, selectedRowKeys }] = tableContext;


//表单赋值
const [registerViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: false,defaultFullscreen:true });
  await setFieldsValue({...data.record})
  setProps({disabled:true})
  reload();

});
/**
 * 删除事件
 */
function handleDetail(record) {
  //   let arr = unref(snList).filter((s) => s.lotSn != record.lotSn);
  //   snList.value = arr;
  //   setTableData(unref(snList));
     openSnListViewModal(true, {
       record,
       isUpdate: true,
       showFooter: false,
     });
  
}

/**
 * 操作栏
 */
function getTableAction(record) {
  return [
    {
      label: '条码',
      onClick: handleDetail.bind(null, record),
    },
  ];
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