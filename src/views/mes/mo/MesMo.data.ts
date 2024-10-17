import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { rules } from '/@/utils/helper/validator';

/**工单产品ID */
export const moProdId = ref<string>();
/**工单工艺ID */
export const moWkfId = ref<string>();
/**工单数量 */
export const moQty = ref(0);

/**产品工艺路线 */
export const workflowList = ref<any>([]);
/**工单BOM */
export const moBomList = ref<any>([]);
/**工单工序 */
export const moStationList = ref<any>([]);

//列表数据
export function getColumns(moCompleteKitCheck): BasicColumn[] {
  return [
    {
      title: '工单号',
      align: 'center',
      sorter: true,
      dataIndex: 'code',
      width: 160,
    },
    {
      title: '类型',
      align: 'center',
      sorter: true,
      dataIndex: 'type_dictText',
      width: 120,
    },
    {
      title: '车间',
      align: 'center',
      sorter: true,
      dataIndex: 'workShopId_dictText',
      width: 140,
    },
    {
      title: '产品编码',
      align: 'center',
      sorter: true,
      dataIndex: 'prodId_dictText',
      width: 140,
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'prodName_dictText',
      width: 200,
    },
    {
      title: '状态',
      align: 'center',
      sorter: true,
      dataIndex: 'status_dictText',
      width: 100,
    },
    {
      title: '计划数量',
      align: 'center',
      sorter: true,
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '齐套数量',
      align: 'center',
      dataIndex: 'completeKitQty',
      width: 100,
      ifShow: false,
    },
    {
      title: '下发数量',
      align: 'center',
      dataIndex: 'dispatchedQty',
      width: 100,
      format(text) {
        return text ?? '0';
      },
    },
    {
      title: '投入数量',
      align: 'center',
      dataIndex: 'inputedQty',
      width: 100,
      format(text) {
        return text ?? '0';
      },
      ifShow: true,
    },
    {
      title: '产出数量',
      align: 'center',
      dataIndex: 'completedQty',
      width: 100,
      format(text) {
        return text ?? '0';
      },
      ifShow: true,
    },
    {
      title: '报废数量',
      align: 'center',
      dataIndex: 'scrapedQty',
      width: 100,
      format(text) {
        return text ?? '0';
      },
      ifShow: true,
    },
    {
      title: '进度',
      align: 'center',
      dataIndex: 'progress',
      slots: { customRender: 'progressSlot' },
      ifShow: false,
    },
    {
      title: '计划开始日期',
      align: 'center',
      sorter: true,
      dataIndex: 'planStartTime',
      width: 150,
      format: (text) => {
        return !text ? '' : text.length > 16 ? text.substr(0, 16) : text;
      },
    },
    {
      title: '计划完工日期',
      align: 'center',
      sorter: true,
      dataIndex: 'planCompleteTime',
      width: 150,
      format: (text) => {
        return !text ? '' : text.length > 16 ? text.substr(0, 16) : text;
      },
    },
  ];
}

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        multi: true,
        maxTagCount: 2,
        placeholder: '请输入',
        //pageSize: 10,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编码或名称',
    },
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_status',
    },
    colProps: { span: 6 },
  },
];

/**
 * 获取表单配置
 * @returns 表单配置
 */
