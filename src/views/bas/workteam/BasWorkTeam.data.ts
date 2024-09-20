import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
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
    title: '类型',
    align: 'center',
    dataIndex: 'type_dictText',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'state_dictText',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptCode_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'work_team_type',
      placeholder: '请选择类型',
      stringToNumber: true,
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'state',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'work_team_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '部门',
    field: 'deptCode',
    component: 'JSelectDept',
    componentProps: {
      rowKey: 'orgCode',
      labelKey: 'departName',
      checkStrictly: true,
    },
    colProps: { span: 6 },
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
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'work_team_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入类型!' }];
    },
  },
  {
    label: '状态',
    field: 'state',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'work_team_status',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入状态!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '部门',
    field: 'deptCode',
    component: 'JSelectDept',
    componentProps: {
      rowKey: 'orgCode',
      labelKey: 'departName',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入部门!' }];
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

//子表列表数据
export const basWorkTeamStaffColumns: BasicColumn[] = [
  {
    title: '用户账号',
    align: 'center',
    dataIndex: 'userCode_dictText',
  },
  {
    title: '用户姓名',
    align: 'center',
    dataIndex: 'userName_dictText',
  },
  {
    title: '是否班长',
    align: 'center',
    dataIndex: 'isMonitor_dictText',
  },
];
//子表数据
export const basWorkTeamStaffSearchFormSchema: FormSchema[] = [
  {
    label: '账号',
    field: 'userCode',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '姓名',
    field: 'userName',
    component: 'Input',
    colProps: { span: 6 },
  },
];

//子表表单数据
export const basWorkTeamStaffFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '用户',
    field: 'userCode',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'username', order: 'asc', searchFields: 'username,realname,workNo' },
        columns: [
          {
            name: '账号',
            code: 'username',
          },
          {
            name: '姓名',
            code: 'realname',
          },
          {
            name: '工号',
            code: 'workNo',
          },
        ],
        isShowNum: false,
        rowKey: 'username',
        labelKey: ['realname'],
        placeholder: '请输入',
        multi: false,
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '${title}不能为空' }];
    },
  },
  {
    label: '是否班长',
    field: 'isMonitor',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否班长!' }];
    },
  },
];
