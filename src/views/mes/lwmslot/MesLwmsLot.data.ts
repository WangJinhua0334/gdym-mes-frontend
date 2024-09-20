import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/src/types';
import { getSnQty } from '/@/views/mes/lwmslot/MesLwmsLot.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料条码',
    align: 'center',
    dataIndex: 'lwmsSn',
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodIdCode_dictText',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '物料规格',
    align: 'center',
    dataIndex: 'prodIdSpecification_dictText',
  },
  {
    title: '批次号',
    align: 'center',
    dataIndex: 'batchNo',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'supplierId_dictText',
  },
  // {
  //   title: '出库数量',
  //   align: 'center',
  //   dataIndex: 'qty',
  // },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'JInput',
    componentProps: {
      type: 'like',
    },
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
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '物料',
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
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'specification',
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
        linkmap: [{ name: 'prodName', specification: 'specification', code: 'prodCode' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择物料编码!' }];
    },
  },
  {
    label: '批次号',
    field: 'batchNo',
    component: 'Input',
  },
  {
    label: '物料编码',
    field: 'prodCode',
    component: 'Input',
    show: false,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    show: false,
  },
  {
    label: '是否可以修改数量',
    field: 'hasEditQty',
    component: 'Input',
    show: false,
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料规格',
    field: 'specification',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    show: false,
  },
  {
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
        linkmap: [{ code: 'moCode' }],
        placeholder: '请选择',
        multi: false,
        getPopupContainer: (node) => node.parentNode,
      };
    },
  },
  {
    label: '供应商',
    field: 'supplierId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: {},
        columns: [
          {
            title: '供应商编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '供应商名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '供应商编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '供应商名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择供应商',
        linkmap: [{ name: 'supplierName' }],
      };
    },
  },
  {
    label: '供应商',
    field: 'supplierName',
    component: 'Input',
    show: false,
  },
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    show: false,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请扫描物料条码!' }];
    },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, submit } = formActionType;
      return {
        placeholder: '请扫描物料条码',
        onkeyup: function (e) {
          if (e.key == 'Enter') {
            const sn = e?.target?.value;

            getSnQty(sn).then((res) => {
              setFieldsValue({ lwmsSn: sn, qty: res || 1, hasEditQty: !res });
              submit();
            });
          }
        },
      };
    },
    colProps: { span: 12 },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

