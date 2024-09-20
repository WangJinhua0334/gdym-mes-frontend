import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: 'BOM版本',
    align: 'center',
    sorter: true,
    dataIndex: 'version',
  },
  {
    title: '是否默认',
    align: 'center',
    sorter: true,
    dataIndex: 'isDefault_dictText',
  },
  {
    title: '是否启用',
    align: 'center',
    sorter: true,
    dataIndex: 'isEnable_dictText',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: 'BOM明细列表',
    align: 'center',
    dataIndex: 'bomDetailLsit',
    slots: { customRender: 'bomDetailSlot' },
    width: 120,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '产品编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '产品名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 12 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品编码',
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
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName_dictText' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择产品!' }];
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: 'BOM版本',
    field: 'version',
    defaultValue: '1.0',
    component: 'InputNumber',
    componentProps: { addonBefore: 'V', precision: 1 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入BOM版本!' }];
    },
  },
  {
    label: '是否默认',
    field: 'isDefault',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//查询数据
export const basProductBomDetailSearchFormSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '是否关键料',
    field: 'isKeypart',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 6 },
  },
];
//子表列表数据
export const basProductBomDetailColumns: BasicColumn[] = [
  {
    title: '顺序',
    align: 'left',
    sorter: true,
    dataIndex: 'sequence',
    width: 150,
  },
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodCode',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName',
  },
  {
    title: '用量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitDesc',
  },

  {
    title: '是否关键料',
    align: 'center',
    sorter: true,
    dataIndex: 'isKeypartDesc',
  },
  {
    title: '位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//子表表单数据
export const basProductBomDetailFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'bomId',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'parentId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料编码',
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
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName', isKey: 'isKeypart', unitId: 'unitId' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料!' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '用量',
    field: 'qty',
    defaultValue: 1,
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入用量!' },
        { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' },
      ];
    },
  },
  {
    label: '损耗率',
    field: 'lossRate',
    defaultValue: 0,
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [ { pattern: /^-?\d+\.?\d*$/, message: '请输入损耗率!' } ];
    },
  },
  {
    label: '单位',
    field: 'unitId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
          {
            name: '是否默认',
            code: 'isDefault_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择单位!' }];
    },
  },
  {
    label: '是否关键料',
    field: 'isKeypart',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];
//子表表单数据--添加子级物料信息
export const basProductBomDetailFormSchemaByParent: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'bomId',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'parentId',
    component: 'Input',
    show: false,
  },
  {
    label: '父级物料名称',
    field: 'parentProdName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料编码',
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
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName', isKey: 'isKeypart', unitId: 'unitId' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料!' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '用量',
    field: 'qty',
    defaultValue: 1,
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入用量!' },
        { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' },
      ];
    },
  },
  {
    label: '损耗率',
    field: 'lossRate',
    defaultValue: 0,
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [ { pattern: /^-?\d+\.?\d*$/, message: '请输入损耗率!' } ];
    },
  },
  {
    label: '单位',
    field: 'unitId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
          {
            name: '是否默认',
            code: 'isDefault_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择单位!' }];
    },
  },
  {
    label: '是否关键料',
    field: 'isKeypart',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];