export function getFormSchema(): FormSchema[] {
  const retValue = [
    {
      label: '工单号',
      field: 'code',
      component: 'Input',
      dynamicDisabled: true,
      ifShow: ({ values }) => {
        return !!values.id;
      },
    },
    {
      label: '工单类型',
      field: 'type',
      defaultValue: 'Standard',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'mo_type',
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入工单类型!' }];
      },
    },
    {
      label: '生产类型',
      field: 'produceType',
      defaultValue: 'sn',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'mo_produce_type',
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入生产类型!' }];
      },
    },
    {
      label: '车间',
      field: 'workShopId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
          columns: [
            { name: '编码', code: 'code' },
            { name: '名称', code: 'name' },
          ],
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
          selectAll: true,
          multi: true,
        };
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入车间!' }];
      },
    },
    {
      label: '产品编码',
      field: 'prodId',
      component: 'JPopupCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;

        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/product/basProduct/list',
          params: {
            status: 'enable',
          },
          columns: [
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
              title: '版本',
              align: 'center',
              dataIndex: 'version',
            },
            {
              title: '规格',
              align: 'center',
              dataIndex: 'specification',
            },
          ],
          queryInfo: [
            {
              field: 'code',
              label: '编码',
              mode: 'single',
              view: 'string',
            },
            {
              field: 'name',
              label: '名称',
              mode: 'single',
              view: 'string',
            },
          ],
          isShowNum: true,
          rowKey: 'id',
          labelKey: ['code', 'version'],
          linkmap: [{ name: 'prodName_dictText', templateId: 'templateId', packRuleId: 'packRuleId' }],
          placeholder: '请选择',
          onChange: function (v) {
            if (v) {
              moProdId.value = v.join(',');
            } else {
              moProdId.value = null;
            }
          },
        };
      },
      dynamicdisabled: ({ values }) => {
        return !!values.id;
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请选择产品!' }];
      },
    },
    {
      label: '产品名称',
      field: 'prodName_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '工艺路线',
      field: 'wkfId',
      component: 'JSearchSelectCustom',
      helpMessage: '选择产品后，此处才能选择产品对应的工艺路线',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;

        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          async: false,
          dictOptions: unref(workflowList),
          columns: [
            {
              name: '描述',
              code: 'description',
            },
            {
              name: '版本',
              code: 'version',
            },
          ],
          rowKey: 'id',
          labelKey: ['description', 'version'],
          placeholder: '请输入',
          onChange: function (e) {
            if (e) {
              moWkfId.value = e;
            } else {
              moWkfId.value = null;
            }
          },
        };
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入工艺路线!' }];
      },
    },
    {
      label: '生产批次',
      field: 'batch',
      component: 'Input',
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入生产批次!' }];
      },
    },
    {
      label: '计划数量',
      field: 'qty',
      component: 'InputNumber',
      componentProps: {
        onChange: function (e) {
          if (e) {
            moQty.value = e;
          } else {
            moQty.value = 0;
          }
        },
      },
      dynamicRules: ({ model, schema }) => {
        return [
          { required: true, message: '请输入数量!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' },
        ];
      },
    },
    {
      label: '计划开始日期',
      field: 'planStartTime',
      component: 'DatePicker',
      // componentProps: {
      //   showTime: true,
      // },
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime)[0] }];
      },
    },
    {
      label: '计划完工日期',
      field: 'planCompleteTime',
      component: 'DatePicker',
      // componentProps: {
      //   showTime: true,
      // },
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择计划完工日期!' }, { ...rules.endTime(model.planStartTime)[0] }];
      },
    },
    {
      label: '模板方案',
      field: 'templateId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/template/basTemplate/list',
          params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
          columns: [
            { name: '编码', code: 'code' },
            { name: '名称', code: 'name' },
          ],
          isShowNum: true,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
        };
      },
    },
    {
      label: '包装规则',
      field: 'packRuleId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/packrule/basPackRule/list',
          params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
          columns: [
            { name: '编码', code: 'code' },
            { name: '名称', code: 'name' },
          ],
          isShowNum: true,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
        };
      },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      colProps: { span: 16 },
    },
    // TODO 主键隐藏字段，目前写死为ID
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
  ];

  return retValue;
}

/**工单BOM子表格配置 */
export const mesMoBomJVxeColumns: JVxeColumn[] = [
  {
    title: '物料',
    key: 'prodId',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '物料名称',
    key: 'prodName',
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
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '需求量',
    key: 'requireQty',
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: 'n', message: '${title}格式不正确' },
    ],
  },
  {
    title: '单位用量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: 'n', message: '${title}格式不正确' },
    ],
  },
  {
    title: '损耗率',
    key: 'lossRate',
    defaultValue: 0,
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    dictCode: 'bas_unit,name,id',
    width: 100,
    placeholder: '请输入${title}',
  },
  {
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    width: 160,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
    placeholder: '请输入${title}',
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 100,
    placeholder: '请输入${title}',
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
];

