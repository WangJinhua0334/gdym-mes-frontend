import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

//调试记录列表配置
export const listColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 120,
  },
  {
    title: '生产任务',
    align: 'center',
    sorter: true,
    dataIndex: 'moPlanId_dictText',
    width: 120,
  },
  {
    title: '流转卡号',
    align: 'center',
    sorter: true,
    dataIndex: 'lotSn',
    width: 120,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
  },
  // {
  //   title: '动作',
  //   align: 'center',
  //   dataIndex: 'actionId_dictText',
  //   width: 100,
  // },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
    width: 100,
  },
  {
    title: '作业员',
    align: 'center',
    sorter: true,
    dataIndex: 'operateBy_dictText',
    width: 120,
  },
  {
    title: '标准工时',
    align: 'center',
    sorter: true,
    dataIndex: 'standardHours',
    width: 100,
  },
  {
    title: '工作日加班工时',
    align: 'center',
    sorter: true,
    dataIndex: 'workHours',
    width: 150,
  },
  {
    title: '休息日加班工时',
    align: 'center',
    sorter: true,
    dataIndex: 'restHours',
    width: 150,
  },
  {
    title: '节假日加班工时',
    align: 'center',
    sorter: true,
    dataIndex: 'holidaysHours',
    width: 150,
  },
  {
    title: '实际工时',
    align: 'center',
    sorter: true,
    dataIndex: 'actualHours',
    width: 150,
  },
  {
    title: '提交人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 120,
  },
  {
    title: '提交时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: '审核人',
    align: 'center',
    dataIndex: 'examineBy',
    width: 120,
  },
  {
    title: '审核时间',
    align: 'center',
    dataIndex: 'examineTime',
    width: 120,
  },
];
//调试记录列表查询配置
export const listSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlan',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工序',
    field: 'station',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '作业员',
    field: 'operateByQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工单',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '任务单号',
    field: 'moPlanId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '工序',
    field: 'wfsId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '作业员',
    field: 'operateBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '标准工时',
    field: 'standardHours',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 12 },
  },
  {
    label: '工作日加班',
    field: 'workHours',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 12 },
  },
  {
    label: '休息日加班',
    field: 'restHours',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 12 },
  },
  {
    label: '节假日加班',
    field: 'holidaysHours',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 12 },
  },
  {
    label: '提交人',
    field: 'createBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '提交时间',
    field: 'createTime',
    component: 'Input',
    colProps: { span: 12 },
  },
];
