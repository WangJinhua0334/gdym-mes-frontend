import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

//SN列表信息列表配置
export const retraceListColumns: BasicColumn[] = [
  {
    title: '流转卡号',
    align: 'center',
    sorter: true,
    dataIndex: 'moSn',
    width: 130,
  },
  {
    title: '条码',
    align: 'center',
    sorter: true,
    dataIndex: 'sn',
    width: 130,
  },
  {
    title: '产品',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 120,
  },
  {
    title: '产品名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
    width: 150,
  },
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 130,
  },
  // {
  //   title: '生产任务',
  //   align: 'center',
  //   sorter: true,
  //   dataIndex: 'moPlanId_dictText',
  //   width: 130,
  // },
  {
    title: '当前工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
  },
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status_dictText',
    width: 100,
  },
  {
    title: '生产批次',
    align: 'center',
    dataIndex: 'batch',
    width: 120,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 100,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 100,
  },
  // {
  //   title: '投产人',
  //   align: 'center',
  //   dataIndex: 'inputBy_dictText',
  //   width: 120,
  // },
  // {
  //   title: '投产时间',
  //   align: 'center',
  //   sorter: true,
  //   dataIndex: 'inputTime',
  //   width: 150,
  // },
  // {
  //   title: '完工人',
  //   align: 'center',
  //   dataIndex: 'completeBy_dictText',
  //   width: 120,
  // },
  // {
  //   title: '完工时间',
  //   align: 'center',
  //   sorter: true,
  //   dataIndex: 'completeTime',
  //   width: 150,
  // },
  // {
  //   title: '备注',
  //   align: 'center',
  //   dataIndex: 'remark',
  //   width: 150,
  // },
  {
    title: '',
    dataIndex: 'id',
    ifShow: false,
  },
];
//sn记录列表查询配置
export const retraceListSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'mo',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   label: '生产任务',
  //   field: 'moPlan',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  {
    label: '条码',
    field: 'lotSn',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品编码',
    field: 'prodCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品名称',
    field: 'prodName',
    component: 'Input',
    colProps: { span: 6 },
  },
];

//子表列表数据
export const retraceItemColumns: BasicColumn[] = [
  {
    title: '',
    dataIndex: 'lotId',
    ifShow: false,
  },
  {
    title: '',
    dataIndex: 'stationId',
    ifShow: false,
  },
  {
    title: '',
    dataIndex: 'wfsId',
    ifShow: false,
  },
  {
    title: '',
    dataIndex: 'lotSn',
    ifShow: false,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'stationName',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '合格数量',
    align: 'center',
    dataIndex: 'okQty',
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'ngQty',
  },
  {
    title: '实际工时',
    align: 'center',
    dataIndex: 'workHour',
  },
];
