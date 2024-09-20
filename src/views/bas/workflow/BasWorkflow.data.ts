import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { rule } from 'postcss';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '版本',
    align: 'center',
    sorter: true,
    dataIndex: 'version',
    width: 120,
  },
  {
    title: '是否默认',
    align: 'center',
    sorter: true,
    dataIndex: 'isDefault',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '是否发布',
    align: 'center',
    dataIndex: 'isRelease',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '设计器',
    align: 'center',
    dataIndex: 'designer',
    slots: { customRender: 'designerSlot' },
    width: 120,
  },
  {
    title: '工序列表',
    align: 'center',
    dataIndex: 'wfsList',
    slots: { customRender: 'wfsListSlot' },
    width: 120,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '产品编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '产品名称',
    field: 'name',
    component: 'Input',
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
        columns: [
          {
            title: '编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'specification',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName_dictText' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择产品!' }];
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '版本',
    field: 'version',
    component: 'InputNumber',
    defaultValue: 1.0,
    componentProps: { addonBefore: 'V', precision: 1 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入版本!' }];
    },
  },
  {
    label: '是否默认',
    field: 'isDefault',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否默认!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
