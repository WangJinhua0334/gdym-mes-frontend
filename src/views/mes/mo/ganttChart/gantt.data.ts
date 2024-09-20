import { FormSchema } from '/@/components/Table';

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '日期范围',
    field: 'dateRange',
    component: 'RangePicker',
    componentProps: {
      //日期格式化
      format: 'YYYY-MM-DD',
      //范围文本描述用集合
      placeholder: ['请选择开始日期', '请选择结束日期'],
      getPopupContainer: (node) => document.body,
    },
    colProps: { span: 6 },
  },
  {
    label: '工单',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  }
];
