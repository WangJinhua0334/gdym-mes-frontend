import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';

/**工单ID */
export const moId = ref<any>(null);
/**工作中心ID */
export const wkcIds = ref<any>(null);

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '任务单号',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 160,
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 140,
  },
  {
    title: '工作中心',
    align: 'center',
    sorter: true,
    dataIndex: 'wkcIds_dictText',
    width: 130,
  },
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 200,
  },
  {
    title: '状态',
    sorter: true,
    align: 'center',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_plan_status', true);
    },
  },
  {
    title: '数量',
    align: 'center',
    sorter: true,
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '投入数量',
    align: 'center',
    dataIndex: 'inputedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '产出数量',
    align: 'center',
    dataIndex: 'completedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 100,
    format(text) {
      return text ?? '0';
    },
    ifShow: false,
  },
  {
    title: '进度',
    align: 'center',
    dataIndex: 'progress',
    slots: { customRender: 'progressSlot' },
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '工单号',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 150,
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
  {
    title: '创建时间',
    align: 'center',
    sorter: true,
    dataIndex: 'createTime',
    width: 150,
    format: (text) => {
      return !text ? '' : text.length > 16 ? text.substr(0, 16) : text;
    },
  },
];

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
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['code', 'name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },
  {
    label: '工作中心',
    field: 'wkcIds',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/workcenter/basWorkCenter/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'code,name' },
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
        placeholder: '请选择',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_plan_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '任务单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];

//表单数据
export function getFormSchema(moCompleteKitCheck): FormSchema[] {
  return [
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '工单',
      field: 'moId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;

        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          methods: 'get',
          url: '/mo/mesMo/list',
          params: { column: 'id', order: 'desc', searchFields: 'code' },
          columns: [
            {
              name: '工单号',
              code: 'code',
            },
            {
              name: '产品编码',
              code: 'prodId_dictText',
            },
            {
              name: '产品名称',
              code: 'prodName_dictText',
            },
            {
              name: '计划数量',
              code: 'qty',
            },
          ],
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['code'],
          placeholder: '请选择',
          pageSize: 10,
          queryBefore: (v) => {
            // 过滤未下发工单
            if (!v['id']) {
              v['notDispatch'] = 'Y';
            }

            return v;
          },
          onChange: (v) => {
            if (v) moId.value = v;
            else moId.value = null;
          },
        };
      },
      ifShow: ({ values }) => {
        return !values.id;
      },
      dynamicRules: ({ model, schema }) => {
        return [{ require: true, message: '请选择工单!' }];
      },
    },
    {
      label: '工单ID',
      field: 'moId',
      component: 'Input',
      show: false,
    },
    {
      label: '工单',
      field: 'moId_dictText',
      component: 'Input',
      dynamicDisabled: true,
      ifShow: ({ values }) => {
        return !!values.id;
      },
    },
    {
      label: '车间ID',
      field: 'workShopId',
      component: 'Input',
      show: false,
    },
    {
      label: '车间',
      field: 'workShopId_dictText',
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
      label: '产品名称',
      field: 'prodName_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '计划数量',
      field: 'moQty',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '工单报废数量',
      field: 'moScrapedQty',
      component: 'Input',
      dynamicDisabled: true,
      show: false,
    },
    {
      label: '工单齐套数量',
      field: 'moCompleteKitQty',
      component: 'Input',
      dynamicDisabled: true,
      show: !!moCompleteKitCheck,
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
      label: '已下发数量',
      field: 'dispatchedQty',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '下发数量',
      field: 'qty',
      component: 'InputNumber',
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入下发数量!' }];
      },
    },
    {
      label: '工作中心',
      field: 'wkcIds',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          methods: 'get',
          url: '/workcenter/basWorkCenter/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'code,name', workShopId: '${workShopId}' },
          columns: [
            { name: '编码', code: 'code' },
            { name: '名称', code: 'name' },
          ],
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请选择',
          multi: true,
          maxTagCount: 2,
          onChange: (v) => {
            if (v) wkcIds.value = v;
            else wkcIds.value = null;
          },
        };
      },
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请选择工作中心!' }];
      },
    },
    {
      label: '计划开始日期',
      field: 'planStartTime',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        getPopupContainer: (node) => document.body,
      },
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }];
      },
    },
    {
      label: '计划完工日期',
      field: 'planCompleteTime',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        getPopupContainer: (node) => document.body,
      },
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择计划完工日期!' }, { ...rules.endTime(model.planStartTime, true)[0] }];
      },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      colProps: { span: 24 },
    },
  ];
}

/**工序任务编辑表格配置 */
export const mesMoPlanTaskJVxeColumns: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '工艺工序ID',
    key: 'wfsId',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '工序ID',
    key: 'stationId',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
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
    width: 160,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '工艺工位',
    key: 'wfsWorkPostIds',
    type: JVxeTypes.input,
    disabled: true,
    visible: false,
  },
  {
    title: '工位',
    key: 'wkpIds',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/mo/mesMoPlan/listWorkPost',
    params: { column: 'code', order: 'asc', searchFields: 'code,name', stationId: '${stationId}', wkpIds: '${wfsWorkPostIds}' },
    columns: [
      {
        name: '编码',
        code: 'code',
      },
      {
        name: '名称',
        code: 'name',
      },
      {
        name: '生产中任务数量',
        code: 'taskCount',
      },
    ],
    rowKey: 'id',
    labelKey: 'name',
    multi: true,
    maxTagCount: 2,
    placeholder: '请输入${title}',
    queryBefore: (params) => {
      params.wkcId = '-1';
      if (unref(wkcIds)) {
        params.wkcId = unref(wkcIds).join();
      }

      return params;
    },
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '作业员',
    key: 'operateBys',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/sys/user/list',
    params: { column: 'username', order: 'asc', searchFields: 'username,realname' },
    columns: [
      {
        name: '账号',
        code: 'username',
      },
      {
        name: '姓名',
        code: 'realname',
      },
    ],
    rowKey: 'username',
    labelKey: 'realname',
    multi: true,
    maxTagCount: 2,
    placeholder: '请输入${title}',
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
    width: 240,
  },
];

// 工序任务查询数据
export const mesMoPlanTaskFormSchema: FormSchema[] = [
  {
    label: '工序',
    field: 'station',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '加工物料',
    field: 'product',
    component: 'Input',
    colProps: { span: 6 },
  },
];

//工序任务列表配置
export const mesMoPlanTaskColumns: BasicColumn[] = [
  {
    title: '工序',
    sorter: true,
    align: 'center',
    dataIndex: 'wfsId_dictText',
  },
  {
    title: '加工物料',
    sorter: true,
    align: 'center',
    dataIndex: 'prodId_dictText',
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
    title: '完工数量',
    align: 'center',
    dataIndex: 'completeQty',
    width: 100,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapQty',
    width: 100,
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 100,
  },
  {
    title: '不良次数',
    align: 'center',
    dataIndex: 'ngCout',
    width: 100,
  },
  {
    title: '操作工位',
    align: 'center',
    dataIndex: 'wkpIds_dictText',
  },
  {
    title: '作业员',
    align: 'center',
    dataIndex: 'operateBys_dictText',
  },
];
