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
    title: '条码',
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
  {
    title: '动作',
    align: 'center',
    dataIndex: 'actionId_dictText',
    width: 100,
  },
  {
    title: '良品数量',
    align: 'center',
    sorter: true,
    dataIndex: 'okQty',
    width: 100,
  },
  {
    title: '报废数量',
    align: 'center',
    sorter: true,
    dataIndex: 'scrapedQty',
    width: 100,
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '报工人',
    align: 'center',
    sorter: true,
    dataIndex: 'wokeBy_dictText',
    width: 120,
  },
  {
    title: '报工时间',
    align: 'center',
    sorter: true,
    dataIndex: 'wokeTime',
    width: 120,
  },
  {
    title: '是否返工',
    align: 'center',
    dataIndex: 'isRework',
    slots: { customRender: 'switchSlot' },
    width: 100,
  },
];
//调试记录列表查询配置
export const listSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'mo',
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
    label: '条码',
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
    label: '是否返工',
    field: 'isRework',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    defaultValue: 'N',
    colProps: { span: 6 },
  },
];
