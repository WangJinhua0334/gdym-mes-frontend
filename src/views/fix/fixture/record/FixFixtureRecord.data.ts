import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工装编号',
    align: 'center',
    sorter: true,
    dataIndex: 'fixtureId_dictText',
    width: 150,
  },
  {
    title: '工装',
    sorter: true,
    align: 'center',
    dataIndex: 'fixtureName_dictText',
    width: 150,
  },
  {
    title: '事件代码',
    align: 'center',
    sorter: true,
    dataIndex: 'eventCode_dictText',
    width: 150,
  },
  {
    title: '操作人',
    align: 'center',
    sorter: true,
    dataIndex: 'operateBy_dictText',
    width: 150,
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'operateTime',
    width: 150,
    sorter: true,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 300,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工装名称',
    field: 'queryFixtureName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'JInput',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工装',
    field: 'fixtureId_dictText',
    component: 'Input',
  },
  {
    label: '事件代码',
    field: 'eventCode_dictText',
    component: 'Input',
  },
  {
    label: '操作人',
    field: 'operateBy_dictText',
    component: 'Input',
  },
  {
    label: '操作时间',
    field: 'operateTime',
    component: 'DatePicker',
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
