import { ref, unref } from 'vue';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

export const wkpId = ref<string>('');
export const samplingQty = ref();

export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '生产任务',
    field: 'moPlanCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '工序',
    field: 'title',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '加工物料',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '检验方案',
    field: 'schemaDesc',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '检验标准类型',
    field: 'schemaStdDesc',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '抽样数量',
    field: 'samplingQty',
    component: 'InputNumber',
    colProps: { span: 8 },
    componentProps: {
      onkeyup: function (e) {
        //scanSn.value = e.target.value;
        samplingQty.value = e.target.value;
      },
    },
  },
  {
    label: '结果',
    field: 'result',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: ({ formModel, formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        dictCode: 'is_open',
        onChange: (e: any) => {
          if (e === 'N') {
            formModel.defectIds = null;
          }
        },
      };
    },
    colProps: { span: 8 },
  },
  {
    label: '不良数量',
    field: 'ngQty',
    component: 'InputNumber',
    colProps: { span: 8 },
    ifShow: ({ values }) => {
      return !!values.result && values.result === 'N';
    },
  },
  {
    label: '缺陷代码',
    field: 'defectIds',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/defecttype/basDefect/list',
        params: {},
        columns: [
          {
            title: '缺陷类型',
            align: 'center',
            dataIndex: 'defectTypeId_dictText',
          },
          {
            title: '缺陷代码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '缺陷代码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'description',
            label: '描述',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'type',
            label: '缺陷类型',
            mode: 'single',
            view: 'string',
            fuzzy: false,
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['description'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        maxTagCount: 2,
        /*queryBefore: (params) => {
          return params;
        },*/
      };
    },
    ifShow: ({ values }) => {
      return !!values.result && values.result === 'N';
    },
    colProps: { span: 8 },
  },
  {
    label: '是否推送',
    field: 'isPush',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    colProps: { span: 8 },
  },
  {
    label: '消息接收人',
    field: 'ngUserBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'username,realname' },
        columns: [
          {
            name: '用户账号',
            code: 'username',
          },
          {
            name: '用户名称',
            code: 'realname',
          },
        ],
        isShowNum: true,
        rowKey: 'username',
        labelKey: ['realname'],
        multi: true,
        placeholder: '请选择',
      };
    },
    colProps: { span: 8 },
  },
  {
    label: '检验设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/basEquipment/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' },
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
        multi: true,
        queryBefore: (params) => {
          params.notStatus = 'discard';
          return params;
        },
      };
    },
    colProps: { span: 8 },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 16 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];

export const judTableColums: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '',
    key: 'unitId',
    type: JVxeTypes.hidden,
  },
  {
    title: '',
    key: 'stdItemId',
    type: JVxeTypes.hidden,
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    disabled: true,
    width: 120,
    minWidth: 120,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 250,
    minWidth: 250,
  },
  {
    title: '是否必填',
    key: 'isSuitable',
    disabled: true,
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    type: JVxeTypes.slot,
    align: 'center',
    slotName: 'mustSwitch',
    width: 120,
    minWidth: 120,
  },
  {
    title: '检验工具',
    key: 'inspTool',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
  {
    title: '检验依据',
    key: 'inspBasis',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
  {
    title: '技术要求',
    key: 'techRequirements',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
];

export const meaTableColums: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '',
    key: 'stdItemId',
    type: JVxeTypes.hidden,
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    disabled: true,
    width: 120,
    minWidth: 120,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 250,
    minWidth: 250,
  },
  {
    title: '是否必填',
    key: 'isSuitable',
    disabled: true,
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    type: JVxeTypes.slot,
    align: 'center',
    slotName: 'mustSwitch',
    width: 120,
    minWidth: 120,
  },
  {
    title: '检验工具',
    key: 'inspTool',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
  {
    title: '检验依据',
    key: 'inspBasis',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
  {
    title: '技术要求',
    key: 'techRequirements',
    type: JVxeTypes.textarea,
    disabled: true,
    width: 150,
  },
  {
    title: '下限比较符',
    key: 'minOperators',
    type: JVxeTypes.select,
    dictCode: 'lower_limit',
    disabled: true,
    width: 120,
    minWidth: 120,
  },
  {
    title: '下限',
    key: 'limitMin',
    type: JVxeTypes.inputNumber,
    disabled: true,
    width: 100,
    minWidth: 100,
  },
  {
    title: '上限比较符',
    key: 'maxOperators',
    type: JVxeTypes.select,
    dictCode: 'top_limit',
    disabled: true,
    width: 120,
    minWidth: 120,
  },
  {
    title: '上限',
    key: 'limitMax',
    type: JVxeTypes.inputNumber,
    disabled: true,
    width: 100,
    minWidth: 100,
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    width: 100,
    dictCode: 'bas_unit,name,id',
    defaultValue: '',
    disabled: true,
  },
];
