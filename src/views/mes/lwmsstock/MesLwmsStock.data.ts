import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { queryByLwmsSn, queryWhBinIdTree } from '/@/views/mes/lwmsstock/MesLwmsStock.api';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/src/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '仓库',
    align: 'center',
    dataIndex: 'whId_dictText',
    width: 150,
  },
  {
    title: '区域',
    align: 'center',
    dataIndex: 'whAreaId_dictText',
    width: 150,
  },
  {
    title: '库位',
    align: 'center',
    dataIndex: 'whBinId_dictText',
    width: 150,
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'suppId_dictText',
    width: 200,
  },
  {
    title: '物料条码',
    align: 'center',
    dataIndex: 'lwmsSn',
    width: 150,
  },
  {
    title: '物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 200,
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodIdCode_dictText',
    width: 150,
  },
  {
    title: '物料规格',
    align: 'center',
    dataIndex: 'prodIdSpecification_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '入库人',
    align: 'center',
    dataIndex: 'warehousingBy_dictText',
    width: 150,
  },
  {
    title: '出库人',
    align: 'center',
    dataIndex: 'outStockBy_dictText',
    width: 150,
  },
  {
    title: '领用人',
    align: 'center',
    dataIndex: 'useBy_dictText',
    width: 150,
  },
  {
    title: '出库事由',
    align: 'center',
    dataIndex: 'reasonShipment',
  },
];
//列表数据
export const lwmsStockDetailColumns: BasicColumn[] = [
  {
    title: '类型',
    align: 'center',
    dataIndex: 'rdType',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'createBy',
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '库位',
    field: 'whBinId',
    component: 'ApiTreeSelect',
    componentProps: {
      api: queryWhBinIdTree,
      immediate: true,
      treeDefaultExpandAll: true,
    },
  },
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码',
    field: 'prodCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchemaMesLwmsPutStock: FormSchema[] = [
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请扫描物料条码!' }];
    },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        placeholder: '请扫描物料条码',
        onkeyup: async function (e) {
          if (e.key == 'Enter') {
            const value = e.target.value;
            const mesLwmsLot = await queryByLwmsSn(value);

            console.log('mesLwmsLot', mesLwmsLot);
            setFieldsValue({
              lwmsSn: value,
              prodId: mesLwmsLot.prodId,
              prodName: mesLwmsLot.prodId_dictText,
              prodCode: mesLwmsLot.prodIdCode_dictText,
              whBinId: mesLwmsLot.whBinId,
              hasWhBinId: !!mesLwmsLot.whBinId,
              qty: mesLwmsLot.qty,
              moId: mesLwmsLot.moId,
              hasChangeQuantity: mesLwmsLot.hasChangeQuantity,
            });
          }
        },
      };
    },
  },
  {
    label: '库位',
    field: 'whBinId',
    component: 'ApiTreeSelect',
    componentProps: {
      api: queryWhBinIdTree,
      immediate: true,
      treeDefaultExpandAll: true,
    },
    dynamicDisabled: ({ values }) => {
      return !!values.hasWhBinId;
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择库位!' }];
    },
  },
  {
    label: '物料编码',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入物料!' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入物料!' }];
    },
  },
  {
    label: '物料ID',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  {
    label: '库位是否可修改',
    field: 'hasWhBinId',
    component: 'Input',
    show: false,
  },
  {
    label: '数量是否可修改',
    field: 'hasChangeQuantity',
    component: 'Input',
    show: false,
  },
  {
    label: '工单',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    componentProps: {},
    dynamicDisabled: ({ values }) => {
      return !values.hasChangeQuantity;
    },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: false,
      };
    },
    colProps: { span: 24 },
  },
  {
    label: '入库人',
    field: 'warehousingBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'InputNumber',
    show: false,
  },
];

//表单数据
export const formSchemaMesLwmsOutStockModal: FormSchema[] = [
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请扫描物料条码!' }];
    },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        placeholder: '请扫描物料条码',
        onkeyup: async function (e) {
          if (e.key == 'Enter') {
            const value = e.target.value;
            const mesLwmsLot = await queryByLwmsSn(value);
            setFieldsValue({
              lwmsSn: value,
              sn: value,
              prodId: mesLwmsLot.prodId,
              prodName: mesLwmsLot.prodId_dictText,
              prodCode: mesLwmsLot.prodIdCode_dictText,
              whBinId_dictText: mesLwmsLot.whBinId_dictText,
              qty_demo: mesLwmsLot.qty,
            });
          }
        },
      };
    },
  },
  {
    label: '',
    field: 'sn',
    component: 'Input',
    show: false,
  },
  {
    label: '库位',
    field: 'whBinId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择库位!' }];
    },
  },
  {
    label: '物料编码',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入物料!' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入物料!' }];
    },
  },
  {
    label: '物料ID',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  {
    label: '库存数量',
    field: 'qty_demo',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '数量',
    field: 'outQty',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入数量' }];
    },
  },
  {
    label: '出库人',
    field: 'outStockBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  {
    label: '领用人',
    field: 'useBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  {
    label: '出库事由',
    field: 'reasonShipment',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'InputNumber',
    show: false,
  },
];

