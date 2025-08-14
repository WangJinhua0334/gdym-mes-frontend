import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料条码',
    align: 'center',
    dataIndex: 'qr',
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prid',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'des',
  },
  {
    title: '地址码',
    align: 'center',
    dataIndex: 'address',
  },
  {
    title: '供应商编码',
    align: 'center',
    dataIndex: 'suplierno',
  },
  {
    title: '供应商名称',
    align: 'center',
    dataIndex: 'supliername',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'boxcount',
  },
  {
    title: '价格',
    align: 'center',
    dataIndex: 'taxprice',
  },
  {
    title: '小计',
    align: 'center',
    dataIndex: 'totalprice',
  },
  {
    title: '批次',
    align: 'center',
    dataIndex: 'lotno',
  },
  {
    title: '箱号',
    align: 'center',
    dataIndex: 'boxno',
  },
  {
    title: '到货时间',
    align: 'center',
    dataIndex: 'indate',
  },
  {
    title: '生产时间',
    align: 'center',
    dataIndex: 'productdate',
  },
  {
    title: '有效期',
    align: 'center',
    dataIndex: 'missdate',
  },
  {
    title: '入库时间',
    align: 'center',
    dataIndex: 'scandate',
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'username',
  },
  {
    title: '库位',
    align: 'center',
    dataIndex: 'location',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '入库时间',
    field: 'scandate',
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')],
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD',
      getPopupContainer: () => document.body,
    },
    colProps: { span: 6 },
  },
  {
    label: '物料条码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'qr',
  },
  {
    label: '物料编码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'prid',
  },
  {
    label: '描述',
    component: 'Input',
    colProps: { span: 6 },
    field: 'des',
  },
  {
    label: '地址码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'address',
  },
  {
    label: '供应商编码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'suplierno',
  },
  {
    label: '供应商名称',
    component: 'Input',
    colProps: { span: 6 },
    field: 'supliername',
  },
  {
    label: '数量',
    component: 'Input',
    colProps: { span: 6 },
    field: 'boxcount',
  },
  {
    label: '批次',
    component: 'Input',
    colProps: { span: 6 },
    field: 'lotno',
  },
  {
    label: '箱号',
    component: 'Input',
    colProps: { span: 6 },
    field: 'boxno',
  },
  {
    label: '操作人',
    component: 'Input',
    colProps: { span: 6 },
    field: 'username',
  },
  {
    label: '库位',
    component: 'Input',
    colProps: { span: 6 },
    field: 'location',
  },
];
