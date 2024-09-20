import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const mostationtaskColumns: BasicColumn[] = [
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
    title: '流转卡号',
    align: 'center',
    dataIndex: 'moSn',
    width: 160,
  },
  {
    title: '流转卡类型',
    align: 'center',
    dataIndex: 'moSnType_dictText',
    width: 160,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 160,
  },
  // {
  //   title: '工作中心',
  //   align: 'center',
  //   dataIndex: 'wkcIds_dictText',
  //   width: 160,
  // },
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
    width: 160,
  },
  {
    title: '生产状态',
    align: 'center',
    dataIndex: 'status_dictText',
    width: 120,
  },
  {
    title: '当前执行工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
  },
  {
    title: '工序执行状况',
    align: 'center',
    dataIndex: 'pathWfsId_dictText',
    width: 120,
  },
  {
    title: '计划数量',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
  },
  {
    title: '已完工数量',
    align: 'center',
    dataIndex: 'completeQty',
    width: 120,
  },
  // {
  //   title: '合格数量',
  //   align: 'center',
  //   dataIndex: 'okQty',
  //   width: 120,
  // },
  {
    title: '不合格数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 120,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '计划开始日期',
    align: 'center',
    dataIndex: 'planStartTime',
    width: 150,
  },
  {
    title: '计划结束日期',
    align: 'center',
    dataIndex: 'planCompleteTime',
    width: 150,
  },
  // {
  //   title: '任务异常次数',
  //   align: 'center',
  //   dataIndex: 'taskAbnormalCount',
  //   width: 120,
  // },
];
//查询数据
export const mostationtaskSearchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '任务单号',
    field: 'moPlanCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'moSn',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编码或名称',
    },
    colProps: { span: 6 },
  },
];