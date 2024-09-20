import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  // {
  //   title: '文件编号',
  //   align: 'center',
  //   dataIndex: 'fileId_dictText',
  // },
  {
    title: '文件名称',
    align: 'center',
    dataIndex: 'fileName_dictText',
  },
  {
    title: '文件版本',
    align: 'center',
    dataIndex: 'fileVersion_dictText',
  },
  {
    title: '文件分类',
    align: 'center',
    dataIndex: 'fileCategory_dictText',
  },
  {
    title: '文件类型',
    align: 'center',
    dataIndex: 'fileSuffix_dictText',
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'file_dictText',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '工位信息',
    align: 'center',
    dataIndex: 'wkpName_dictText',
  },
  {
    title: '工作中心',
    align: 'center',
    dataIndex: 'wkcName_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  // {
  //   label: '文件编号',
  //   field: 'fileCode',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  {
    label: '文件名称',
    field: 'fileName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '文件分类',
    field: 'fileCategory',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'file_category',
    },
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '文件编码',
    field: 'fileCode',
    component: 'JPopup',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        code: 'file_query',
        fieldConfig: [
          { source: 'id', target: 'fileId' },
          { source: 'code', target: 'fileCode' },
          { source: 'name', target: 'fileName' },
          { source: 'category', target: 'fileCategory' },
          { source: 'version', target: 'fileVersion' },
        ],
        multi: true,
      };
    },

    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入文件!' }];
    },
  },
  {
    field: 'fileId',
    component: 'Input',
    label: '文件名称',
    dynamicDisabled: true,
    show: false,
  },
  {
    field: 'fileName',
    component: 'Input',
    label: '文件名称',
    dynamicDisabled: true,
  },
  {
    field: 'fileCategory',
    component: 'Input',
    label: '文件分类',
    dynamicDisabled: true,
  },
  {
    field: 'fileVersion',
    component: 'Input',
    label: '文件版本',
    dynamicDisabled: true,
  },
  {
    label: '工位编码',
    field: 'wkpCode',
    component: 'JPopup',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        code: 'wkp_wkc_query',
        fieldConfig: [
          { source: 'id', target: 'wkpId' },
          { source: 'code', target: 'wkpCode' },
          { source: 'name', target: 'wkpName' },
          { source: 'bwcname', target: 'wkcName' },
        ],
        multi: true,
      };
    },

    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工位!' }];
    },
  },
  {
    field: 'wkpId',
    component: 'Input',
    label: '工位id',
    dynamicDisabled: true,
    show: false,
  },
  {
    field: 'wkpName',
    component: 'Input',
    label: '工位名称',
    dynamicDisabled: true,
  },
  {
    field: 'wkcName',
    component: 'Input',
    label: '工作中心',
    dynamicDisabled: true,
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