export const lwmsLotBindingJVxeColumns = [
  {
    title: '物料条码',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'lwmsSn',
    key: 'lwmsSn',
    disabled: true,
  },
  {
    title: '批次号',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: '物料编码',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'prodCode',
    key: 'prodCode',
    disabled: true,
  },
  {
    title: '物料名称',
    width: 250,
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'prodName',
    key: 'prodName',
    disabled: true,
  },
  {
    title: '工单',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'moCode',
    key: 'moCode',
    disabled: true,
  },
  {
    title: '供应商',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'supplierName',
    key: 'supplierName',
    disabled: true,
  },
  {
    title: '供应商ID',
    align: 'center',
    type: JVxeTypes.hidden,
    dataIndex: 'supplierId',
    key: 'supplierId',
  },
  {
    title: '数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'qty',
    key: 'qty',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler({ cellValue }, callback) {
          if (cellValue <= 0) {
            callback(false, '${title}不能小于等于0'); // false = 未通过校验
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
export const lwmsLotGenerateJVxeColumns = [
  {
    title: '物料编码',
    width: 200,
    key: 'prodCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/product/basProduct/list',
    params: {
      /*code: '${code}',*/
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
      {
        title: '版本',
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: '规格',
        align: 'center',
        dataIndex: 'specification',
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
    rowKey: 'code',
    labelKey: ['code'],
    linkmap: [{ id: 'prodId', name: 'prodName', specification: 'specification' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '物料名称',
    width: 250,
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'prodName',
    key: 'prodName',
    disabled: true,
  },
  {
    title: '工单',
    width: 150,
    key: 'moCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/mo/mesMo/list',
    params: {
      /*code: '${code}',*/
    },
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
    rowKey: 'code',
    labelKey: ['code'],
    placeholder: '请输入${title}',
    linkmap: [{ id: 'moId' }],
  },
  // {
  //   title: '数量',
  //   align: 'center',
  //   type: JVxeTypes.input,
  //   dataIndex: 'qty',
  //   key: 'qty',
  // },
  {
    title: '批次号',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: '数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'qtyValue',
    key: 'qtyValue',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '最小包装数',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'minQty',
    key: 'minQty',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler({ cellValue, row }, callback) {
          if (cellValue > row.qtyValue) {
            callback(false, '${title}不能小于数量'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '供应商',
    width: 200,
    key: 'supplierCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/supplier/basSupplier/list',
    params: {
      /*code: '${code}',*/
    },
    columns: [
      {
        title: '供应商编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '供应商名称',
        align: 'center',
        dataIndex: 'name',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '供应商编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '供应商名称',
        mode: 'single',
        view: 'string',
      },
    ],
    rowKey: 'name',
    labelKey: ['name'],
    placeholder: '请输入${title}',
    linkmap: [{ id: 'supplierId' }],
  },
  {
    title: '供应商ID',
    align: 'center',
    type: JVxeTypes.hidden,
    dataIndex: 'supplierId',
    key: 'supplierId',
  },
  {
    title: '备注',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'remark',
    key: 'remark',
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

export const lwmsLotGenerateJVxeColumnsByMo = [
  {
    title: '物料编码',
    width: 200,
    key: 'prodCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/product/basProduct/list',
    params: {
      /*code: '${code}',*/
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
      {
        title: '版本',
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: '规格',
        align: 'center',
        dataIndex: 'specification',
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
    rowKey: 'code',
    labelKey: ['code'],
    linkmap: [{ id: 'prodId', name: 'prodName', specification: 'specification' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    disabled: true,
  },
  {
    title: '物料名称',
    width: 250,
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'prodName',
    key: 'prodName',
    disabled: true,
  },
  {
    title: '是否关键料',
    key: 'isKeypart',
    width: 120,
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
    disabled: true,
  },
  {
    title: '是否加工',
    key: 'isProduct',
    width: 120,
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'productSwitch',
    disabled: true,
  },
  {
    title: '工单',
    width: 150,
    key: 'moCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/mo/mesMo/list',
    params: {
      /*code: '${code}',*/
    },
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
    rowKey: 'code',
    labelKey: ['code'],
    placeholder: '请输入${title}',
    linkmap: [{ id: 'moId' }],
    disabled: true,
  },
  // {
  //   title: '数量',
  //   align: 'center',
  //   type: JVxeTypes.input,
  //   dataIndex: 'qty',
  //   key: 'qty',
  // },
  {
    title: '批次号',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: '数量',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'qtyValue',
    key: 'qtyValue',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '最小包装数',
    align: 'center',
    type: JVxeTypes.inputNumber,
    dataIndex: 'minQty',
    key: 'minQty',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler({ cellValue, row }, callback) {
          if (cellValue > row.qtyValue) {
            callback(false, '${title}不能小于数量'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '供应商',
    width: 200,
    key: 'supplierCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/supplier/basSupplier/list',
    params: {
      /*code: '${code}',*/
    },
    columns: [
      {
        title: '供应商编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '供应商名称',
        align: 'center',
        dataIndex: 'name',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '供应商编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '供应商名称',
        mode: 'single',
        view: 'string',
      },
    ],
    rowKey: 'name',
    labelKey: ['name'],
    placeholder: '请输入${title}',
    linkmap: [{ id: 'supplierId' }],
  },
  {
    title: '供应商ID',
    align: 'center',
    type: JVxeTypes.hidden,
    dataIndex: 'supplierId',
    key: 'supplierId',
  },
  {
    title: '备注',
    align: 'center',
    type: JVxeTypes.input,
    dataIndex: 'remark',
    key: 'remark',
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
  return formSchema;
}
