import dayjs from 'dayjs';
import { FormSchema } from '/@/components/Table';
import { dateUtil } from '/@/utils/dateUtil';

export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '生产任务',
    field: 'moPlanCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工序',
    field: 'title',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '加工物料',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '开工时间',
    field: 'startTime',
    defaultValue: dayjs().subtract(0, 'day'),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      disabled: true,
    },
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请输入开工时间!' }];
    // },
  },
  {
    label: '完工时间',
    field: 'completeTime',
    defaultValue: dayjs().subtract(0, 'day'),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      disabled: true,
    },
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请输入完工时间!' }];
    // },
  },
  {
    label: '操作员',
    field: 'operator',
    component: 'JSelectUser',
    componentProps: {
      disabled: true,
    },
    // component: 'JSelectUser',
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请选择操作员!' }];
    // },
  },
];
