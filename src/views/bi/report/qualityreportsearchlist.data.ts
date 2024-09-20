import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const qualityreportColumns: BasicColumn[] = [
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 120,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 200,
  },
  {
    title: '计划数量',
    align: 'center',
    dataIndex: 'qty',
    width: 80,
  },
  {
    title: '完工数量',
    align: 'center',
    dataIndex: 'workedQty',
    width: 80,
  },
  {
    title: '合格数量',
    align: 'center',
    dataIndex: 'completedQty',
    width: 80,
  },
  {
    title: '不合格数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 80,
  },
  {
    title: '合格率',
    align: 'center',
    dataIndex: 'completedRate',
    width: 80,
  },
];
//查询数据
export const qualityreportSearchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'code',
    component: 'JInput',
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
    label: '完工日期',
    field: 'dateRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD',
      // 设置不可选
      // disabledDate: (current) => {
      //   // 不可选择未来时间
      //   return current && current > Date.now() + 1;
      // },
      getPopupContainer: (node) => document.body,
    },
  },
];