/**工单工序子表格配置 */
export const mesMoStationJVxeColumns: JVxeColumn[] = [
  {
    title: '工艺工序ID',
    key: 'wfsId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '工序ID',
    key: 'stationId',
    type: JVxeTypes.input,
    visible: false,
  },
  {
    title: '是否开始节点',
    key: 'isStart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '是否打印流转卡',
    key: 'isPrintSn',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'writeSwitch',
  },
  {
    title: '加工物料',
    key: 'prodId',
    type: JVxeTypes.selectDictCustomSearch,
    async: false,
    dictOptions: moBomList,
    columns: [
      {
        name: '物料编码',
        code: 'prodId_dictText',
      },
      {
        name: '物料名称',
        code: 'prodName_dictText',
      },
    ],
    rowKey: 'prodId',
    labelKey: 'prodId_dictText',
    linkmap: [{ prodName_dictText: 'prodName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [
      {
        handler(r, callback, target) {
          const { cellValue, row, column } = r;

          if (row.isStart && row.isStart === 'Y' && (!cellValue || cellValue === '')) {
            callback(false);
          } else {
            callback(true);
          }
        },
        message: '${title}不能为空',
      },
    ],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    width: 120,
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
];

/**工单工序BOM子表格配置 */
export const mesMoStationBomJVxeColumns: JVxeColumn[] = [
  {
    title: '工序',
    key: 'wfsId',
    type: JVxeTypes.selectDictCustomSearch,
    async: false,
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
    async: false,
    dictOptions: moBomList,
    columns: [
      {
        name: '物料编码',
        code: 'prodId_dictText',
      },
      {
        name: '物料名称',
        code: 'prodName_dictText',
      },
      /*{
        name: '用量',
        code: 'qty',
      },
      {
        name: '单位',
        code: 'unitId_dictText',
      },*/
    ],
    rowKey: 'prodId',
    labelKey: 'prodId_dictText',
    linkmap: [
      { prodName_dictText: 'prodName_dictText' },
      { qty: 'qty' },
      { unitId: 'unitId', unitId_dictText: 'unitId_dictText' },
      { location: 'location' },
      { sequence: 'sequence' },
    ],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '用量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    width: 120,
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: 'n', message: '${title}格式不正确' },
    ],
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
    width: 120,
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '管控方式',
    key: 'controlModel',
    defaultValue: 'MaterialSn',
    type: JVxeTypes.selectSearch,
    dictCode: 'prod_control_mode',
    placeholder: '请输入${title}',
    width: 160,
  },
  {
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    width: 160,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    width: 120,
    validateRules: [{ pattern: 'n', message: '${title}格式不正确' }],
  },
];

/**工单BOM子列表配置 */
export const mesMoBomColumns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
  },
  {
    title: '是否关键料',
    align: 'center',
    sorter: true,
    dataIndex: 'isKeypart_dictText',
    format: (text) => {
      return !text ? '否' : text;
    },
    width: 120,
  },
  {
    title: '需求数',
    align: 'center',
    dataIndex: 'requireQty',
    width: 100,
  },
  {
    title: '备料数',
    align: 'center',
    dataIndex: 'preparedQty',
    format: (text) => {
      return !text ? '0' : text;
    },
    width: 100,
  },
  {
    title: '领料数',
    align: 'center',
    dataIndex: 'issuedQty',
    format: (text) => {
      return !text ? '0' : text;
    },
    width: 100,
  },
  {
    title: '退料数',
    align: 'center',
    dataIndex: 'returnedQty',
    format: (text) => {
      return !text ? '0' : text;
    },
    width: 100,
  },
  {
    title: '单位用量',
    align: 'center',
    sorter: true,
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '损耗率',
    align: 'center',
    sorter: true,
    dataIndex: 'lossRate',
    width: 100,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 100,
  },
  {
    title: '位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
    width: 100,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '序号',
    align: 'center',
    dataIndex: 'sequence',
    ifShow: false,
  },
];

/**工单BOM子列表查询配置 */
export const mesMoBomSearchFormSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'productCode',
    component: 'Input',
    componentProps: {
      placeholder: '请输入物料编码',
    },
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'productName',
    component: 'Input',
    componentProps: {
      placeholder: '请输入物料名称',
    },
    colProps: { span: 6 },
  },
];
