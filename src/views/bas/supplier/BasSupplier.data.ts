import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '全称',
    align: 'center',
    sorter: true,
    dataIndex: 'fullName',
  },
  // {
  //   title: '负责人',
  //   align: 'center',
  //   dataIndex: 'principal',
  //   width: 150,
  // },
  // {
  //   title: '电话号码',
  //   align: 'center',
  //   dataIndex: 'telephone',
  //   width: 150,
  // },
  // {
  //   title: '是否锁定',
  //   align: 'center',
  //   sorter: true,
  //   dataIndex: 'isLock',
  //   width: 150,
  //   customRender: ({ text }) => {
  //     return render.renderSwitch(text, [
  //       { text: '是', value: 'Y', isChecked: true },
  //       { text: '否', value: 'N', isChecked: false },
  //     ]);
  //   },
  // },
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
  {
    label: '是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '全称',
    field: 'fullName',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入全称!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '地址',
    field: 'address',
    component: 'Input',
  },
  {
    label: '负责人',
    field: 'principal',
    component: 'Input',
  },
  {
    label: '电话号码',
    field: 'telephone',
    component: 'Input',
  },
  {
    label: '传真',
    field: 'fax',
    component: 'Input',
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
  },
  {
    label: '是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '联系人1',
    field: 'contactPerson1',
    component: 'Input',
  },
  {
    label: '联系电话1',
    field: 'mobilePhone1',
    component: 'Input',
  },
  {
    label: '联系人2',
    field: 'contactPerson2',
    component: 'Input',
  },
  {
    label: '联系电话2',
    field: 'mobilePhone2',
    component: 'Input',
  },
  {
    label: '联系人3',
    field: 'contactPerson3',
    component: 'Input',
  },
  {
    label: '联系电话3',
    field: 'mobilePhone3',
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
export const basSupplierProductColumns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 200,
  },
  {
    title: '物料版本',
    align: 'center',
    dataIndex: 'prodVer_dictText',
    width: 200,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '供应商料号',
    align: 'center',
    sorter: true,
    dataIndex: 'suppProdCode',
    width: 200,
  },
];
//子表表格配置
export const basSupplierProductJVxeColumns: JVxeColumn[] = [
  {
    title: '物料编码',
    key: 'prodId',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/product/basProduct/list',
    params: {
      /*code: '${code}',*/
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
        field: 'name',
        label: '名称',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
    ],
    rowKey: 'id',
    labelKey: 'code',
    multi: false,
    linkmap: [{ name: 'prodName_dictText' }, { version: 'prodVer_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    /*queryBefore: (params) => {
      params.code = '123';
    },*/
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '物料版本',
    key: 'prodVer_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '供应商料号',
    key: 'suppProdCode',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
  },
];
