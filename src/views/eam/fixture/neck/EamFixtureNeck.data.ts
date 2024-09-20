import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';


//表单数据
export const formSchema: FormSchema[] = [

  {
    label: '领用人',
    field: 'useBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount:1,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择领用人!' }];
    },
  },
  {
    label: '领用日期',
    field: 'useTime',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择计划完工日期!' }];
    },
  },
  {
    label:'工装型号Id',
    field:'typeId',
    component: 'Input',
    show:false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
  //TODO 传递默认值Used标识符给后端进行报废操作
  {
    label:'状态',
    field:'status',
    component: 'Input',
    show:false,
    defaultValue:'Used',
  },
]