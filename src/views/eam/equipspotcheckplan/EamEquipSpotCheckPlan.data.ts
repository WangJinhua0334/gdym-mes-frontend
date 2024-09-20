import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref } from 'vue';

export const eamEquipId = ref<string>();

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '点检单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
  },
  {
    title: '设备编码',
    align: 'center',
    dataIndex: 'equipCode_dictText',
  },
  {
    title: '设备',
    align: 'center',
    dataIndex: 'equipId_dictText',
  },
  {
    title: '计划点检人',
    align: 'center',
    dataIndex: 'planOperateBy_dictText',
  },
  {
    title: '计划点检日期',
    align: 'center',
    dataIndex: 'planOperateTime',
  },
  {
    title: '实际点检人',
    align: 'center',
    dataIndex: 'acOperateBy_dictText',
  },
  {
    title: '实际点检日期',
    align: 'center',
    dataIndex: 'acOperateTime',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
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
    label: '设备',
    field: 'equipName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equip_spot_check_plan_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '计划点检日期',
    field: 'planOperateTimeRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      width: '100%',
      getPopupContainer: () => document.body,
    },
  },
  {
    label: '实际点检日期',
    field: 'acOperateTimeRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      width: '100%',
      getPopupContainer: () => document.body,
    },
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
        isShowNum: false,
        labelKey: ['name'],
        rowKey: 'id',
        linkmap: [{ code: 'equipCode_dictText', workShopId: 'workShopId' }],
        placeholder: '请输入',
        multi: false,
        onChange: function (v) {
          if (v) {
            eamEquipId.value = v;
          } else {
            eamEquipId.value = undefined;
          }
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  {
    label: '计划点检日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      width: '100%',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  {
    label: '计划点检人',
    field: 'planOperateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  // {
  //   label: '点检项目',
  //   field: 'spotCheckRecItem',
  //   component: 'JSearchSelectCustom',
  //   ifShow: (renderCallbackParams) => !!renderCallbackParams.values.equipId,
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue,submit } = formActionType;
  //
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/equipment/eamEquipment/listEamEquipSpotCheckItemByMainId',
  //       params: { equipId: getFieldsValue().equipId },
  //       columns: [
  //         {
  //           name: '点检项目',
  //           code: 'name',
  //         },
  //         {
  //           name: '点检方式',
  //           code: 'method',
  //         },
  //         {
  //           name: '点检标准',
  //           code: 'standard',
  //         },
  //         {
  //           name: '责任人',
  //           code: 'responsibleBy_dictText',
  //         },
  //       ],
  //       rowKey: 'code',
  //       labelKey: ['name'],
  //       placeholder: '请输入',
  //       onChange:function (e){
  //         submit()
  //           .then(() => {
  //             setFieldsValue({ spotCheckRecItem: e });
  //           })
  //           .catch(() => {
  //             setFieldsValue({ spotCheckRecItem: '' });
  //           });
  //         submit();
  //       }
  //       //pageSize: 10,
  //       //maxTagCount: 2,
  //     };
  //   },
  // },
  {
    label: '备注',
    field: 'remark',
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
export const formSchemaSpotCheck: FormSchema[] = [
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
        linkmap: [{ code: 'equipCode_dictText', workShopId: 'workShopId' }],
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
    label: '计划点检日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      disabled: true,
      width: '100%',
    },
  },
  {
    label: '计划点检人',
    field: 'planOperateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
      disabled: true,
    },
  },
  {
    label: '实际点检日期',
    field: 'acOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      width: '100%',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  {
    label: '实际点检人',
    field: 'acOperateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维修开始时间!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
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
export const eamEquipSpotCheckRecItemColumns: JVxeColumn[] = [
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '点检方式',
    key: 'method',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '点检标准',
    key: 'standard',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '操作',
    key: 'action',
    width: '100px',
    // 固定在右侧
    fixed: 'right',
    // 对齐方式为居中
    align: 'center',
    // 组件类型定义为【插槽】
    type: JVxeTypes.slot,
    // slot 的名称，对应 v-slot 冒号后面和等号前面的内容
    slotName: 'action',
  },
];

//子表单数据
//子表表格配置
export const eamEquipSpotCheckItemColumns: JVxeColumn[] = [
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '点检方式',
    key: 'method',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '点检标准',
    key: 'standard',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '是否异常',
    key: 'result',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
    width: '200px',
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.textarea,
    dictCode: 'remark',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '附件',
    key: 'attachments',
    type: JVxeTypes.file,
    placeholder: '请上传${title}',
    defaultValue: '',
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
