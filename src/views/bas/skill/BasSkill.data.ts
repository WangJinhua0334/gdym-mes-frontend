import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '技能编码',
    align:"center",
    dataIndex: 'code',
     sorter: true,
   },
   {
    title: '技能名称',
    align:"center",
    dataIndex: 'name',
     sorter: true,
   },
   {
    title: '技能描述',
    align:"center",
    dataIndex: 'description'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "技能编码",
      field: 'code',
      component: 'JInput',
      colProps: {span: 6},
 	},
	{
      label: "技能名称",
      field: 'name',
      component: 'JInput',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '技能编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入技能编码!'},
          ];
     },
  },
  {
    label: '技能名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入技能名称!'},
          ];
     },
  },
  {
    label: '技能描述',
    field: 'description',
    component: 'Input',
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
export const basSkillLevelColumns: BasicColumn[] = [
   {
    title: '等级',
    align:"center",
    dataIndex: 'level'
   },
   {
    title: '等级名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '等级描述',
    align:"center",
    dataIndex: 'description'
   },
];
//子表表格配置
export const basSkillLevelJVxeColumns: JVxeColumn[] = [
    {
      title: '等级',
      key: 'level',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '等级名称',
      key: 'name',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '等级描述',
      key: 'description',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
  ]
