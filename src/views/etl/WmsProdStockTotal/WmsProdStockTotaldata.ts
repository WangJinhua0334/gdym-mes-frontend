import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
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
    title: '数量',
    align: 'center',
    dataIndex: 'boxcount',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
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
];
