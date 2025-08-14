import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

export const moId = ref<string>('');
export const prodId = ref<string>('');
export const doEnterPress = ref();

export const formSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPress.value = Math.random();
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
    label: '工序',
    field: 'title',
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
    label: '重工到工序',
    field: 'wfsId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/wip/productrework/getReWorkData',
        params: {},
        columns: [
          {
            name: '工序节点',
            code: 'wfsId_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'wfsId',
        labelKey: ['wfsId_dictText'],
        multi: false,
        placeholder: '请选择工序节点',
        queryBefore: (params) => {
          params.moId = moId.value ?? -1;
          params.prodId = prodId.value ?? -1;
          return params;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择重工工序节点!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
];
