import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '领料单号',
    align: 'center',
    dataIndex: 'code',
    sorter: true,
    width: 160,
  },
  {
    title: '领料类型',
    align: 'center',
    dataIndex: 'type_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '计划领料时间',
    align: 'center',
    dataIndex: 'planPickDate',
    sorter: true,
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
    width: 120,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '提交时间',
    align: 'center',
    dataIndex: 'submitDate',
    sorter: true,
    width: 160,
  },
  {
    title: '提交操作人',
    align: 'center',
    dataIndex: 'submitBy',
    sorter: true,
    width: 120,
  },
  {
    title: '完成时间',
    align: 'center',
    dataIndex: 'completeDate',
    sorter: true,
    width: 160,
  },
  {
    title: '完成操作人',
    align: 'center',
    dataIndex: 'completeBy',
    sorter: true,
    width: 120,
  },
  {
    title: 'ERP单号',
    align: 'center',
    dataIndex: 'erpNo',
    ifShow: false,
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '领料单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '领料类型',
    field: 'type',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'product_pick_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'product_pick_status',
    },
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '领料单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.id;
    },
    colProps: { span: 24 },
  },
  {
    label: '领料类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'product_pick_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入领料类型!' }];
    },
  },
  {
    label: '计划领料时间',
    field: 'planPickDate',
    defaultValue: new Date().setHours(0, 0, 0),
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: 'ERP单号',
    field: 'erpNo',
    component: 'Input',
    show: false,
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
export const getDetailJVxeColumns = function (detailView) {
  const arr: any[] = [];
  arr.push(
    {
      title: '',
      key: 'id',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '工单ID',
      key: 'moId',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '工单',
      key: 'moId_dictText',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '物料ID',
      key: 'prodId',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '物料编码',
      key: 'prodId_dictText',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '物料名称',
      key: 'prodName_dictText',
      type: JVxeTypes.input,
      disabled: true,
    },
    {
      title: '数量',
      key: 'qty',
      type: JVxeTypes.inputNumber,
      placeholder: '请输入${title}',
      defaultValue: '0',
      validateRules: [
        { required: true, message: '${title}不能为空' },
        {
          handler: ({ cellValue, row }, callback) => {
            if (cellValue <= 0) {
              callback(false, '${title}必须大于0');
            } else if (cellValue < row.pickedQty) {
              callback(false, '${title}不能小于已领料数量！');
            } else callback(true);
          },
          message: '${title}必须大于0',
        },
      ],
    }
    /*{
      title: '仓库',
      key: 'whId',
      type: JVxeTypes.selectDictCustomSearch,
      method: 'get',
      url: '/warehouse/basWarehouse/list',
      params: { column: 'code', order: 'asc', searchFields: 'code,name' },
      columns: [
        {
          name: '编码',
          code: 'code',
        },
        {
          name: '名称',
          code: 'name',
        },
      ],
      rowKey: 'id',
      labelKey: 'name',
      placeholder: '请输入${title}',
      formatter: ({ cellValue, row, column }) => {
        return row[column.params.key + '_dictText'] || cellValue;
      },
    },*/
  );

  if (!!detailView) {
    arr.push(
      {
        title: '已领料数量',
        key: 'pickedQty',
        defaultValue: '0',
        type: JVxeTypes.inputNumber,
        width: 120,
      },
      /*{
        title: '仓库',
        key: 'whId_dictText',
        type: JVxeTypes.input,
        width: 160,
      },*/
      {
        title: '状态',
        key: 'status_dictText',
        type: JVxeTypes.input,
      },
      {
        title: '领料时间',
        key: 'actualPickDate',
        type: JVxeTypes.input,
      },
      {
        title: '领料操作人',
        key: 'actualPickBy_dictText',
        type: JVxeTypes.input,
      },
      {
        title: 'ERP行号',
        key: 'erpLineNo',
        type: JVxeTypes.input,
        visible: false,
      }
    );
  }

  return arr;
};

//明细查询配置
export const detailSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'product_pick_detail_status',
    },
    colProps: { span: 6 },
  },
];

//子表列表配置
export const detailBasicColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
  },
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moCode',
    ifShow: false,
  },
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '已领料数量',
    align: 'center',
    dataIndex: 'pickedQty',
  },
  /*{
    title: '仓库',
    align: 'center',
    dataIndex: 'whId_dictText',
  },*/
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status_dictText',
  },
  {
    title: '领料时间',
    align: 'center',
    dataIndex: 'actualPickDate',
    /*customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },*/
  },
  {
    title: '领料操作人',
    align: 'center',
    dataIndex: 'actualPickBy_dictText',
  },
  {
    title: 'ERP行号',
    align: 'center',
    dataIndex: 'erpLineNo',
    ifShow: false,
  },
];

//收料表单配置
export const detailReceiveFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '领料单号',
    field: 'pickId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '已领料数量',
    field: 'pickedQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '领料数量',
    field: 'pickQty',
    component: 'InputNumber',
    dynamicRules: ({ model, values, schema }) => {
      return [
        { required: true, message: '请输入领料数量！' },
        {
          required: false,
          validator: (_, value) => {
            if (value && value > Number(values.qty) - Number(values.pickedQty)) {
              return Promise.reject('领料数量不能大于未领料数量！');
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'change',
        },
      ];
    },
  },
];

//撤回表单配置
export const detailRevokeFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '领料单号',
    field: 'pickId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '已领料数量',
    field: 'pickedQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '撤回数量',
    field: 'revokeQty',
    component: 'InputNumber',
    dynamicRules: ({ model, values, schema }) => {
      return [
        { required: true, message: '请输入撤回数量！' },
        {
          required: false,
          validator: (_, value) => {
            if (value && value > Number(values.pickedQty)) {
              return Promise.reject('撤回数量不能大于已领料数量！');
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'change',
        },
      ];
    },
  },
];
