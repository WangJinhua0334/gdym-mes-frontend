import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '设备编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '设备名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '设备分类',
    align: 'center',
    sorter: true,
    dataIndex: 'equipTypeId_dictText',
    width: 150,
  },
  {
    title: '设备状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'equipment_status', true);
    },
  },
  {
    title: '供应商',
    align: 'center',
    sorter: true,
    dataIndex: 'suppId_dictText',
  },
  {
    title: '出厂时间',
    align: 'center',
    sorter: true,
    dataIndex: 'purchaseTime',
    width: 200,
  },
  {
    title: '出厂编码',
    align: 'center',
    sorter: true,
    dataIndex: 'fixedAssetsCode',
    width: 200,
  },
  {
    title: '车间',
    align: 'center',
    sorter: true,
    dataIndex: 'workShopId_dictText',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '设备分类',
    field: 'equipTypeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basEquipmentType/list',
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
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        //maxTagCount: 2,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '设备编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '设备名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '设备状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equipment_status',
    },
    colProps: { span: 6 },
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
        url: '/basic/basSupplier/list',
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
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: true,
        maxTagCount: 2,
        placeholder: '请输入',
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basWorkShop/list',
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
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: true,
        maxTagCount: 2,
        placeholder: '请输入',
      };
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '设备分类',
    field: 'equipTypeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basEquipmentType/list',
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
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        //linkmap: [{ name: 'workShopName_dictText' }],
        placeholder: '请输入',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择设备分类!' }];
    },
  },
  {
    label: '设备编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入设备编码!' }];
    },
  },
  {
    label: '设备名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入设备名称!' }];
    },
  },
  {
    label: '设备状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equipment_status',
    },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basSupplier/list',
        params: {
          /*code: '${code}'*/
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
            title: '全称',
            align: 'center',
            dataIndex: 'fullName',
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
        labelKey: ['name'],
        placeholder: '请选择',
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择供应商!' }];
    },
  },
  {
    label: '出厂时间',
    field: 'purchaseTime',
    component: 'DatePicker',
  },
  {
    label: '出厂编码',
    field: 'fixedAssetsCode',
    component: 'Input',
  },
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basWorkShop/list',
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
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
      };
    },
  },
  {
    label: '存放地址',
    field: 'location',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '规格型号',
    field: 'specification',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  {
    label: '设备图片',
    field: 'images',
    component: 'JImageUpload',
    componentProps: {},
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {
      maxCount: 10,
    },
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
