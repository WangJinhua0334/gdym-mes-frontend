import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '参数组',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '参数组',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '描述',
    field: 'description',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '参数组',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入参数组!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表列表数据
export const sysConfigColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
  {
    title: '值',
    align: 'center',
    sorter: true,
    dataIndex: 'value',
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnabled',
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '是否保存日志',
    align: 'center',
    dataIndex: 'isLog',
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '扩展1',
    align: 'center',
    dataIndex: 'extend1',
  },
  {
    title: '扩展2',
    align: 'center',
    dataIndex: 'extend2',
  },
  {
    title: '扩展3',
    align: 'center',
    dataIndex: 'extend3',
  },
];
//子表表格配置
export const sysConfigJVxeColumns: JVxeColumn[] = [
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '值',
    key: 'value',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '是否启用',
    key: 'isEnabled',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
  },
  {
    title: '是否保存日志',
    key: 'isLog',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
  },
  {
    title: '扩展1',
    key: 'extend1',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '扩展2',
    key: 'extend2',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '扩展3',
    key: 'extend3',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
