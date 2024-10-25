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
    width: 200,
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
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
    label: '描述',
    field: 'description',
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

//子表列表数据
export const basTemplateDetailColumns: BasicColumn[] = [
  {
    title: '模板类型',
    align: 'center',
    dataIndex: 'templateType_dictText',
    width: 200,
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '打印设计',
    align: 'center',
    dataIndex: 'reportId_dictText',
    width: 150,
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachment',
    slots: { customRender: 'fileSlot' },
  },
];
//子表表单数据
export const basTemplateDetailFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '模板类型',
    field: 'templateType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'print_template_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入模板类型!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否启用!' }];
    },
  },
  {
    label: '打印设计',
    field: 'reportId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'jimu_report,name,id',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '附件',
    field: 'attachment',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
  },
];
