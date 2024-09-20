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
    title: '图片地址',
    align: 'center',
    dataIndex: 'photos',
    customRender: render.renderImage,
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '锁屏时间(s)',
    align: 'center',
    dataIndex: 'lockTime',
  },
  {
    title: '轮播时间(s)',
    align: 'center',
    dataIndex: 'carouselTime',
  },
  {
    title: 'IP地址',
    align: 'center',
    dataIndex: 'ip',
  },
  {
    title: 'MAC地址',
    align: 'center',
    dataIndex: 'mac',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: 'IP地址',
    field: 'ip',
    component: 'Input',
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
  },
  {
    label: '图片地址',
    field: 'photos',
    component: 'JImageUpload',
    componentProps: {
      listType: 'picture',
      fileMax: 10,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入图片地址!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: '锁屏时间(s)',
    field: 'lockTime',
    component: 'InputNumber',
    defaultValue: 1800,
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入锁屏时间(s)!' }];
    },
  },
  {
    label: '轮播时间(s)',
    field: 'carouselTime',
    component: 'InputNumber',
    defaultValue: 30,
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入轮播时间(s)!' }];
    },
  },
  {
    label: 'IP地址',
    field: 'ip',
    component: 'Input',
  },
  {
    label: 'MAC地址',
    field: 'mac',
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
