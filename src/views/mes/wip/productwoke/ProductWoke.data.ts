import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

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
    label: '流转卡号',
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
    label: '已报不良数量',
    field: 'ngnQty',
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
    label: '报不良品',
    field: 'ngQty',
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
        labelKey: ['code'],
        placeholder: '请输入',
        multi: true,
        queryBefore: (params) => {
          params.notStatus = 'discard';
          return params;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择设备!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '开工时间',
    field: 'startTime',
    defaultValue: dayjs().subtract(0, 'day'),
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
    defaultValue: dayjs().subtract(0, 'day'),
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
  {
    label: '停机时间(分)',
    field: 'stopTime',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '停机原因',
    field: 'stopCause',
    component: 'InputTextArea',
  },
];
