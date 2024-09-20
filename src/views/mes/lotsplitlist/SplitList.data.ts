import { BasicColumn, FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '新在制条码',
    sorter: true,
    align: 'center',
    dataIndex: 'newLotId_dictText',
    fixed: true,
    width: 160,
  },
  {
    title: '原在制条码',
    sorter: true,
    align: 'center',
    dataIndex: 'oldLotId_dictText',
    fixed: true,
    width: 160,
  },
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '任务单号',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
    width: 160,
  },
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 300,
  },
  {
    title: '拆分数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: '拆分时工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  {
    title: '拆分人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 120,
  },
  {
    title: '拆分时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'moCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '新在制条码',
    field: 'lotSnQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];
