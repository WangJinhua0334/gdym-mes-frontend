import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';

//列表数据
export const columns: BasicColumn[] = [
   {
    title: '物料编码',
    align:"center",
    sorter:true,
    dataIndex: 'prodId_dictText'
   },
   {
    title:'物料名称',
    align:"center",
    sorter:true,
    dataIndex:'prodName_dictText'
   },
   {
    title: '类别名称',
    align:"center",
    sorter:true,

    dataIndex: 'type_dictText'
   },
   {
    title: '规格型号',
    sorter:true,
    align:"center",
    dataIndex: 'specification'
   },
   {
    title: '总库存数量',
    align:"center",
    sorter:true,
    dataIndex: 'qty'
   },
   {
    title: '报废数量',
    align:"center",
    sorter:true,
    dataIndex: 'scrapedQty'
   },
   {
    title: '领用数量',
    align:"center",
    sorter:true,
    dataIndex: 'useQty'
   },
   {
    title: '库存数量',
    align:"center",
    sorter:true,
    dataIndex: 'invQty'
   },
   {
    title: '校验周期（天）',
    align:"center",
    sorter:true,
    dataIndex: 'inspCycle'
   },

   {
    title: '寿命类型',
    align:"center",
    dataIndex: 'lifeType_dictText'
   },
   {
    title: '标准寿命',
    align:"center",
    dataIndex: 'life'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "物料编码",
      field: 'code',
      component: 'Input',
      colProps: {span: 6},
 	},
   {
    label: "物料名称",
    field: 'name',
    component: 'Input',
    colProps: {span: 6},
 },
	{
      label: "工装类别",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
        dictCode:"fixture_type",
        placeholder: '请选择类别',
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
        columns: [
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
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        linkmap: [{ version: 'prodCode_dictText', name: 'prodName_dictText' }],
        placeholder: '请选择',
      };
    },
    dynamicRules: ({model,schema}) => {
      return [
             { required: true, message: '请选择物料编码!'},
      ];
    },
  },
  {
    label: '规格型号',
    field: 'specification',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
      return [
             { required: true, message: '请输入规格型号!'},
      ];
    },
  },
  {
    label: '类别名称',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"fixture_Type"
   },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true},
          ];
     },
  },
  {
    label: '校验周期（天）',
    field: 'inspCycle',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                    { pattern: /^[1-9]\d*$/, message: '请输入正确的数量!' },
          ];
     },

  },
  {
    label: '寿命类型',
    field: 'lifeType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"fixture_life_type"
     },
  },
  {
    label: '标准寿命',
    field: 'life',
    component: 'InputNumber',
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
export const emaFixtureSelectFormSchema: FormSchema[] = [
	{
      label: "是否启用",
      field: 'isEnable',
      component: 'JDictSelectTag',
      componentProps:{
        dictCode:"is_open",
      },
      colProps: {span: 6},
 	},
];
//子表列表数据
export const emaFixtureColumns: BasicColumn[] = [
   {
    title:'编号',
    align:"center",
    sorter:true,
    dataIndex: 'code',
   },
   {
    title: '名称',
    align:"center",
    sorter:true,
    dataIndex: 'name'
   },
   {
    title: '是否启用',
    align:"center",
    sorter:true,
    dataIndex: 'isEnable_dictText',
   },
   {
    title: '供应商',
    sorter:true,
    align:"center",
    dataIndex: 'suppName_dictText'
   },
   {
    title: '采购时间',
    sorter:true,
    align:"center",
    dataIndex: 'purchaseTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '固定资产编码',
    sorter:true,
    align:"center",
    dataIndex: 'fixedAssetsCode'
   },
   {
    title: '存放位置',
    sorter:true,
    align:"center",
    dataIndex: 'location'
   },
   {
    title: '状态',
    sorter:true,
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '领用人',
    sorter:true,
    align:"center",
    dataIndex: 'useBy_dictText'
   },
   {
    title: '领用时间',
    sorter:true,
    align:"center",
    dataIndex: 'useTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '报废人',
    sorter:true,
    align:"center",
    dataIndex: 'scrapedBy'
   },
   {
    title: '报废时间',
    align:"center",
    sorter:true,
    dataIndex: 'scrapedTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '报废原因',
    sorter:true,
    align:"center",
    dataIndex: 'scrapedReason'
   },
   {
    title: '校验状态',
    sorter:true,
    align:"center",
    dataIndex: 'inspStatus_dictText'
   },
   {
    title: '校验次数',
    align:"center",
    sorter:true,
    dataIndex: 'inspTimes'
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
    title: '下次校验时间',
    align:"center",
    sorter:true,
    dataIndex: 'nextInspTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '附件',
    sorter:true,
    align:"center",
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
   },
];

//子表表单数据
export const eamFixtureFormSchema: FormSchema[] = [
  {
   label:'编号',
   field:'code',
   component:'Input',
   dynamicRules: ({ model, schema }) => {
     return [
       { required: true },
     ];
   },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true },
      ];
    },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: {
          status: 'enable',
        },
        columns: [
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        isShowNum: true,
        // rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{name: 'suppName_dictText' }],
        placeholder: '请选择',
      };
    },
  },
  //传递默认值Created给后端创建做操作顺便给多选框加默认值
 {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    defaultValue: "Created",
    componentProps:{
        dictCode:"fixture_status",
     },
    show:false
  },
  {
     label: '采购时间',
     field: 'purchaseTime',
     component: 'DatePicker',
   },
  {
     label: '固定资产编码',
     field: 'fixedAssetsCode',
     component: 'Input',
   },
  {
    label: '存放位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '是否启用',
    field: 'isEnable',
     component: 'JSwitch',
     componentProps:{
      dictCode: 'is_open',
     },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps:{
     },
  },
  // TODO 主建隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show:false
  },
];
