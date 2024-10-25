import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '仓库',
    align: 'center',
    sorter: true,
    dataIndex: 'whId_dictText',
    width: 150,
  },
  {
    title: '区域编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '区域名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '区域描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '区域位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
    width: 200,
  },
  {
    title: '区域是否锁定',
    align: 'center',
    dataIndex: 'isLock',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  /*{
    label: '仓库',
    field: 'whId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "bas_warehouse where sys_org_code like '#{sys_org_code}%',name,id",
      pageSize: 10,
      async: true,
      params: { column: 'code', order: 'asc', searchCols: 'code,name' },
    },
    colProps: { span: 6 },
  },*/
  {
    label: '仓库',
    field: 'whId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehouse/basWarehouse/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        //maxTagCount: 2,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '区域编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '区域名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '区域是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  /*{
    label: '仓库',
    field: 'whId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "bas_warehouse where sys_org_code like '#{sys_org_code}%',name,id",
      pageSize: 10,
      async: true,
      params: { column: 'code', order: 'asc', searchCols: 'code,name' },
      getPopupContainer: () => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入仓库!' }];
    },
  },*/
  {
    label: '仓库',
    field: 'whId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehouse/basWarehouse/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择仓库!' }];
    },
  },
  {
    label: '区域编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '区域名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '区域描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '区域位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '区域是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
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
//子表单数据
//子表列表数据
export const basWarehouseBinColumns: BasicColumn[] = [
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
    width: 150,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
    width: 150,
  },
  {
    title: '是否锁定',
    align: 'center',
    dataIndex: 'isLock',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
];
//子表表格配置
export const basWarehouseBinJVxeColumns: JVxeColumn[] = [
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
    title: '名称',
    key: 'name',
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
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '是否锁定',
    key: 'isLock',
    type: JVxeTypes.checkbox,
    customValue: ['Y', 'N'],
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: 'N',
  },
];
