import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
import { multiply } from 'lodash-es';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '物料',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '类别',
    align: 'center',
    dataIndex: 'type',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_type', true);
    },
  },
  {
    title: '规格',
    align: 'center',
    dataIndex: 'specification',
  },
  {
    title: '寿命类型',
    align: 'center',
    dataIndex: 'lifeType',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_life_type', true);
    },
  },
  {
    title: '寿命',
    align: 'center',
    dataIndex: 'life',
  },
  {
    title: '模穴数',
    align: 'center',
    dataIndex: 'cavity',
  },
  {
    title: '总数量',
    align: 'center',
    dataIndex: 'qty',
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
  },
  {
    title: '库存数量',
    align: 'center',
    dataIndex: 'invQty',
  },
  {
    title: '领用数量',
    align: 'center',
    dataIndex: 'useQty',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '物料',
    field: 'prodQuery',
    component: 'Input',
  },
  {
    label: '类别',
    field: 'type',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mod_type',
    },
  },
  {
    label: '规格',
    field: 'specification',
    component: 'JInput',
  },
];

//表单数据
export const formSchema: FormSchema[] = [
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
        linkmap: [{ name: 'prodName_dictText', specification: 'specification' }],
        placeholder: '请选择物料',
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料!' }];
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '类别',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mod_type',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择类别!' }];
    },
  },
  {
    label: '规格',
    field: 'specification',
    component: 'Input',
  },
  {
    label: '寿命类型',
    field: 'lifeType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mod_life_type',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择寿命类型!' }];
    },
  },
  {
    label: '寿命',
    field: 'life',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '模穴数',
    field: 'cavity',
    component: 'InputNumber',
    defaultValue: 0,
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
export const modMouldColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'suppId_dictText',
  },
  {
    title: '采购时间',
    align: 'center',
    dataIndex: 'purchaseTime',
  },
  {
    title: '固定资产编码',
    align: 'center',
    dataIndex: 'fixedAssetsCode',
  },
  {
    title: '存放位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_status', true);
    },
  },
  {
    title: '可用模穴数',
    align: 'center',
    dataIndex: 'cavityOk',
  },
  {
    title: '已用寿命',
    align: 'center',
    dataIndex: 'usedLife',
  },
  {
    title: '剩余寿命',
    align: 'center',
    dataIndex: 'remainingLife',
  },
  {
    title: '领用人',
    align: 'center',
    dataIndex: 'useBy_dictText',
  },
  {
    title: '领用时间',
    align: 'center',
    dataIndex: 'useTime',
  },
  {
    title: '报废人',
    align: 'center',
    dataIndex: 'scrapedBy_dictText',
  },
  {
    title: '报废时间',
    align: 'center',
    dataIndex: 'scrapedTime',
  },
  {
    title: '报废原因',
    align: 'center',
    dataIndex: 'scrapedReason',
  },
  {
    title: '是否自动生成保养计划',
    align: 'center',
    dataIndex: 'isAutoMaintainPlan',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否自动生成点检计划',
    align: 'center',
    dataIndex: 'isAutoCheckPlan',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '保养方案',
    align: 'center',
    dataIndex: 'maintainId_dictText',
  },
  {
    title: '保养状态',
    align: 'center',
    dataIndex: 'maintainStatus',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_maintain_status', true);
    },
  },
  {
    title: '保养次数',
    align: 'center',
    dataIndex: 'maintainTimes',
  },
  {
    title: '保养时间',
    align: 'center',
    dataIndex: 'maintainTime',
  },
  {
    title: '下次保养时间',
    align: 'center',
    dataIndex: 'maintainNextTime',
  },
  {
    title: '点检方案',
    align: 'center',
    dataIndex: 'checkId_dictText',
  },
  {
    title: '点检状态',
    align: 'center',
    dataIndex: 'checkStatus',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_check_status', true);
    },
  },
  {
    title: '点检次数',
    align: 'center',
    dataIndex: 'checkTimes',
  },
  {
    title: '点检时间',
    align: 'center',
    dataIndex: 'checkTime',
  },
  {
    title: '下次点检时间',
    align: 'center',
    dataIndex: 'checkNextTime',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
];
//子表表单数据
export const modMouldFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '型号',
    field: 'typeId',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '描述',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
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
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
      };
    },
  },
  {
    label: '采购时间',
    field: 'purchaseTime',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '固定资产编码',
    field: 'fixedAssetsCode',
    component: 'Input',
  },
  {
    label: '存放位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '可用模穴数',
    field: 'cavityOk',
    component: 'InputNumber',
  },
  {
    label: '已用寿命',
    field: 'usedLife',
    component: 'InputNumber',
  },
  {
    label: '剩余寿命',
    field: 'remainingLife',
    component: 'InputNumber',
  },
  {
    label: '保养方案',
    field: 'maintainId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mod/maintainBasc/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: false,
        queryBefore: (params) => {
          params.isEnable = 'Y';
          return params;
        },
      };
    },
  },
  {
    label: '点检方案',
    field: 'checkId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mod/checkBasc/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: false,
        queryBefore: (params) => {
          params.isEnable = 'Y';
          return params;
        },
      };
    },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
  },
  {
    label: '是否自动生成保养计划',
    field: 'isAutoMaintainPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否自动生成点检计划',
    field: 'isAutoCheckPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
];

