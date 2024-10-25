import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref, computed, unref, reactive } from 'vue';

// 已选择生产任务ID
export const selectedMoPlanId = ref();
// 扫描回车执行中
export const doEnterPressing = ref();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '生产任务',
    field: 'moPlanId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mo/mesMoPlan/list',
        params: { column: 'code', order: 'desc', searchFields: 'code' /*, code: '${code}'*/ },
        columns: [
          { name: '任务单号', code: 'code' },
          { name: '工单号', code: 'moId_dictText' },
        ],
        rowKey: 'id',
        labelKey: ['code'],
        linkmap: [
          { moId_dictText: 'moId_dictText' },
          { wkcIds_dictText: 'wkcIds_dictText' },
          { planStartTime: 'planStartTime' },
          { planCompleteTime: 'planCompleteTime' },
        ],
        placeholder: '请选择',
        onChange: function (v) {
          selectedMoPlanId.value = v;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择生产任务！' }];
    },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工作中心',
    field: 'wkcIds_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '计划开始时间',
    field: 'planStartTime',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '计划完工时间',
    field: 'planCompleteTime',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料条码',
    field: 'bindSn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPressing.value = true;
        }
      },
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描物料条码！' }];
    },
    colProps: { span: 16 },
  },
];

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '加工物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '已绑定数量',
    align: 'center',
    dataIndex: 'bindedQty',
    width: 120,
  },
  {
    title: '流转卡ID',
    align: 'center',
    dataIndex: 'bindSnId',
    ifShow: false,
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'bindSn',
  },
  {
    title: '流转卡数量',
    align: 'center',
    dataIndex: 'bindQty',
    width: 120,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '是否投产',
    align: 'center',
    dataIndex: 'isInput',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
];

//手动绑定数据
export const bindFormSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '任务单ID',
    field: 'moPlanId',
    component: 'Input',
    show: false,
  },
  {
    label: '任务单号',
    field: 'moPlanId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '加工物料ID',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  {
    label: '加工物料',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '已绑定数量',
    field: 'bindedQty',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '物料条码',
    field: 'bindSn',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入物料条码！' }];
    },
  },
  {
    label: '绑定数量',
    field: 'bindQty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入绑定数量！' }];
    },
  },
];
