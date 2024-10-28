import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    align: 'center',
    dataIndex: 'userId',
    ifShow: false,
  },
  {
    title: '用户账号',
    align: 'center',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '真实姓名',
    align: 'center',
    dataIndex: 'realname',
    width: 150,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: '标准工时(元/时)',
    align: 'center',
    dataIndex: 'standardMoney',
    width: 150,
  },
  {
    title: '工作日加班工时(元/时)',
    align: 'center',
    dataIndex: 'workMoney',
    width: 150,
  },
  {
    title: '休息日加班工时(元/时)',
    align: 'center',
    dataIndex: 'restMoney',
    width: 150,
  },
  {
    title: '节假日加班工时(元/时)',
    align: 'center',
    dataIndex: 'holidaysMoney',
    width: 150,
  },
  {
    title: '扩展字段1',
    align: 'center',
    dataIndex: 'extend1',
    width: 150,
  },
  {
    title: '扩展字段2',
    align: 'center',
    dataIndex: 'extend2',
    width: 150,
  },
  {
    title: '扩展字段3',
    align: 'center',
    dataIndex: 'extend3',
    width: 150,
  },
  {
    title: '扩展字段4',
    align: 'center',
    dataIndex: 'extend4',
    width: 150,
  },
  {
    title: '扩展字段5',
    align: 'center',
    dataIndex: 'extend5',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '用户账号',
    field: 'username',
    component: 'JInput',
  },
  {
    label: '真实姓名',
    field: 'realname',
    component: 'JInput',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '用户',
    field: 'userId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { searchFields: 'username,realname' },
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
        rowKey: 'id',
        labelKey: ['username'],
        placeholder: '请选择用户',
        multi: false,
        linkmap: [{ realname: 'realname' }, { username: 'username' }],
        queryBefore: (params) => {
          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择用户' }];
    },
  },
  {
    label: '用户账号',
    field: 'username',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '真实姓名',
    field: 'realname',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '标准工时(元/时)',
    field: 'standardMoney',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '工作日加班工时(元/时)',
    field: 'workMoney',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '休息日加班工时(元/时)',
    field: 'restMoney',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '节假日加班工时(元/时)',
    field: 'holidaysMoney',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '扩展字段1',
    field: 'extend1',
    component: 'Input',
  },
  {
    label: '扩展字段2',
    field: 'extend2',
    component: 'Input',
  },
  {
    label: '扩展字段3',
    field: 'extend3',
    component: 'Input',
  },
  {
    label: '扩展字段4',
    field: 'extend4',
    component: 'Input',
  },
  {
    label: '扩展字段5',
    field: 'extend5',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
