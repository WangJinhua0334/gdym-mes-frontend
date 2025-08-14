import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import dayjs from 'dayjs';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '退料单号',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 160,
  },
  {
    title: '退料类型',
    align: 'center',
    sorter: true,
    dataIndex: 'type_dictText',
    width: 120,
  },
  {
    title: '计划退料时间',
    align: 'center',
    sorter: true,
    dataIndex: 'planReturnDate',
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
    sorter: true,
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      return render.renderDict(text, 'product_return_status', true);
    },
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
    dataIndex: 'submitBy_dictText',
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
    dataIndex: 'completeBy_dictText',
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
    label: '退料单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '退料类型',
    field: 'type',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'product_return_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'product_return_status',
    },
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '退料单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.id;
    },
    colProps: { span: 24 },
  },
  {
    label: '退料类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'product_return_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入退料类型!' }];
    },
  },
  {
    label: '计划退料时间',
    field: 'planReturnDate',
    defaultValue: dayjs().subtract(1, 'day'),
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
      title: '工单',
      key: 'moId',
      type: JVxeTypes.popupCustom,
      method: 'get',
      url: '/mo/mesMo/list',
      params: {
        column: 'code',
        order: 'desc',
        /*code: '${code}',*/
      },
      columns: [
        {
          title: '工单号',
          align: 'center',
          dataIndex: 'code',
        },
        {
          title: '产品编码',
          align: 'center',
          dataIndex: 'prodId_dictText',
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'prodName_dictText',
        },
      ],
      queryInfo: [
        {
          field: 'code',
          label: '工单号',
          mode: 'single',
          view: 'string',
        },
        {
          field: 'prodQuery',
          label: '产品',
          mode: 'single',
          view: 'string',
        },
      ],
      rowKey: 'id',
      labelKey: 'code',
      multi: false,
      linkmap: [{ code: 'moCode' }],
      placeholder: '请输入${title}',
      validateRules: [{ required: true, message: '${title}不能为空' }],
      /*queryBefore: (params) => {
        params.code = '123';
      },*/
      formatter: ({ cellValue, row, column }) => {
        return row[column.params.key + '_dictText'] || cellValue;
      },
      width: 240,
    },
    {
      title: '工单号',
      key: 'moCode',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '物料编码',
      key: 'prodId',
      type: JVxeTypes.popupCustom,
      method: 'get',
      url: '/mo/mesMoBom/list',
      params: {
        moId: '${moId}',
      },
      columns: [
        {
          title: '物料编码',
          align: 'center',
          dataIndex: 'prodId_dictText',
        },
        {
          title: '物料名称',
          align: 'center',
          dataIndex: 'prodName_dictText',
        },
        {
          title: '需求量',
          align: 'center',
          dataIndex: 'requireQty',
        },
        {
          title: '已领料数量',
          align: 'center',
          dataIndex: 'issuedQty',
        },
      ],
      queryInfo: [
        {
          field: 'productCode',
          label: '物料编码',
          mode: 'single',
          view: 'string',
        },
        {
          field: 'productName',
          label: '物料名称',
          mode: 'single',
          view: 'string',
        },
      ],
      rowKey: 'prodId',
      labelKey: 'prodId_dictText',
      multi: false,
      linkmap: [{ prodName_dictText: 'prodName_dictText', unitId: 'unitId' }],
      placeholder: '请输入${title}',
      validateRules: [{ required: true, message: '${title}不能为空' }],
      /*queryBefore: (params) => {
        params.code = '123';
      },*/
      formatter: ({ cellValue, row, column }) => {
        return row[column.params.key + '_dictText'] || cellValue;
      },
      width: 240,
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
        },
      ],
    },
    {
      title: '单位',
      key: 'unitId',
      type: JVxeTypes.selectSearch,
      dictCode: 'bas_unit,name,id',
      width: 200,
      placeholder: '请输入${title}',
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
    }*/
  );

  if (!!detailView) {
    arr.push(
      {
        title: '已退料数量',
        key: 'returnedQty',
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
        title: '退料时间',
        key: 'actualReturnDate',
        type: JVxeTypes.input,
      },
      {
        title: '退料操作人',
        key: 'actualReturnBy_dictText',
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

// 子表查询配置
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
      dictCode: 'product_return_detail_status',
    },
    colProps: { span: 6 },
  },
];
//子表列表数据
export const detailColumns: BasicColumn[] = [
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
    title: '已退料数量',
    align: 'center',
    dataIndex: 'returnedQty',
  },
  /*{
    title: '仓库',
    align: 'center',
    dataIndex: 'whId_dictText',
  },*/
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
  },
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'product_return_detail_status', true);
    },
  },
  {
    title: '退料时间',
    align: 'center',
    dataIndex: 'actualReturnDate',
    /*customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },*/
  },
  {
    title: '退料操作人',
    align: 'center',
    dataIndex: 'actualReturnBy_dictText',
  },
  {
    title: 'ERP行号',
    align: 'center',
    dataIndex: 'erpLineNo',
    ifShow: false,
  },
];

//退料表单配置
export const detailReturnFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '退料单号',
    field: 'returnId_dictText',
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
    label: '已退料数量',
    field: 'returnedQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '退料数量',
    field: 'returnQty',
    component: 'InputNumber',
    dynamicRules: ({ model, values, schema }) => {
      return [
        { required: true, message: '请输入退料数量！' },
        {
          required: false,
          validator: (_, value) => {
            if (value && value > Number(values.qty) - Number(values.returnedQty)) {
              return Promise.reject('退料数量不能大于未退料数量！');
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
