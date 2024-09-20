import { ref, unref } from 'vue';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getSumQtyByIds } from '../MesMoPlan.api';

export const moSnList = ref<any>([]);

export const doEnterPressing = ref(1);

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单ID',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '生产任务ID',
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
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品ID',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
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
    label: '任务数量',
    field: 'moPlanQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '已分配数量',
    field: 'createdQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '分配数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分配数量!' }];
    },
    dynamicDisabled: ({ values }) => {
      return Number(values.createdQty) >= Number(values.moPlanQty) || (unref(moSnList) && unref(moSnList).length > 0);
    },
  },
  {
    label: '工单流转卡',
    field: 'moSnIds',
    component: 'JSearchSelectCustom',
    helpMessage: '工单指定流转卡时，请选择工单流转卡',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        async: false,
        dictOptions: unref(moSnList),
        columns: [
          {
            name: '流转卡号',
            code: 'sn',
          },
          {
            name: '数量',
            code: 'qty',
          },
        ],
        rowKey: 'id',
        labelKey: ['sn'],
        multi: true,
        maxTagCount: 5,
        placeholder: '请输入',
        onChange: function (e) {
          console.log(e);
          if (!e) {
            setFieldsValue({ qty: 0 });
          } else {
            getSumQtyByIds({ ids: e.join(',') }).then((res) => {
              setFieldsValue({ qty: res });
            });
          }
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工单流转卡!' }];
    },
    ifShow: ({ values }) => {
      return Number(values.createdQty) < Number(values.moPlanQty) && unref(moSnList) && unref(moSnList).length > 0;
    },
    colProps: { span: 24 },
  },
  {
    label: '批次数量',
    field: 'batchQty',
    defaultValue: '1',
    component: 'InputNumber',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        onChange: (e) => {
          doEnterPressing.value = e;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入批次数量!' }];
    },
    show: ({ values }) => {
      if (unref(moSnList) && unref(moSnList).length > 0) {
        return false;
      } else if (Number(values.qty) <= 0) {
        return false;
      }

      return true;
    },
  },
  {
    label: '记录批次唯一码',
    field: 'isUniqSn',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    ifShow: false,
    // show: ({ values }) => {
    //   return Number(values.batchQty) > 1;
    // },
  },
];

/**前加工物料表格配置 */
export const materialJVxeColumns: JVxeColumn[] = [
  {
    title: '加工物料ID',
    key: 'prodId',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '加工物料',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '是否关键料',
    key: 'isKeypart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
    disabled: true,
  },
  {
    title: 'BOM需求量',
    key: 'requireQty',
    type: JVxeTypes.inputNumber,
    disabled: true,
  },
  {
    title: '已分配数量',
    key: 'createdQty',
    type: JVxeTypes.inputNumber,
    disabled: true,
  },
  {
    title: '分配数量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    validateRules: [
      { required: true, message: '${title}不能为空' },
      /*{
        handler: ({ cellValue }, callback) => {
          if (cellValue <= 0) {
            callback(false, '${title}必须大于0');
          } else callback(true);
        },
        message: '${title}必须大于0',
      },*/
    ],
  },
  {
    title: '批次数量',
    key: 'batchQty',
    defaultValue: '1',
    type: JVxeTypes.inputNumber,
    validateRules: [
      { required: true, message: '${title}不能为空' },
      {
        handler: ({ cellValue }, callback) => {
          if (cellValue <= 0) {
            callback(false, '${title}必须大于0');
          } else callback(true);
        },
        message: '${title}必须大于0',
      },
    ],
  },
  {
    title: '记录批次唯一码',
    key: 'isUniqSn',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    //type: JVxeTypes.slot,
    type: JVxeTypes.hidden,
    slotName: 'resultSwitch',
    width: 120,
  },
];
