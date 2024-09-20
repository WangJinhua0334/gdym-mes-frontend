import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const workpostoccupancyColumns: BasicColumn[] = [
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'wksId_dictText',
    width: 160,
  },
  // {
  //   title: '工作中心',
  //   align: 'center',
  //   dataIndex: 'wkcId_dictText',
  //   width: 160,
  // },
  {
    title: '工位',
    align: 'center',
    dataIndex: 'workPostName',
    width: 120,
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'moSn',
    width: 400,
  },
  {
    title: '当前执行工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 160,
  },
  {
    title: '工位饱和度',
    align: 'center',
    dataIndex: 'workPostSaturation',
    width: 160,
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
  // {
  //   title: '任务异常次数',
  //   align: 'center',
  //   dataIndex: 'taskAbnormalCount',
  //   width: 120,
  // },
];
//查询数据
export const workpostoccupancySearchFormSchema: FormSchema[] = [
  {
    label: '工位',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
];