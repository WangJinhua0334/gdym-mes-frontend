import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref, unref, computed } from 'vue';

export const selectSysFillRuleId = ref();

//列表数据
export const columns: BasicColumn[] = [
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
    title: '系统编码业务',
    align: 'center',
    dataIndex: 'sysFillRuleId_dictText',
  },
  {
    title: '是否默认',
    align: 'center',
    dataIndex: 'isDefault',
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '系统编码业务',
    field: 'sysFillRuleId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/fillRule/listFillRule',
        params: { column: 'createTime', order: 'desc', searchFields: 'ruleName' },
        columns: [
          { name: '编码', code: 'ruleCode' },
          { name: '名称', code: 'ruleName' },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['ruleName'],
        placeholder: '请选择',
        multi: false,
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '系统编码业务',
    field: 'sysFillRuleId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/fillRule/listFillRule',
        params: { column: 'createTime', order: 'desc', searchFields: 'ruleName' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'ruleCode' },
          { name: '名称', code: 'ruleName' },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['ruleName'],
        placeholder: '请选择',
        multi: false,
        pageSize: 10,
        onChange: function (v) {
          selectSysFillRuleId.value = v;
        },
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '选择系统编码业务' }];
    },
  },
  {
    label: '是否默认',
    field: 'isDefault',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//子表列表数据
export const basFillRuleConfigDetailColumns: BasicColumn[] = [
  {
    title: '规则类型',
    align: 'center',
    dataIndex: 'fillRuleType_dictText',
  },
  {
    title: '值',
    align: 'center',
    dataIndex: 'fillRuleValue',
  },
  {
    title: '业务参数',
    align: 'center',
    dataIndex: 'fillRuleParam',
  },
  {
    title: '长度',
    align: 'center',
    dataIndex: 'fillRuleLength',
  },
  {
    title: '进制位',
    align: 'center',
    dataIndex: 'fillRuleHex',
  },
  {
    title: '进制字符',
    align: 'center',
    dataIndex: 'fillRuleHexStr',
  },
  {
    title: '起始号',
    align: 'center',
    dataIndex: 'fillRuleStart',
  },
  {
    title: '是否反转',
    align: 'center',
    dataIndex: 'isReverse',
    slots: { customRender: 'switchSlot' },
  },
];
//子表表格配置
export const basFillRuleConfigDetailJVxeColumns: JVxeColumn[] = [
  {
    title: '规则类型',
    key: 'fillRuleType',
    type: JVxeTypes.select,
    width: 150,
    dictCode: 'fill_rule_type',
    placeholder: '请选择${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '值',
    key: 'fillRuleValue',
    type: JVxeTypes.input,
    width: 120,
    placeholder: '请输入${title}',
  },
  {
    title: '参数',
    key: 'fillRuleParam',
    type: JVxeTypes.select,
    width: 120,
    placeholder: '请输入${title}',
    titleHelp: { message: '选取系统编码业务支持的业务参数！' },
    tipsContent: { message: '选取系统编码业务支持的业务参数！' },
    validateRules: [
      {
        handler({ cellValue, row }, callback) {
          if (row.fillRuleType === 'params' && !cellValue) {
            callback(false, '${title}不能为空'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
      },
    ],
  },
  {
    title: '长度',
    key: 'fillRuleLength',
    type: JVxeTypes.inputNumber,
    width: 150,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [
      {
        pattern: /^[0-9]*[0-9][0-9]*$/, // 正则
        message: '${title}格式错误',
      },
      {
        handler({ cellValue, row }, callback) {
          if (row.fillRuleType == 'year' && cellValue && cellValue > 4) {
            callback(false, '${title}不能大于4'); // false = 未通过校验
          } else if ((row.fillRuleType == 'month' || row.fillRuleType == 'date' || row.fillRuleType == 'week') && cellValue && cellValue > 2) {
            callback(false, '${title}不能大于2'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '进制',
    key: 'fillRuleHex',
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [
      {
        pattern: /^[0-9]*[1-9][0-9]*$/, // 正则
        message: '必须是正整数',
      },
    ],
  },
  {
    title: '进制字符',
    key: 'fillRuleHexStr',
    type: JVxeTypes.input,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [
      {
        handler({ cellValue, row }, callback) {
          if (!!cellValue && Number(cellValue.length) != Number(row.fillRuleHex)) {
            callback(false, '${title}长度不等于进制数'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}长度不能小于进制数',
      },
    ],
  },
  {
    title: '起始值',
    key: 'fillRuleStart',
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [
      {
        pattern: /^[0-9]*[1-9][0-9]*$/, // 正则
        message: '${title}必须是正整数',
      },
      {
        handler({ cellValue, row }, callback) {
          if (row.fillRuleType == 'serial_number' && !cellValue) {
            callback(false, '${title}不能为空'); // false = 未通过校验
          } else {
            callback(true); // true = 通过验证
          }
        },
        message: '${title}不能为空',
      },
    ],
  },
  {
    title: '是否反转',
    key: 'isReverse',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 100,
    slotName: 'mustSwitch',
  },
];
