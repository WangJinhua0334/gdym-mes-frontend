import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品条码',
    align: 'center',
    dataIndex: 'qr',
  },
  {
    title: '产品型号',
    align: 'center',
    dataIndex: 'partno',
  },
  {
    title: '客户',
    align: 'center',
    dataIndex: 'customer',
  },
  {
    title: '库位',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '地址码',
    align: 'center',
    dataIndex: 'address',
  },
  {
    title: '批次号',
    align: 'center',
    dataIndex: 'lotno',
  },
  {
    title: '箱号',
    align: 'center',
    dataIndex: 'boxno',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'boxcount',
  },
  {
    title: 'tqr',
    align: 'center',
    dataIndex: 'tqr',
  },
  {
    title: '入库时间',
    align: 'center',
    dataIndex: 'scandate',
  },
  {
    title: '班组',
    align: 'center',
    dataIndex: 'banzu',
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'username',
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
    label: '产品条码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'qr',
  },
  {
    label: '产品型号',
    component: 'Input',
    colProps: { span: 6 },
    field: 'partno',
  },
  {
    label: '客户',
    component: 'Input',
    colProps: { span: 6 },
    field: 'customer',
  },
  {
    label: '库位',
    component: 'Input',
    colProps: { span: 6 },
    field: 'location',
  },
  {
    label: '地址码',
    component: 'Input',
    colProps: { span: 6 },
    field: 'address',
  },
  {
    label: '批次号',
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
    label: '数量',
    component: 'Input',
    colProps: { span: 6 },
    field: 'boxcount',
  },
  {
    label: 'tqr',
    component: 'Input',
    colProps: { span: 6 },
    field: 'tqr',
  },
  {
    label: '班组',
    component: 'Input',
    colProps: { span: 6 },
    field: 'banzu',
  },
  {
    label: '操作人',
    component: 'Input',
    colProps: { span: 6 },
    field: 'username',
  },
];