// 高级查询数据
export const superQuerySchema = {
  prodId: { title: '物料', order: 0, view: 'text', type: 'string' },
  type: { title: '类别', order: 1, view: 'text', type: 'string' },
  specification: { title: '规格', order: 2, view: 'text', type: 'string' },
  lifeType: { title: '寿命类型', order: 3, view: 'text', type: 'string' },
  life: { title: '寿命', order: 4, view: 'number', type: 'number' },
  cavity: { title: '模穴数', order: 5, view: 'number', type: 'number' },
  qty: { title: '总数量', order: 6, view: 'number', type: 'number' },
  scrapedQty: { title: '报废数量', order: 7, view: 'number', type: 'number' },
  invQty: { title: '库存数量', order: 8, view: 'number', type: 'number' },
  useQty: { title: '领用数量', order: 9, view: 'number', type: 'number' },
};

//领用表单数据
export const neckFormSchema: FormSchema[] = [
  {
    label: '领用人',
    field: 'useBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount: 1,
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择领用人!' }];
    },
  },
  {
    label: '领用日期',
    field: 'useTime',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择计划完工日期!' }];
    },
  },
  {
    label: '类型Id',
    field: 'typeId',
    component: 'Input',
    show: false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表详情数据
export const modMouldDetailSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'name',
    component: 'Input',
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '供应商',
    field: 'suppId_dictText',
    component: 'Input',
  },
  {
    label: '采购时间',
    field: 'purchaseTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    label: '固定资产编码',
    field: 'fixedAssetsCode',
    component: 'Input',
  },
  {
    label: '存放位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
  },
  {
    label: '可用模穴数',
    field: 'cavityOk',
    component: 'InputNumber',
  },
  {
    label: '已用寿命',
    field: 'usedLife',
    component: 'InputNumber',
  },
  {
    label: '剩余寿命',
    field: 'remainingLife',
    component: 'InputNumber',
  },
  {
    label: '领用人',
    field: 'useBy_dictText',
    component: 'Input',
  },
  {
    label: '领用时间',
    field: 'useTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '报废人',
    field: 'scrapedBy_dictText',
    component: 'Input',
  },
  {
    label: '报废时间',
    field: 'scrapedTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '报废原因',
    field: 'scrapedReason',
    component: 'Input',
  },
  {
    label: '保养方案',
    field: 'maintainId_dictText',
    component: 'Input',
  },
  {
    label: '保养状态',
    field: 'maintainStatus_dictText',
    component: 'Input',
  },
  {
    label: '保养次数',
    field: 'maintainTimes',
    component: 'InputNumber',
  },
  {
    label: '保养时间',
    field: 'maintainTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '下次保养时间',
    field: 'maintainNextTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '点检方案',
    field: 'checkId_dictText',
    component: 'Input',
  },
  {
    label: '点检状态',
    field: 'checkStatus_dictText',
    component: 'Input',
  },
  {
    label: '点检次数',
    field: 'checkTimes',
    component: 'InputNumber',
  },
  {
    label: '点检时间',
    field: 'checkTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '下次点检时间',
    field: 'checkNextTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '是否自动生成保养计划',
    field: 'isAutoMaintainPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否自动生成点检计划',
    field: 'isAutoCheckPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
  },
];
