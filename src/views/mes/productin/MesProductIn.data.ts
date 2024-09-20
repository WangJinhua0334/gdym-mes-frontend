import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '申请单号',
    align:"center",
    dataIndex: 'code'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '计划入库时间',
    align:"center",
    dataIndex: 'planInDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '是否完成',
    align:"center",
    dataIndex: 'isComplete_dictText'
   },
   {
    title: '完成时间',
    align:"center",
    dataIndex: 'completeDate'
   },
   {
    title: '完成操作人',
    align:"center",
    dataIndex: 'completeBy_dictText'
   },
   {
    title: 'ERP单号',
    align:"center",
    dataIndex: 'erpNo'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "申请单号",
      field: 'code',
      component: 'JInput',
      colProps: {span: 6},
 	},
	{
      label: "是否完成",
      field: 'isComplete',
      component: 'JDictSelectTag',
      componentProps:{
        dictCode:'is_open'
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [

  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '计划入库时间',
    field: 'planInDate',
    component: 'DatePicker',
  },
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    colProps: {span: 24},
    dynamicRules: ({model,schema}) => {
      return [
             { required: true},
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
export const mesProductInDetailColumns: BasicColumn[] = [

   {
    title: '工单',
    align:"center",
    dataIndex: 'moId_dictText'
   },
   {
    title: '产品',
    align:"center",
    dataIndex: 'prodId'
   },
   {
    title: '生产批次',
    align:"center",
    dataIndex: 'batch'
   },
   {
    title: '数量',
    align:"center",
    dataIndex: 'qty'
   },
   {
    title: '仓库',
    align:"center",
    dataIndex: 'whId_dictText'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status'
   },
   {
    title: '入库时间',
    align:"center",
    dataIndex: 'actualInDate'
   },
   {
    title: '入库操作人',
    align:"center",
    dataIndex: 'actualInBy_dictText'
   },
   {
    title: 'ERP行号',
    align:"center",
    dataIndex: 'erpLineNo'
   },
];
//子表表格配置
export const mesProductInDetailJVxeColumns: JVxeColumn[] = [
    {
      title: '工单',
      key: 'moId',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '产品',
      key: 'prodId',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '生产批次',
      key: 'batch',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '数量',
      key: 'qty',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
   
  ]
