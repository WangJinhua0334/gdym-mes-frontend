import {FormSchema} from "@/components/Form";
import {JVxeTypes} from "@/components/jeecg/JVxeTable/types";
//酸洗扫码完工页面表单配置
export const getDetailJVxeColumns = function () {
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
      title: '物料ID',
      key: 'prodId',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '物料编码',
      key: 'prodId_dictText1',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '物料名称',
      key: 'prodId_dictText2',
      type: JVxeTypes.input,
      disabled: true,
    },
    {
      title: '规格型号',
      key: 'prodId_dictText3',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '钢卷号',
      key: 'prodId_dictText4',
      type: JVxeTypes.input,
      disabled: true,
    },
    {
      title: '重量',
      key: 'prodId_dictText5',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '条码',
      key: 'prodId_dictText6',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '流转去向',
      key: 'prodId_dictText7',
      type: JVxeTypes.input,
      disabled: true,
    },
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
  return arr;
};
//酸洗扫码完工新增弹框页面表单配置
export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '条码',
    field: 'licensePlateNumber1',
    component: 'Input',
  },
  {
    label: '钢卷号',
    field: 'licensePlateNumber2',
    component: 'Input',
  },
  /*{
    label: '工单',
    field: 'moId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mo/mesMo/list',
        params: {},
        columns: [
          {
            title: '工单号',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
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
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText',
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
            label: '产品编码',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择',
        multi: false,
        linkmap: [{ wkfId: 'wkfId' }],
        getPopupContainer: (node) => node.parentNode,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工单!' }];
    },
  },*/
  {
    label: '物料编码',
    field: 'licensePlateNumber3',
    component: 'Input',
  },
  {
    label: '物料名称',
    field: 'licensePlateNumber4',
    component: 'Input',
  },
  {
    label: '规格型号',
    field: 'licensePlateNumber5',
    component: 'Input',
  },
  {
    label: '重量',
    field: 'licensePlateNumber6',
    component: 'Input',
  },
  {
    label: '流转去向',
    field: 'licensePlateNumber7',
    component: 'Input',
  },
  /*{
    label: '工时',
    field: 'workHours',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '工作日加班',
    field: 'workHoursOvertime',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '休息日加班',
    field: 'restHours',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '节假日加班',
    field: 'holidaysHours',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '作业员',
    field: 'operateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入作业员!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
  },*/
];

//酸洗扫码完工页面表单配置
export function getFormSchema(): FormSchema[] {
  const retValue = [
    {
      label: '钢卷号',
      field: 'stock_emp_id',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name' /*, code: '${code}'*/ },
          //url: '/bas/basPlant/list',
          //params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}'},
          columns: [
            { name: '钢卷号', code: 'name' },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
          linkmap: [
            {
              code:'code',
              createTime: 'createTime',
            },
          ],
        };
      },
    },
    {
      label: '物料编码',
      field: 'code',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    {
      label: '规格型号',
      field: 'createTime',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    {
      label: '生产厂区',
      field: 'note',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name' /*, code: '${code}'*/ },
          //url: '/bas/basPlant/list',
          //params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}'},
          columns: [
            { name: '编码', code: 'id' },
            { name: '名称', code: 'name' },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
        };
      },
    },
    {
      label: '生产班组',
      field: 'licensePlateNumber',
      component: 'Input',
    },
    /*{
      label: '操作员',
      field: '操作员',
      component: 'Input',
    },*/
    {
      label: '开工时间',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '完工时间',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '标签重',
      field: 'note',
      component: 'Input',
    },
    {
      label: '实际重量',
      field: '实际重量',
      component: 'Input',
    },
    {
      label: '范围值',
      field: 'note',
      component: 'Input',
    },
    {
      label: '设备',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '要求查看',
      field: 'warehouseId',
      component: 'Input',
    },
  ];
  return retValue;
}
