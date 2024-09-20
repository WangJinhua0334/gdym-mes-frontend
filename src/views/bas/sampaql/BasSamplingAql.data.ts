import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '严格度',
    align:"center",
    sorter: true,
    
    dataIndex: 'stringencyId_dictText'
   },
   {
    title: 'aql',
    align:"center",
    sorter: true,
    
    dataIndex: 'aql'
   },
   {
    title: '抽样方式',
    align:"center",
    sorter: true,
    
    dataIndex: 'samplingModel_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	
	{
      label: "严格度",
      field: 'stringencyId',
      component: 'JSearchSelect',
      componentProps:{
          dict:"bas_sampling_stringency,code|description,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "抽样方式",
      field: 'samplingModel',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sampling_model"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '严格度',
    field: 'stringencyId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"bas_sampling_stringency,code|description,id"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入严格度!'},
          ];
     },
  },
  {
    label: 'aql',
    field: 'aql',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入aql!'},
                 { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
          ];
     },
  },
  {
    label: '抽样方式',
    field: 'samplingModel',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sampling_model"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入抽样方式!'},
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
//子表单数据
//子表列表数据
export const basSamplingAcReColumns: BasicColumn[] = [
   {
    title: '批量下限',
    align:"center",
    dataIndex: 'lotQtyMin'
   },
   {
    title: '批量上限',
    align:"center",
    dataIndex: 'lotQtyMax'
   },
   {
    title: '样本数',
    align:"center",
    dataIndex: 'sampleQty'
   },
   {
    title: '接收数',
    align:"center",
    dataIndex: 'ac'
   },
   {
    title: '拒收数',
    align:"center",
    dataIndex: 're'
   },
];
//子表表格配置
export const basSamplingAcReJVxeColumns: JVxeColumn[] = [
    {
      title: '批量下限',
      key: 'lotQtyMin',
      type: JVxeTypes.inputNumber,
      width:"120px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
          { pattern: "n", message: "${title}格式不正确" }
        ],
    },
    {
      title: '批量上限',
      key: 'lotQtyMax',
      type: JVxeTypes.inputNumber,
      width:"120px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
          { pattern: "n", message: "${title}格式不正确" }
        ],
    },
    {
      title: '样本数',
      key: 'sampleQty',
      type: JVxeTypes.inputNumber,
      width:"120px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
          { pattern: "n", message: "${title}格式不正确" }
        ],
    },
    {
      title: '接收数',
      key: 'ac',
      type: JVxeTypes.inputNumber,
      width:"120px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
          { pattern: "n", message: "${title}格式不正确" }
        ],
    },
    {
      title: '拒收数',
      key: 're',
      type: JVxeTypes.inputNumber,
      width:"120px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
          { pattern: "n", message: "${title}格式不正确" }
        ],
    },
  ]
