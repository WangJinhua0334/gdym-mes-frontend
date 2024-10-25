import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//子表列表数据
export const eamEquipTypeSpotCheckItemColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '点检方式',
    align: 'center',
    dataIndex: 'method',
    width: 150,
  },
  {
    title: '点检标准',
    align: 'center',
    dataIndex: 'standard',
    width: 150,
  },
  {
    title: '点检周期（天）',
    align: 'center',
    dataIndex: 'cycle',
    width: 150,
  },
  {
    title: '提前预警（小时）',
    align: 'center',
    dataIndex: 'alarm',
    width: 150,
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
    width: 150,
  },
];
//子表表单数据
export const eamEquipTypeSpotCheckItemFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '点检方式',
    field: 'method',
    component: 'Input',
  },
  {
    label: '点检标准',
    field: 'standard',
    component: 'Input',
  },
  {
    label: '点检周期（天）',
    field: 'cycle',
    component: 'InputNumber',
  },
  {
    label: '提前预警（小时）',
    field: 'alarm',
    component: 'InputNumber',
  },
  {
    label: '责任人',
    field: 'responsibleBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
];
//子表列表数据
export const eamEquipTypeMaintainItemColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '保养方式',
    align: 'center',
    dataIndex: 'method',
    width: 150,
  },
  {
    title: '保养标准',
    align: 'center',
    dataIndex: 'standard',
    width: 150,
  },
  {
    title: '保养周期（天）',
    align: 'center',
    dataIndex: 'cycle',
    width: 150,
  },
  {
    title: '提前预警（小时）',
    align: 'center',
    dataIndex: 'alarm',
    width: 150,
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
    width: 150,
  },
];
//子表表单数据
export const eamEquipTypeMaintainItemFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '保养位置',
    field: 'location',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入保养位置!' }];
    },
  },
  {
    label: '保养方式',
    field: 'method',
    component: 'Input',
  },
  {
    label: '保养标准',
    field: 'standard',
    component: 'Input',
  },
  {
    label: '保养周期（天）',
    field: 'cycle',
    component: 'InputNumber',
  },
  {
    label: '提前预警（小时）',
    field: 'alarm',
    component: 'InputNumber',
  },
  {
    label: '责任人',
    field: 'responsibleBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
];
