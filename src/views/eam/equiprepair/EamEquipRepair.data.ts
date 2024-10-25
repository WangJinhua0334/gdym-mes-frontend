import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { render } from '/@/utils/common/renderUtils';
import { queryDefectCategoryIdTree } from '/@/views/eam/equiprepair/EamEquipRepair.api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '维修单号',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '设备编码',
    align: 'center',
    dataIndex: 'equipCode_dictText',
    width: 150,
  },
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'equipId_dictText',
    width: 150,
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 150,
  },
  {
    title: '报修人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 150,
  },
  {
    title: '报修时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '报修确认人',
    align: 'center',
    dataIndex: 'confirmBy_dictText',
    width: 150,
  },
  {
    title: '确认时间',
    align: 'center',
    dataIndex: 'confirmTime',
    width: 150,
  },
  {
    title: '维修开始时间',
    align: 'center',
    dataIndex: 'repairStartTime',
    width: 150,
  },
  {
    title: '维修完成时间',
    align: 'center',
    dataIndex: 'repairCompleteTime',
    width: 150,
  },
  {
    title: '维修工时',
    align: 'center',
    dataIndex: 'repairHours',
    width: 150,
  },
  {
    title: '维修状态',
    align: 'center',
    dataIndex: 'status',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'equip_repair_status', true);
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '设备编码',
    field: 'equipCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '设备名称',
    field: 'equipName',
    component: 'Input',
    colProps: { span: 6 },
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
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
        //pageSize: 10,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '维修状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equip_repair_status',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '设备',
    field: 'equipId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/eamEquipment/list',
        params: {
          column: 'createTime',
          order: 'desc' /*code: '${code}',*/,
          searchFields: 'code,name',
        },
        columns: [
          {
            name: '编号',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        labelKey: ['name'],
        rowKey: 'id',
        linkmap: [{ code: 'equipment_code', workShopId: 'workShopId' }],
        placeholder: '请输入',
        multi: false,
        disabled: true,
      };
    },
  },
  {
    label: '设备编码',
    field: 'equipCode_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
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
        disabled: true,
      };
    },
  },
  {
    label: '故障分类',
    field: 'defectCategoryId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    componentProps: {
      disabled: true,
    },
  },

  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    componentProps: {
      disabled: true,
    },
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
    label: '维修人',
    field: 'repairBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
      disabled: true,
    },
  },
  {
    label: '备注',
    field: 'confirmRemark',
    component: 'InputTextArea',
    componentProps: {
      disabled: true,
    },
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  {
    label: '维修完成时间',
    field: 'repairCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修完成时间!' }];
    },
  },
  {
    label: '维修工时',
    field: 'repairHours',
    component: 'InputNumber',
    dynamicRules: () => {
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择是否报废!' }];
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

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表表格配置
export const eamEquipRepairPartsColumns: JVxeColumn[] = [
  {
    title: '备件物料',
    key: 'prodId',
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
    rowKey: 'id',
    labelKey: ['name'],
    linkmap: [{ unitId: 'unitId' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '数量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    dictCode: 'bas_unit,name,id',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];

//表单数据
export const formReportEquipRepairSchema: FormSchema[] = [
  {
    label: '设备',
    field: 'equipId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/eamEquipment/list',
        params: {
          column: 'createTime',
          order: 'desc' /*code: '${code}',*/,
          searchFields: 'code,name',
        },
        columns: [
          {
            name: '编号',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        labelKey: ['name'],
        rowKey: 'id',
        linkmap: [{ code: 'equipment_code', workShopId: 'workShopId' }],
        placeholder: '请输入',
        multi: false,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择设备!' }];
    },
  },
  {
    label: '设备编码',
    field: 'equipment_code',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择设备编码!' }];
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择车间!' }];
    },
  },
  {
    label: '故障分类',
    field: 'defectCategoryId',
    component: 'ApiTreeSelect',
    componentProps: {
      api: queryDefectCategoryIdTree,
      immediate: true,
      treeDefaultExpandAll: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择故障分类!' }];
    },
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
  },

  {
    label: '故障描述',
    field: 'defectDescription',
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

//表单数据
export const formReportEquipRepairConfirmSchema: FormSchema[] = [
  {
    label: '设备',
    field: 'equipId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/eamEquipment/list',
        params: {
          column: 'createTime',
          order: 'desc' /*code: '${code}',*/,
          searchFields: 'code,name',
        },
        columns: [
          {
            name: '编号',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        labelKey: ['name'],
        rowKey: 'id',
        linkmap: [{ code: 'equipment_code', workShopId: 'workShopId' }],
        placeholder: '请输入',
        multi: false,
        disabled: true,
      };
    },
  },
  {
    label: '设备编码',
    field: 'equipCode_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
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
        disabled: true,
      };
    },
  },
  {
    label: '故障分类',
    field: 'defectCategoryId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    componentProps: {
      disabled: true,
    },
  },

  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    componentProps: {
      disabled: true,
    },
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
    label: '维修人',
    field: 'repairBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修人!' }];
    },
  },
  {
    label: '备注',
    field: 'confirmRemark',
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
//表单数据
export const formReportEquipEvaluateSchema: FormSchema[] = [
  {
    label: '设备',
    field: 'equipId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/eamEquipment/list',
        params: {
          column: 'createTime',
          order: 'desc' /*code: '${code}',*/,
          searchFields: 'code,name',
        },
        columns: [
          {
            name: '编号',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        labelKey: ['name'],
        rowKey: 'id',
        linkmap: [{ code: 'equipment_code', workShopId: 'workShopId' }],
        placeholder: '请输入',
        multi: false,
        disabled: true,
      };
    },
  },
  {
    label: '设备编码',
    field: 'equipCode_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
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
        disabled: true,
      };
    },
  },
  {
    label: '故障分类',
    field: 'defectCategoryId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '故障图片',
    field: 'defectImage',
    component: 'JImageUpload',
    componentProps: {
      disabled: true,
    },
  },

  {
    label: '故障描述',
    field: 'defectDescription',
    component: 'InputTextArea',
    componentProps: {
      disabled: true,
    },
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
    label: '维修人',
    field: 'repairBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
      disabled: true,
    },
  },
  {
    label: '备注',
    field: 'confirmRemark',
    component: 'InputTextArea',
    componentProps: {
      disabled: true,
    },
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择评价等级!' }];
    },
  },
  {
    label: '评价内容',
    field: 'evaluateContent',
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
