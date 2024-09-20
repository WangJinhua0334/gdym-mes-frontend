import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const productionColumns: BasicColumn[] = [
  {
    title: '流转卡号',
    sorter: true,
    align: 'center',
    dataIndex: 'sn',
    fixed: true,
    width: 160,
  },
  {
    title: '流转卡类型',
    align: 'center',
    dataIndex: 'snType_dictText',
    width: 140,
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
    width: 160,
  },
  {
    title: '记录批次唯一码',
    align: 'center',
    dataIndex: 'isUniqSn_dictText',
    width: 120,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '是否投产',
    align: 'center',
    dataIndex: 'isInput_dictText',
    width: 120,
  },
  {
    title: '投产人',
    align: 'center',
    dataIndex: 'inputBy_dictText',
    width: 120,
  },
  {
    title: '投产时间',
    align: 'center',
    dataIndex: 'inputTime',
    width: 120,
  },
  {
    title: '是否报废',
    align: 'center',
    dataIndex: 'isScrap_dictText',
    width: 120,
  },
  {
    title: '报废人',
    align: 'center',
    dataIndex: 'scrapBy_dictText',
    width: 100,
  },
  {
    title: '报废时间',
    align: 'center',
    dataIndex: 'scrapTime',
    width: 150,
  },
];
//查询数据
export const productionSearchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'code',
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
  {
    label: '流转卡',
    field: 'sn',
    component: 'JInput',
    componentProps: {
      dictCode: 'mo_type',
    },
    colProps: { span: 6 },
  },
];