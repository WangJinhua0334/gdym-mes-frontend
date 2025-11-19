import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '应用ID',
    align: 'center',
    dataIndex: 'appid',
  },
  {
    title: '平台类型',
    align: 'center',
    dataIndex: 'platform',
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: 'App标题',
    align: 'center',
    dataIndex: 'appTitle',
  },
  {
    title: '热更包',
    align: 'center',
    dataIndex: 'wgtUrl',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '全量包',
    align: 'center',
    dataIndex: 'fullUrl',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '更新说明',
    align: 'center',
    dataIndex: 'releaseNote',
  },
  {
    title: '版本代号',
    align: 'center',
    dataIndex: 'versionCode',
  },
  {
    title: '是否强制更新',
    align: 'center',
    dataIndex: 'isForce',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: 'App图标',
    align: 'center',
    dataIndex: 'appLogo',
    customRender: ({ text }) => {
      return render.renderImage({ text });
    },
  },
  {
    title: '首页图标',
    align: 'center',
    dataIndex: 'homeLogo',
    customRender: ({ text }) => {
      return render.renderImage({ text });
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '应用ID',
    field: 'appid',
    component: 'JInput',
  },
  {
    label: 'APP标题',
    field: 'appTitle',
    component: 'JInput',
  },
  {
    label: '平台类型',
    field: 'platform',
    component: 'JInput',
  },
  {
    label: '版本',
    field: 'version',
    component: 'JInput',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '应用ID',
    field: 'appid',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入应用ID!' }];
    },
  },
  {
    label: '平台类型',
    field: 'platform',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入平台类型!' }];
    },
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入版本!' }];
    },
  },
  {
    label: 'APP标题',
    field: 'appTitle',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入APP标题!' }];
    },
  },
  {
    label: '热更包',
    field: 'wgtUrl',
    component: 'JUpload',
    componentProps: {
      multiple: false,
      maxCount: 1,
    },
  },
  {
    label: '全量包',
    field: 'fullUrl',
    component: 'JUpload',
    componentProps: {
      multiple: false,
      maxCount: 1,
    },
  },
  {
    label: '更新说明',
    field: 'releaseNote',
    component: 'InputTextArea',
  },
  {
    label: '版本代号',
    field: 'versionCode',
    component: 'Input',
  },
  {
    label: '是否强制更新',
    field: 'isForce',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: 'App图标',
    field: 'appLogo',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入App图标!' }];
    },
  },
  {
    label: '首页图标',
    field: 'homeLogo',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入首页图标!' }];
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
