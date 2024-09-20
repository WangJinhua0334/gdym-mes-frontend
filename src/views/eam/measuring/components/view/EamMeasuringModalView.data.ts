import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';


//子表表单数据
export const eamMeasuringFormSchema: FormSchema[] = [
  {
   label:'编号',
   field:'code',
   component:'Input',
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '供应商',
    field: 'suppName_dictText',
    component: 'Input',
  },
  //传递默认值Created给后端创建做操作顺便给多选框加默认值
 {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
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
  {
     label: '领用人',
     field: 'useBy_dictText',
     component: 'Input',
   },
   {
      label: '领用时间',
      field: 'useTime',
      component: 'DatePicker',
    },
    {
       label: '报废人',
       field: 'scrapedBy_dictText',
       component: 'Input',
     },
     {
        label: '报废时间',
        field: 'scrapedTime',
        component: 'DatePicker',
      },
      {
         label: '报废原因',
         field: 'scrapedReason',
         component: 'InputTextArea',
       },
       {
          label: '校验状态',
          field: 'inspStatus_dictText',
          component: 'Input',
        },
    {
       label: '校验次数',
       field: 'inspTimes',
       component: 'Input',
     },    
  {
     label: '校验时间',
     field: 'inspTime',
     component: 'DatePicker',
   },  
       {
          label: '下次校验时间',
          field: 'nextInspTime',
          component: 'DatePicker',
        },  
        
  // TODO 主建隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show:false
  },
];
