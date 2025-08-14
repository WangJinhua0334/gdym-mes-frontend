import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

export const doEnterPress = ref();

export const formSchema: FormSchema[] = [
  {
    label: '产线工位',
    field: 'wkpId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/list',
        params: { type: 'Line' },
        columns: [
          {
            title: '工位编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '工位名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '位置',
            align: 'center',
            sorter: true,
            dataIndex: 'location',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '工位编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '工位名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        multi: false,
        placeholder: '请选择产线工位',
        maxTagCount: 2,
      };
    },
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择产线工位!' }];
    },
  },
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPress.value = new Date().getTime();
        }
      },
      //colProps: { span: 24 },
    },
  },
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '生产任务',
    field: 'moPlanCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '加工物料',
    field: 'prodCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
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
    label: '工序',
    field: 'title',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 11 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 11 },
  },
  {
    label: '下发数量',
    field: 'notQty',
    component: 'InputNumber',
    colProps: { span: 11 },
  },
];
