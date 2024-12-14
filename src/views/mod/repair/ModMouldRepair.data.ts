import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
import { Col } from 'ant-design-vue/es/grid';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '维修单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
  },
  {
    title: '模具',
    align: 'center',
    dataIndex: 'mouldId_dictText',
  },
  {
    title: '具体位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '故障分类',
    align: 'center',
    dataIndex: 'defectId_dictText',
  },
  {
    title: '故障描述',
    align: 'center',
    dataIndex: 'defectDescription',
  },
  {
    title: '故障图片',
    align: 'center',
    dataIndex: 'defectImage',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_repair_status', true);
    },
  },
  {
    title: '确认人',
    align: 'center',
    dataIndex: 'confirmBy_dictText',
  },
  {
    title: '确认时间',
    align: 'center',
    dataIndex: 'confirmTime',
  },
  {
    title: '确认备注',
    align: 'center',
    dataIndex: 'confirmRemark',
  },
  {
    title: '是否委外',
    align: 'center',
    dataIndex: 'isOut',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '维修厂家',
    align: 'center',
    dataIndex: 'outSupplierId_dictText',
  },
  {
    title: '维修人',
    align: 'center',
    dataIndex: 'repairBy_dictText',
  },
  {
    title: '维修开始时间',
    align: 'center',
    dataIndex: 'repairStartTime',
  },
  {
    title: '维修完成时间',
    align: 'center',
    dataIndex: 'repairCompleteTime',
  },
  {
    title: '维修工时',
    align: 'center',
    dataIndex: 'repairHours',
  },
  {
    title: '维修图片',
    align: 'center',
    dataIndex: 'repairImage',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '维修备注',
    align: 'center',
    dataIndex: 'repairRemark',
  },
  {
    title: '是否报废',
    align: 'center',
    dataIndex: 'isScraped',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否评价',
    align: 'center',
    dataIndex: 'isEvaluate',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '评价等级',
    align: 'center',
    dataIndex: 'evaluateRating',
  },
  {
    title: '评价内容',
    align: 'center',
    dataIndex: 'evaluateContent',
  },
  {
    title: '评价人',
    align: 'center',
    dataIndex: 'evaluateBy_dictText',
  },
  {
    title: '评价时间',
    align: 'center',
    dataIndex: 'evaluateTime',
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
        placeholder: '请输入',
        pageSize: 10,
        multi: true,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    label: '模具',
    field: 'mouldQuery',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mod_repair_status',
    },
  },
  {
    label: '维修单号',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '维修厂家',
    field: 'outSupplierQuery',
    component: 'Input',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '模具',
    field: 'mouldId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mod/type/listModMouldByMainId',
        params: {
          isEnable: 'Y',
        },
        columns: [
          {
            title: '模具编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '模具描述',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText',
          },
          {
            title: '存放位置',
            align: 'center',
            dataIndex: 'location',
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
            label: '描述',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code', 'name'],
        placeholder: '请选择',
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择模具!' }];
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
        placeholder: '请输入',
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择车间!' }];
    },
  },
  {
    label: '故障分类',
    field: 'defectId',
    component: 'JTreeSelect',
    componentProps: {
      dict: 'mod_mould_defect,name,id',
      pidField: 'pid',
      hasChildField: 'has_child',
      pidValue: 0,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择故障分类!' }];
    },
  },
  {
    label: '具体位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//表单数据
export const confirmFormSchema: FormSchema[] = [
  {
    label: '维修单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '具体位置',
    field: 'location',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障分类',
    field: 'defectId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '是否委外',
    field: 'isOut',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '维修厂家',
    field: 'outSupplierId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: {},
        columns: [
          {
            title: '供应商编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '供应商名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '供应商编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '供应商名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择维修厂家',
      };
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择维修厂家!' }];
    },
    ifShow: ({ model }) => {
      return model.isOut === 'Y';
    },
  },
  {
    label: '维修人',
    field: 'repairBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount: 5,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择维修人!' }];
    },
    ifShow: ({ model }) => {
      return model.isOut === 'N';
    },
  },
  {
    label: '确认备注',
    field: 'confirmRemark',
    component: 'InputTextArea',
  },
  {
    label: '',
    field: 'mouldId',
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
//表单数据
export const repairFormSchema: FormSchema[] = [
  {
    label: '维修单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '具体位置',
    field: 'location',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障分类',
    field: 'defectId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '确认人',
    field: 'confirmBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '确认时间',
    field: 'confirmTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '是否委外',
    field: 'isOut',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    dynamicDisabled: true,
  },
  {
    label: '维修厂家',
    field: 'outSupplierId_dictText',
    component: 'Input',
    ifShow: ({ model }) => {
      return model.isOut === 'Y';
    },
    dynamicDisabled: true,
  },
  {
    label: '维修人',
    field: 'repairBy_dictText',
    component: 'Input',
    ifShow: ({ model }) => {
      return model.isOut === 'N';
    },
    dynamicDisabled: true,
  },
  {
    label: '确认备注',
    field: 'confirmRemark',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '维修开始时间',
    field: 'repairStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    dynamicDisabled: true,
  },
  {
    label: '维修工时',
    field: 'repairHours',
    component: 'InputNumber',
    defaultValue: 0,
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入维修工时!' }];
    },
  },
  {
    label: '是否报废',
    field: 'isScraped',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '是否评价',
    field: 'isEvaluate',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '维修图片',
    field: 'repairImage',
    component: 'JImageUpload',
  },
  {
    label: '维修备注',
    field: 'repairRemark',
    component: 'InputTextArea',
  },
  {
    label: '',
    field: 'mouldId',
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
//表单数据
export const evaluateFormSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'mouldId',
    component: 'Input',
    show: false,
  },
  {
    label: '维修单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '具体位置',
    field: 'location',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障分类',
    field: 'defectId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '确认人',
    field: 'confirmBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '确认时间',
    field: 'confirmTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '是否委外',
    field: 'isOut',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    dynamicDisabled: true,
  },
  {
    label: '维修厂家',
    field: 'outSupplierId_dictText',
    component: 'Input',
    ifShow: ({ model }) => {
      return model.isOut === 'Y';
    },
    dynamicDisabled: true,
  },
  {
    label: '维修人',
    field: 'repairBy_dictText',
    component: 'Input',
    ifShow: ({ model }) => {
      return model.isOut === 'N';
    },
    dynamicDisabled: true,
  },
  {
    label: '确认备注',
    field: 'confirmRemark',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '维修开始时间',
    field: 'repairStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '维修完成时间',
    field: 'repairCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '维修工时',
    field: 'repairHours',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '是否报废',
    field: 'isScraped',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    dynamicDisabled: true,
  },
  {
    label: '是否评价',
    field: 'isEvaluate',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    dynamicDisabled: true,
  },
  {
    label: '维修图片',
    field: 'repairImage',
    component: 'JImageUpload',
    dynamicDisabled: true,
  },
  {
    label: '维修备注',
    field: 'repairRemark',
    component: 'InputTextArea',
    dynamicDisabled: true,
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 24 },
  },
  {
    label: '评价等级',
    field: 'evaluateRating',
    component: 'Rate',
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择评价等级!' }];
    },
  },
  {
    label: '评价内容',
    field: 'evaluateContent',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入评价内容!' }];
    },
  },
  {
    label: '评价人',
    field: 'evaluateBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '评价时间',
    field: 'evaluateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
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
export const modMouldRepairPartsColumns: BasicColumn[] = [
  {
    title: '备件物料',
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
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
  },
];
export const modMouldRepairPartsJVxeColumns: JVxeColumn[] = [
  {
    title: '维修单',
    key: 'repairId',
    type: JVxeTypes.hidden,
  },
  {
    title: '维修单',
    key: 'prodId',
    type: JVxeTypes.hidden,
  },
  {
    title: '备件物料',
    key: 'prodCode',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/product/basProduct/list',
    params: {
      /*code: '${code}',*/
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
        field: 'name',
        label: '名称',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
    ],
    rowKey: 'code',
    labelKey: 'code',
    linkmap: [{ id: 'prodId', unitId: 'unitId', name: 'prodName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '名称',
    key: 'prodName_dictText',
    type: JVxeTypes.inputNumber,
    width: '350px',
    disabled: true,
  },
  {
    title: '数量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    dictCode: 'bas_unit,name,id',
    width: '100px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
//子表表格配置
export const modDetailMouldRepairPartsJVxeColumns: JVxeColumn[] = [
  {
    title: '维修单',
    key: 'repairId',
    type: JVxeTypes.hidden,
  },
  {
    title: '备件物料',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    width: '350px',
    disabled: true,
  },
  {
    title: '数量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    dictCode: 'bas_unit,name,id',
    width: '100px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];

// 高级查询数据
export const superQuerySchema = {
  mouldId: { title: '设备', order: 0, view: 'text', type: 'string' },
  code: { title: '维修单号', order: 1, view: 'text', type: 'string' },
  desceiption: { title: '描述', order: 2, view: 'text', type: 'string' },
  workShopId: { title: '车间', order: 3, view: 'text', type: 'string' },
  location: { title: '具体位置', order: 4, view: 'text', type: 'string' },
  defectId: { title: '故障分类', order: 5, view: 'text', type: 'string' },
  defectDescription: { title: '故障描述', order: 6, view: 'text', type: 'string' },
  defectImage: { title: '故障图片', order: 7, view: 'text', type: 'string' },
  confirmBy: { title: '确认人', order: 8, view: 'text', type: 'string' },
  confirmTime: { title: '确认时间', order: 9, view: 'datetime', type: 'string' },
  confirmRemark: { title: '确认备注', order: 10, view: 'text', type: 'string' },
  repairBy: { title: '维修人', order: 11, view: 'text', type: 'string' },
  repairStartTime: { title: '维修开始时间', order: 12, view: 'datetime', type: 'string' },
  repairCompleteTime: { title: '维修完成时间', order: 13, view: 'datetime', type: 'string' },
  repairHours: { title: '维修工时', order: 14, view: 'number', type: 'number' },
  repairImage: { title: '维修图片', order: 15, view: 'text', type: 'string' },
  repairRemark: { title: '维修备注', order: 16, view: 'text', type: 'string' },
  isScraped: { title: '是否报废', order: 17, view: 'text', type: 'string' },
  status: { title: '状态', order: 18, view: 'text', type: 'string' },
  isEvaluate: { title: '是否评价', order: 19, view: 'text', type: 'string' },
  evaluateRating: { title: '评价等级', order: 20, view: 'number', type: 'number' },
  evaluateContent: { title: '评价内容', order: 21, view: 'text', type: 'string' },
  evaluateBy: { title: '评价人', order: 22, view: 'text', type: 'string' },
  evaluateTime: { title: '评价时间', order: 23, view: 'datetime', type: 'string' },
  //子表高级查询
  modMouldRepairParts: {
    title: '模具维修配件表',
    view: 'table',
    fields: {
      repairId: { title: '维修单', order: 0, view: 'text', type: 'string' },
      prodId: { title: '备件物料', order: 1, view: 'text', type: 'string' },
      qty: { title: '数量', order: 2, view: 'number', type: 'number' },
      unitId: { title: '单位', order: 3, view: 'text', type: 'string' },
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
