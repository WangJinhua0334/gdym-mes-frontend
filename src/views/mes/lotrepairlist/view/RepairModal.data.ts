import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流转卡/序列号',
    field: 'lotSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },

  {
    label: '生产任务单号',
    field: 'moPlanId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '数量',
    field: 'lotQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '不良工序',
    field: 'wfsId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
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

//子表表格配置
export const prodBindJVxeColumns: JVxeColumn[] = [
  {
    title: '条码',
    key: 'materialSn',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料批次',
    key: 'materialBatch',
    type: JVxeTypes.input,
    width: '100px',
    disabled: true,
  },
  {
    title: '数量',
    key: 'qty',
    type: JVxeTypes.input,
    width: '100px',
    disabled: true,
  },
];
