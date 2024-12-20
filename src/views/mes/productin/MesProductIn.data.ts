import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '申请单号',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    width: 300,
    dataIndex: 'prodName_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mes_prod_in_status', true);
    },
  },
  {
    title: '计划入库时间',
    align: 'center',
    dataIndex: 'planInDate',
    width: 150,
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '库位',
    align: 'center',
    dataIndex: 'whBinId_dictText',
  },
  {
    title: '是否完成',
    align: 'center',
    dataIndex: 'isComplete',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '完成时间',
    align: 'center',
    dataIndex: 'completeDate',
    width: 150,
  },
  {
    title: '完成操作人',
    align: 'center',
    dataIndex: 'completeBy_dictText',
    width: 150,
  },
  {
    title: 'ERP单号',
    align: 'center',
    dataIndex: 'erpNo',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '申请单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '是否完成',
    field: 'isComplete',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId_dictText',
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
  {
    label: '总计数量',
    field: 'qty',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '计划入库时间',
    field: 'planInDate',
    component: 'DatePicker',
    componentProps: {
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true }];
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
//子表单数据
//子表列表数据
export const mesProductInDetailColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '条码',
    align: 'center',
    width: 150,
    dataIndex: 'lotSn',
  },
  {
    title: '生产批次',
    align: 'center',
    dataIndex: 'batch',
    width: 150,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '仓库',
    align: 'center',
    dataIndex: 'whId_dictText',
    width: 150,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 150,
  },
  {
    title: '入库时间',
    align: 'center',
    dataIndex: 'actualInDate',
    width: 150,
  },
  {
    title: '入库操作人',
    align: 'center',
    dataIndex: 'actualInBy_dictText',
    width: 150,
  },
  {
    title: 'ERP行号',
    align: 'center',
    dataIndex: 'erpLineNo',
  },
];
//入库
export const stockFormSchema: FormSchema[] = [
  {
    label: '库位',
    field: 'whBinId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehousearea/basWarehouseBin/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,whQuery' /*, code: '${code}'*/ },
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
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
        queryBefore: function (currentParams) {
          //currentParams.whQuery = 'waitInsp';
          return currentParams;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择库位!' }];
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
