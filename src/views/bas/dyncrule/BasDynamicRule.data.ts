import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '编码',
    align:"center",
    sorter: true,
    
    dataIndex: 'code'
   },
   {
    title: '描述',
    align:"center",
    sorter: true,
    
    dataIndex: 'description'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "编码",
      field: "code",
      component: 'JInput',
      colProps: {span: 6},
 	},
	{
      label: "描述",
      field: "description",
      component: 'JInput',
      colProps: {span: 6},
 	},
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入编码!'},
          ];
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',//TODO 注意string转换问题
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入描述!'},
          ];
     },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];

//查询数据
export const basDynamicRuleDetailSearchFormSchema: FormSchema[] = [
	{
      label: "明细编码",
      field: "code",
      component: 'JInput',
 	},
	{
      label: "明细描述",
      field: "description",
      component: 'JInput',
 	}
];

//子表列表数据
export const basDynamicRuleDetailColumns: BasicColumn[] = [
   {
    title: '明细编码',
    align:"center",
    sorter: true,
    
    dataIndex: 'code'
   },
   {
    title: '明细描述',
    align:"center",
    sorter: true,
    
    dataIndex: 'description'
   },
   {
    title: '严格度',
    align:"center",
    sorter: true,
    
    dataIndex: 'stringencyId_dictText'
   },
   {
    title: '是否跳过',
    align:"center",
    sorter: true,
    
    dataIndex: 'isSkip',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
   },
   {
    title: 'OK后下一阶段',
    align:"center",
    sorter: true,
    
    dataIndex: 'okNextId_dictText'
   },
   {
    title: 'NG后下一阶段',
    align:"center",
    sorter: true,
    
    dataIndex: 'ngNextId_dictText'
   },
];
//子表表单数据
export const basDynamicRuleDetailFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入编码!'},
          ];
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入描述!'},
          ];
     },
  },
 /* {
    label: '严格度',
    field: 'stringencyId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"bas_sampling_stringency,code|description,id"
    }
  }
  ,*/
  {
    label: '严格度',
    field: 'stringencyId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sampstringency/basSamplingStringency/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,description' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '描述',
            code: 'description',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请输入',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择严格度编码!' }];
    },
  },

  {
    label: '连续合格批数',
    field: 'continuouslyOkQty',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: false},
                 { pattern: /^-?\d+$/, message: '请输入整数!'},
          ];
     },
  },
  {
    label: '连续不合格批数',
    field: 'continuouslyNgQty',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: false},
                 { pattern: /^-?\d+$/, message: '请输入整数!'},
          ];
     },
  },
  {
    label: '允许跳过批数',
    field: 'allowSkipQty',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: false},
                 { pattern: /^-?\d+$/, message: '请输入整数!'},
          ];
     },
  },
  {
    label: '允许跳过周期（天）',
    field: 'allowSkipCycle',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: false},
                 { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
          ];
     },
  },
  {
    label: '是否跳过',
    field: 'isSkip',
     component: 'JSwitch',
     componentProps:{
     },
  }
  ,  {
    label: 'OK后下一阶段',
    field: 'okNextId',
    component: 'JDictSelectTag'
  },
  {
    label: 'NG后下一阶段',
    field: 'ngNextId',
    component: 'JDictSelectTag'
  }
];
