import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
import { ref } from '@vue/runtime-core';

// export const scanFunc = ref<any>(null);

// export const wkpId = ref<string>('');
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工装编号',
    align:"center",
    sorter:true,
    dataIndex: 'fixtureId_dictText'
   },
   {
    title:'工装名称',
    align:"center",
    sorter:true,
    dataIndex:'fixtureName_dictText'
   },
   {
    title: '校验人',
    align:"center",
    sorter:true,
    dataIndex: 'inspBy_dictText'
   },
   {
    title: '校验时间',
    align:"center",
    sorter:true,
    dataIndex: 'inspTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '校验结果',
    sorter:true,
    align:"center",
    dataIndex: 'result_dictText'
   },
   {
    title:'校验次数',
    align:'center',
    sorter:true,
    dataIndex:'inspTimes',
   },
   {
    title: '校验工时',
    align:"center",
    sorter:true,
    dataIndex: 'hours'
   },
   {
    title: '校验价格',
    align:"center",
    sorter:true,
    dataIndex: 'hours'
   },
   {
    title: '文件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },

];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工装编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '工装名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 12 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '校验结果',
    field: 'result',
    component: 'JSwitch',
    componentProps:{
        dictCode:"fixture_pass_ng"
     },
  },
  {
    label: '校验工时',
    field: 'hours',
    component: 'InputNumber',
  },
  {
    label: '校验价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps:{
     },
  },
  {
    label: '校验状态',
    field: 'status',
    component: 'InputNumber',
    defaultValue:'Inspected',
    show:false
  },
	{
	  label: '模具ID',
	  field: 'fixtureId',
	  component: 'Input',
	  show: false
	},
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
//查询子列表数据
export const emaFixtureInspItemSelectFormSchema: FormSchema[] = [];
//子列表数据
export const eamFixtureInspItemColumns: BasicColumn[] = [
  {
    title: '序号',
    align: 'center',
    sorter:true,
    dataIndex: 'orderNo',
  },
  {
    title: '编码',
    align: 'center',
    sorter:true,
    dataIndex: 'code',
  },
  {
    title: '内容',
    align: 'center',
    sorter:true,
    dataIndex: 'content',
  },
  {
    title: '上限',
    align: 'center',
    sorter:true,
    dataIndex: 'limitMax',
  },
  {
    title: '下限',
    align: 'center',
    sorter:true,
    dataIndex: 'limitMin',
  },
  {
    title: '值',
    align: 'center',
    sorter:true,
    dataIndex: 'value',
  },
  {
    title: '是否合格',
    align: 'center',
    sorter:true,
    dataIndex: 'result_dictText',
  },
];
//子表表格配置
export const eamFixtureInspItemJVxeColumns: JVxeColumn[] = [
    {
      title: '编码',
      key: 'code',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '内容',
      key: 'content',
      type: JVxeTypes.textarea,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '上限',
      key: 'limitMax',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '下限',
      key: 'limitMin',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '值',
      key: 'value',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '是否合格',
      key: 'result',
      defaultValue: 'N',
      customValue: ['Y', 'N'],
      type: JVxeTypes.slot,
      width: '200px',
      placeholder: '请输入${title}',
      slotName:'resultslot',
    },
   

  ];