//表单数据
export const formSchemaMesLwmsNoCodePutStockModal: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, submit } = formActionType;
      return {
        placeholder: '请扫描工单',
        onkeyup: async function (e) {
          if (e.key == 'Enter') {
            const value = e.target.value;
            setFieldsValue({
              moId: value,
            });
            submit();
          }
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请扫描工单!' }];
    },
  },
  {
    label: '入库人',
    field: 'warehousingBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
];

export const noCodePutStockTableJVxeColumns = [
  {
    title: '供应商',
    key: 'suppLabel',
    type: JVxeTypes.selectDictCustomSearch,
    width: '150px',
    method: 'get',
    url: '/supplier/basSupplier/list',
    params: { column: 'code', order: 'asc', /*code: '${code}',*/ searchFields: 'code,name' },
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
    multi: false,
    rowKey: 'id',
    labelKey: 'name',
    placeholder: '请输入${title}',
    linkmap: [{ id: 'suppId' }],
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '库位',
    key: 'whBinLabel',
    type: JVxeTypes.selectDictCustomSearch,
    width: '500px',
    method: 'get',
    url: '/lwmsstock/mesLwmsStock/queryWhBinId',
    params: { column: 'code', order: 'asc', /*code: '${code}',*/ searchFields: 'code,name' },
    columns: [
      {
        name: '仓库',
        code: 'whName',
      },
      {
        name: '区域',
        code: 'wareaName',
      },
      {
        name: '库位',
        code: 'wbinName',
      },
    ],
    rowKey: 'id',
    labelKey: 'wbinName',
    linkmap: [{ wbinName: 'wbinName_dictText', id: 'whBinId' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '物料条码',
    key: 'lwmsSn',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '物料编码',
    key: 'prodCode',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '物料名称',
    align: 'center',
    type: JVxeTypes.input,
    key: 'prodName',
    disabled: true,
  },
  {
    title: '入库数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    key: 'qty',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler({ cellValue }, callback) {
          if (cellValue <= 0) {
            callback(false, '${title}不能为0'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '操作',
    key: 'action',
    width: '100px',
    // 固定在右侧
    fixed: 'right',
    // 对齐方式为居中
    align: 'center',
    // 组件类型定义为【插槽】
    type: JVxeTypes.slot,
    // slot 的名称，对应 v-slot 冒号后面和等号前面的内容
    slotName: 'action',
  },
];

//表单数据
export const formSchemaMesLwmsNoCodeOutStockModal: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, submit } = formActionType;
      return {
        placeholder: '请扫描工单',
        onkeyup: async function (e) {
          if (e.key == 'Enter') {
            const value = e.target.value;
            setFieldsValue({
              moId: value,
            });
            submit();
          }
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择工单!' }];
    },
  },

  {
    label: '出库人',
    field: 'outStockBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  {
    label: '领用人',
    field: 'useBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  {
    label: '出库事由',
    field: 'reasonShipment',
    component: 'InputTextArea',
  },
];

export const noCodeOutStockTableJVxeColumns = [
  {
    title: '库位',
    key: 'whBinId_dictText',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'whBinId_dictText',
    disabled: true,
  },
  {
    title: '物料条码',
    key: 'lwmsSn',
    type: JVxeTypes.input,
    dataIndex: 'lwmsSn',
    disabled: true,
  },
  {
    title: '物料编码',
    key: 'prodCode',
    type: JVxeTypes.input,
    dataIndex: 'prodCode',
    disabled: true,
  },
  {
    title: '物料名称',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'prodName',
    key: 'prodName',
    disabled: true,
  },
  {
    title: '库存数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'qty',
    key: 'qty',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '出库数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'outQty',
    key: 'outQty',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler({ cellValue }, callback) {
          if (cellValue <= 0) {
            callback(false, '${title}不能为0'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '操作',
    key: 'action',
    width: '100px',
    // 固定在右侧
    fixed: 'right',
    // 对齐方式为居中
    align: 'center',
    // 组件类型定义为【插槽】
    type: JVxeTypes.slot,
    // slot 的名称，对应 v-slot 冒号后面和等号前面的内容
    slotName: 'action',
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return [];
}
