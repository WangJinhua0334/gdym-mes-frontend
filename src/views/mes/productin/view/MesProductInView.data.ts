import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { ref } from 'vue';
export const doEnterPress = ref();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '申请单号',
    field: 'code',
    component: 'Input',
  },

  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '计划入库时间',
    field: 'planInDate',
    component: 'DatePicker',
  },
  {
    label: '是否完成',
    field: 'isComplete',
    component: 'Switch',
  },
  {
    label: '完成时间',
    field: 'completeDate',
    component: 'DatePicker',
  },
  {
    label: '完成操作人',
    field: 'completeBy_dictText',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    width: 150,
    dataIndex: 'moId_dictText',
  },
  {
    title: '产品',
    align: 'center',
    width: 150,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    width: 300,
    dataIndex: 'prodName_dictText',
  },
  {
    title: '生产批次',
    align: 'center',
    width: 80,
    dataIndex: 'batch',
  },
  {
    title: '数量',
    align: 'center',
    width: 80,
    dataIndex: 'qty',
  },
  {
    title: '入库仓库',
    align: 'center',
    width: 80,
    dataIndex: 'whId_dictText',
  },
  {
    title: '状态',
    align: 'center',
    width: 80,
    dataIndex: 'status',
  },
  {
    title: '入库时间',
    align: 'center',
    width: 80,
    dataIndex: 'actualInDate',
  },
  {
    title: '入库操作人',
    align: 'center',
    width: 80,
    dataIndex: 'actualInBy_dictText',
  },
  {
    title: 'ERP行号',
    align: 'center',
    width: 80,
    dataIndex: 'erpLineNo',
  },
];
