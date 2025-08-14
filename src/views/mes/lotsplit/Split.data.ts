import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

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
    label: '不良数量',
    field: 'ngQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '未报工数量',
    field: 'notQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '拆批数量',
    field: 'splitQty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入拆批数量!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
];
