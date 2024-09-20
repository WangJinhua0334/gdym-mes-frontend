import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '任务单号',
    field: 'code',
    component: 'Input',
  },
  {
    label: '工单ID',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
  },
  {
    label: '车间ID',
    field: 'workShopId',
    component: 'Input',
    show: false,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
  },
  /*{
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
  },*/
  {
    label: '生产批次',
    field: 'batch',
    component: 'Input',
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
  },
  {
    label: '投入数量',
    field: 'inputedQty',
    component: 'InputNumber',
  },
  {
    label: '产出数量',
    field: 'completedQty',
    component: 'InputNumber',
  },
  {
    label: '报废数量',
    field: 'scrapedQty',
    component: 'InputNumber',
  },
  {
    label: '工作中心',
    field: 'wkcIds_dictText',
    component: 'Input',
  },
  {
    label: '计划开始日期',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '计划完工日期',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '实际开始日期',
    field: 'acStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '实际完工日期',
    field: 'acCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];

/**工序任务表格配置 */
export const mesMoPlanTaskJVxeColumns: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '工艺工序ID',
    key: 'wfsId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '工序ID',
    key: 'stationId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '加工物料ID',
    key: 'prodId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '加工物料',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '工位',
    key: 'wkpIds_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '操作员',
    key: 'operateBys_dictText',
    type: JVxeTypes.input,
  },
];
