import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '责任部门',
    align: 'center',
    sorter: true,
    dataIndex: 'responsibleDeptName_dictText',
    width: 150,
  },
  {
    title: '负责人',
    align: 'center',
    dataIndex: 'responsibleByName_dictText',
    width: 150,
  },
  {
    title: '响应时长',
    align: 'center',
    dataIndex: 'hours',
    width: 120,
  },
  {
    title: '排序',
    align: 'center',
    sorter: true,
    dataIndex: 'orderNo',
    width: 80,
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
  {
    label: '责任部门',
    field: 'responsibleDeptId',
    component: 'JSelectDept',
    componentProps: {
      multiple: true,
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
      return [{ required: true, message: '编码不能为空' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '名称不能为空' }];
    },
  },
  {
    label: '责任部门',
    field: 'responsibleDeptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;

      return {
        sync: true,
        multiple: false,
        onChange: ({}) => {
          setFieldsValue({ responsibleBy: null });
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '责任部门不能为空' }];
    },
  },
  {
    label: '负责人',
    field: 'responsibleBy',
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
        multi: true,
        maxTagCount: 2,
        queryBefore: (params) => {
          const deptId = getFieldsValue().responsibleDeptId;
          if (deptId instanceof Array && deptId.length > 0) {
            params.departId = deptId[0];
          } else if (deptId && deptId.length > 0) {
            params.departId = deptId;
          }

          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '负责人不能为空' }];
    // },
  },
  {
    label: '处理时限',
    field: 'hours',
    component: 'InputNumber',
    suffix: '小时',
  },
  {
    label: '排序号',
    field: 'orderNo',
    component: 'InputNumber',
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
