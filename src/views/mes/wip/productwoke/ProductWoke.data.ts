import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

export const wkpId = ref<string>('');

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
    label: '条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '已报工数量',
    field: 'wokenQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '报工数量',
    field: 'wokeQty',
    component: 'InputNumber',
    componentProps: {
      //disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '报废数量',
    field: 'scrapedQty',
    component: 'InputNumber',
    componentProps: {
      //disabled: true,
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
        params: { column: 'createTime', order: 'asc' /*, code: '${code}'*/ },
        columns: [
          {
            name: '设备编码',
            code: 'equipId_dictText',
          },
          {
            name: '设备名称',
            code: 'equipName_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'equipId',
        labelKey: ['equipName_dictText'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        //maxTagCount: 2,
        queryBefore: (params) => {
          params.id = wkpId.value ?? -1;
          return params;
        },
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '开工时间',
    field: 'startTime',
    defaultValue: new Date(),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      disabled: true,
    },
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请输入开工时间!' }];
    // },
    colProps: { span: 12 },
  },
  {
    label: '完工时间',
    field: 'completeTime',
    defaultValue: new Date(),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      disabled: true,
    },
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请输入完工时间!' }];
    // },
    colProps: { span: 12 },
  },
  {
    label: '操作员',
    field: 'operator',
    component: 'JSelectUser',
    componentProps: {
      disabled: true,
    },
    // component: 'JSelectUser',
    // dynamicRules: ({ model, schema }) => {
    //   return [{ required: true, message: '请选择操作员!' }];
    // },
  },
];
