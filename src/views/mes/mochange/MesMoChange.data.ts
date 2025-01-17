import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
import { ref } from 'vue';

/**工单ID */
export const moId = ref<string>();
/**工单工序 */
export const moStationList = ref<any>([]);

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '变更单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '变更原因',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_change_status', true);
    },
  },
  {
    title: '是否回流',
    align: 'center',
    dataIndex: 'isReturn',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'operateBy_dictText',
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'operateTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '变更单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_change_status',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '变更工单',
    field: 'moId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mo/mesMo/list',
        params: { status: 'Producting' },
        columns: [
          {
            title: '工单号',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
          },
          {
            title: '产品编码',
            align: 'center',
            dataIndex: 'prodId_dictText',
          },
          {
            title: '产品名称',
            align: 'center',
            dataIndex: 'prodName_dictText',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '工单号',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'prodQuery',
            label: '产品编码',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择',
        multi: false,
        linkmap: [{ qty: 'qty' }],
        getPopupContainer: (node) => node.parentNode,
        onChange: function (v, data) {
          console.log('data', data);
          if (v) {
            moId.value = v.join(',');
          } else {
            moId.value = '';
          }
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择变更工单!' }];
    },
  },
  {
    label: '工单数量',
    field: 'qty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '变更原因',
    field: 'remark',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入变更原因!' }];
    },
  },
  {
    label: '是否回流',
    field: 'isReturn',
    defaultValue: 'N',
    component: 'JSwitch',
    helpMessage: ({ values }) => {
      return '自动回流现在没办法实现，请手动对需要回流的流转卡进行返工操作';
    },
    componentProps: { dictCode: 'is_open' },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表列表数据
export const mesMoChangeDetailColumns: BasicColumn[] = [
  {
    title: '变更类型',
    align: 'center',
    dataIndex: 'type',
    width: 130,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_change_type', true);
    },
  },
  {
    title: '工单工序',
    align: 'center',
    dataIndex: 'stationBomId',
    ifShow: false,
  },
  {
    title: '工艺工序',
    align: 'center',
    width: 150,
    dataIndex: 'wfsId_dictText',
  },
  {
    title: '物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '关键料',
    align: 'center',
    dataIndex: 'isKeypart',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '需求量',
    align: 'center',
    dataIndex: 'requireQty',
    width: 80,
  },
  {
    title: '单位用量',
    align: 'center',
    dataIndex: 'qty',
    width: 80,
  },
  {
    title: '损耗率',
    align: 'center',
    dataIndex: 'lossRate',
    width: 80,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 80,
  },
  {
    title: '位置',
    align: 'center',
    dataIndex: 'location',
    width: 100,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
    width: 100,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 80,
  },
  {
    title: '物料成本',
    align: 'center',
    dataIndex: 'materialCost',
    width: 100,
  },
  {
    title: '管控方式',
    align: 'center',
    dataIndex: 'controlMode_dictText',
    width: 100,
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'operateBy_dictText',
    width: 100,
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'operateTime',
    width: 120,
  },
];
//子表表格配置
export const mesMoChangeDetailJVxeColumns: JVxeColumn[] = [
  {
    title: '变更单',
    key: 'changeId',
    type: JVxeTypes.hidden,
  },
  {
    title: '变更类型',
    key: 'type',
    type: JVxeTypes.selectSearch,
    dictCode: 'mo_change_type_add',
    placeholder: '请输入${title}',
    defaultValue: '',
    width: 120,
  },
  {
    title: '工单工序',
    key: 'stationBomId',
    type: JVxeTypes.hidden,
  },
  {
    title: '工序',
    key: 'wfsId',
    type: JVxeTypes.selectDictCustomSearch,
    async: false,
    width: 300,
    dictOptions: moStationList,
    columns: [
      {
        name: '顺序',
        code: 'sequence',
      },
      {
        name: '工序',
        code: 'wfsId_dictText',
      },
    ],
    rowKey: 'wfsId',
    labelKey: 'wfsId_dictText',
    linkmap: [{ stationId: 'stationId' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '工序',
    key: 'stationId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '物料编码',
    key: 'prodId',
    type: JVxeTypes.selectDictCustomSearch,
    url: '/product/basProduct/list',
    width: 300,
    params: { column: 'code', order: 'asc', searchFields: 'code,name' },
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
    rowKey: 'id',
    labelKey: 'code',
    linkmap: [{ name: 'prodName_dictText' }, { unitId: 'unitId' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
    ifshow: ({ row }) => {
      return !!!row.stationBomId;
    },
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
    width: 230,
  },
  {
    title: '是否关键料',
    key: 'isKeypart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'writeSwitch',
  },
  {
    title: '需求量',
    key: 'requireQty',
    type: JVxeTypes.inputNumber,
    defaultValue: 0,
    width: 120,
    placeholder: '请输入${title}',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: 'n', message: '${title}格式不正确' },
    ],
    disabled: true,
  },
  {
    title: '单位用量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    defaultValue: 0,
    width: 120,
    placeholder: '请输入${title}',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: '^[1-9]\\d*$', message: '${title}必须为大于0的整数' }, 
    ],
  },
  {
    title: '损耗率',
    key: 'lossRate',
    defaultValue: 0,
    type: JVxeTypes.inputNumber,
    width: 120,
    placeholder: '请输入${title}',
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
    params: { column: 'code', order: 'asc', searchFields: 'code,name' },
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
    rowKey: 'id',
    labelKey: 'name',
    placeholder: '请输入${title}',
    width: 150,
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] ? row[column.params.key + '_dictText'] : cellValue;
    },
  },
  {
    title: '管控方式',
    key: 'controlMode',
    type: JVxeTypes.selectSearch,
    dictCode: 'prod_control_mode',
    placeholder: '请输入${title}',
    width: 120,
  },
  {
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
    width: 120,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.input,
    width: 120,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 120,
    placeholder: '请输入${title}',
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
  {
    title: '物料成本',
    key: 'materialCost',
    type: JVxeTypes.inputNumber,
    width: 120,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];

// 高级查询数据
export const superQuerySchema = {
  code: { title: '变更单号', order: 0, view: 'text', type: 'string' },
  moId: { title: '工单', order: 1, view: 'text', type: 'string' },
  remark: { title: '变更原因', order: 2, view: 'text', type: 'string' },
  status: { title: '状态', order: 3, view: 'text', type: 'string' },
  isReturn: { title: '是否回流', order: 4, view: 'text', type: 'string' },
  //子表高级查询
  mesMoChangeDetail: {
    title: '变更单子表',
    view: 'table',
    fields: {
      changeId: { title: '变更单', order: 0, view: 'text', type: 'string' },
      type: { title: '变更类型', order: 1, view: 'text', type: 'string' },
      stationBomId: { title: '工单工序', order: 2, view: 'text', type: 'string' },
      wfsId: { title: '工艺工序', order: 3, view: 'text', type: 'string' },
      stationId: { title: '工序', order: 4, view: 'text', type: 'string' },
      prodId: { title: '物料', order: 5, view: 'text', type: 'string' },
      isKeypart: { title: '关键料', order: 6, view: 'text', type: 'string' },
      requireQty: { title: '需求量', order: 7, view: 'number', type: 'number' },
      qty: { title: '单位用量', order: 8, view: 'number', type: 'number' },
      lossRate: { title: '损耗率', order: 9, view: 'number', type: 'number' },
      unitId: { title: '单位', order: 10, view: 'text', type: 'string' },
      location: { title: '位置', order: 11, view: 'text', type: 'string' },
      description: { title: '描述', order: 12, view: 'text', type: 'string' },
      sequence: { title: '顺序', order: 13, view: 'number', type: 'number' },
      materialCost: { title: '物料成本', order: 14, view: 'number', type: 'number' },
      controlMode: { title: '管控方式', order: 15, view: 'text', type: 'string' },
    },
  },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
