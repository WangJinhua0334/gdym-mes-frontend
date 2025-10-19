import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import {JVxeColumn, JVxeTypes} from "@/components/jeecg/JVxeTable/src/types";
//销售发货列表数据
export const columns: BasicColumn[] = [
  {
    title: '任务单号',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 160,
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 140,
  },
  {
    title: '工作中心',
    align: 'center',
    sorter: true,
    dataIndex: 'wkcIds_dictText',
    width: 130,
  },
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 200,
  },
  {
    title: '状态',
    sorter: true,
    align: 'center',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_plan_status', true);
    },
  },
  {
    title: '数量',
    align: 'center',
    sorter: true,
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '投入数量',
    align: 'center',
    dataIndex: 'inputedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '产出数量',
    align: 'center',
    dataIndex: 'completedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 150,
  },

  /*{
    title: '发货通知单号',
    dataIndex: 'code',
    sorter: true,
    width: 160,
  },
  {
    title: '仓库',
    dataIndex: 'type_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '发货日期',
    dataIndex: 'startTime',
    sorter: true,
    width: 160,
  },
  {
    title: '客户',
    dataIndex: 'type_dictText',
    sorter: true,
    width: 120,
  },

  {
    title: '销售员',
    dataIndex: 'operateBy_dictText',
    sorter: true,
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'description',
    width: 160,
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'temporary_work_status', true);
    },
  },*/
];
//销售发货查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '发货通知单号',
    field: 'code',
    component: 'Input',
    colProps: { span: 7 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_plan_status',
    },
    colProps: { span: 6 },
  },
];

//销售发货备料弹框 数据
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '车间',
      field: 'workShopId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '产品编码',
      field: 'prodId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '产品名称',
      field: 'prodName_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '计划数量',
      field: 'moQty',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '工单报废数量',
      field: 'moScrapedQty',
      component: 'Input',
      dynamicDisabled: true,
      show: false,
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      colProps: { span: 24 },
    },
  ];
}

/**销售发货 选择产品 */
export const mesSalesOutboundTaskJVxeColumns: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '分条码',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
    width: 160,
  },
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '规格型号',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '仓库',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '应发数量',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '实发数量',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '托盘码',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '库管员',
    key: 'operateBys',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/sys/user/list',
    params: { column: 'username', order: 'asc', searchFields: 'username,realname' },
    columns: [
      {
        name: '账号',
        code: 'username',
      },
      {
        name: '姓名',
        code: 'realname',
      },
    ],
    rowKey: 'username',
    labelKey: 'realname',
    multi: true,
    placeholder: '请输入${title}',
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
    width: 240,
  },
];
