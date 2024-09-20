import { ref, unref } from 'vue';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

export const wkpId = ref<string>('');

export const action = ref<string>('');

export const scanFunc = ref<any>(null);

/**物料绑定表单配置 */
export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '生产任务',
    field: 'moPlanCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '工序',
    field: 'title',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '加工物料',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/queryBasWorkPostEquipPageByMainId',
        params: { column: 'createTime', order: 'asc' /*, searchFields: 'code,name', code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'equipId_dictText',
          },
          {
            name: '名称',
            code: 'equipName_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'equipId',
        labelKey: ['equipName_dictText'],
        placeholder: '请输入',
        multi: false,
        queryBefore: (params) => {
          params.id = unref(wkpId);
          return params;
        },
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '物料条码',
    field: 'materialSn',
    component: 'Input',
    componentProps: {
      placeholder: '请扫描物料条码',
      onkeydown: (e) => {
        if (e.key != 'Enter') return;
        if (unref(scanFunc)) {
          unref(scanFunc)(e.target.value);
        }
      },
    },
    colProps: { span: 24 },
  },
];
/**物料绑定列表配置 */
export const tableColums: JVxeColumn[] = [
  {
    title: '主键',
    key: 'id',
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
    key: 'prodCode',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '物料名称',
    key: 'prodName',
    type: JVxeTypes.input,
    disabled: true,
    width: 400,
  },
  {
    title: '绑定数量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    disabled: true,
    width: 100,
  },
  {
    title: '物料条码',
    key: 'materialSn',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '物料批次',
    key: 'materialBatch',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    disabled: true,
    width: 200,
  },
  /*{
    title: '附件',
    key: 'image',
    type: JVxeTypes.file,
    allowRemove: false,
    disabled: true,
  },*/
  {
    title: '操作',
    key: 'action',
    type: JVxeTypes.slot,
    slotName: 'action',
    align: 'left',
    fixed: 'right',
    minWidth: 120,
  },
];

/**手动绑定表单配置 */
export const bindFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '物料条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      placeholder: '请扫描物料条码',
      onkeydown: (e) => {
        if (e.key != 'Enter') return;

        if (unref(scanFunc)) {
          unref(scanFunc)(e.target.value);
        }
      },
    },
    colProps: { span: 24 },
  },
  {
    label: '物料批次',
    field: 'batch',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入替换数量!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '物料来源类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_src_type',
    },
    colProps: { span: 24 },
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
    ifShow: ({ values }) => {
      if (values.type == null || values.type === '') {
        return false;
      }

      return values.type != 'product';
    },
    colProps: { span: 24 },
  },
  {
    label: '设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/queryBasWorkPostEquipPageByMainId',
        params: { column: 'createTime', order: 'asc' /*, searchFields: 'code,name', code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'equipId_dictText',
          },
          {
            name: '名称',
            code: 'equipName_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'equipId',
        labelKey: ['equipName_dictText'],
        placeholder: '请输入',
        multi: false,
        queryBefore: (params) => {
          params.id = unref(wkpId);
          return params;
        },
      };
    },
    ifShow: ({}) => {
      return unref(action) == 'bind' || unref(action) == 'bindReplace';
    },
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
    ifShow: ({}) => {
      return unref(action) == 'bind' || unref(action) == 'detail';
    },
  },
  {
    label: '替换原因',
    field: 'reason',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入替换原因!' }];
    },
    ifShow: ({}) => {
      return unref(action) == 'bindReplace';
    },
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
];

/**解绑表单配置 */
export const unbindFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入解绑数量!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '原因',
    field: 'reason',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入解绑原因!' }];
    },
    colProps: { span: 24 },
  },
];

/**附件表单配置 */
export const attachmentsFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUpload',
    /*component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },*/
    colProps: { span: 24 },
  },
];
