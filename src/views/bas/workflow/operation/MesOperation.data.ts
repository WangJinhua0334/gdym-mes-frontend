import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '工序号',
    align: 'center',
    dataIndex: 'operationNumber',
    width: 160,
  },
  {
    title: '工序名称',
    align: 'center',
    dataIndex: 'operationName',
    width: 200,
  },
  {
    title: '工序类型',
    align: 'center',
    dataIndex: 'operationType_dictText',
    width: 160,
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '工序号',
    field: 'operationNumber',
    component: 'JInput',
    colProps: {
      span: 6,
    },
  },
  {
    label: '工序名称',
    field: 'operationName',
    component: 'JInput',
    colProps: {
      span: 6,
    },
  },
  {
    label: '工序类型',
    field: 'operationType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'station_type',
      placeholder: '请选择工序类型',
    },
    colProps: {
      span: 6,
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工序号',
    field: 'operationNumber',
    component: 'Input',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入工序号',
        },
      ];
    },
  },
  {
    label: '工序名称',
    field: 'operationName',
    component: 'Input',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入工序名称',
        },
      ];
    },
  },
  {
    label: '工序类型',
    field: 'operationType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'station_type',
      placeholder: '请选择工序类型',
    },
  },
];
