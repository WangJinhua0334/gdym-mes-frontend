import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref } from 'vue';
import { render } from '/@/utils/common/renderUtils';

export const eamEquipId = ref<string>();
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '保养单号',
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
    title: '设备',
    align: 'center',
    dataIndex: 'equipId_dictText',
    width: 150,
  },
  {
    title: '计划保养人',
    align: 'center',
    dataIndex: 'planOperateBy_dictText',
    width: 150,
  },
  {
    title: '计划保养日期',
    align: 'center',
    dataIndex: 'planOperateTime',
    width: 150,
  },
  {
    title: '逾期天数',
    align: 'center',
    dataIndex: 'planOperateTime',
    width: 150,
    customRender: ({ record }) => {
      // @ts-ignore
      try {
        // @ts-ignore
        const acOperateTime = record?.acOperateTime;
        let acOperateTimeDate;
        if (!acOperateTime) {
          acOperateTimeDate = new Date();
        } else {
          acOperateTimeDate = acOperateTime;
        }
        // @ts-ignore
        const planOperateTimeDate = record?.planOperateTime ? new Date(record?.planOperateTime) : new Date();
        if (acOperateTimeDate.getTime() > planOperateTimeDate.getTime()) {
          // 计算日期差异的毫秒数
          const timeDifference = acOperateTimeDate.getTime() - planOperateTimeDate.getTime();
          // 将毫秒数转换为天数
          const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          return `${dayDifference}天`;
        }
      } catch (e) {
        console.log(e);
      }

      return '0天';
    },
  },
  {
    title: '实际保养人',
    align: 'center',
    dataIndex: 'acOperateBy_dictText',
    width: 150,
  },

  {
    title: '实际保养日期',
    align: 'center',
    dataIndex: 'acOperateTime',
    width: 150,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'equip_maintain_plan_status', true);
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
      dictCode: 'equip_maintain_plan_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '计划保养日期',
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
    label: '实际保养日期',
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
        isShowNum: true,
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
      return [{ required: true, message: '请选择设备!' }];
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
    label: '计划保养日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择计划保养日期!' }];
    },
  },
  {
    label: '计划保养人',
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
  //   label: '保养项目项目',
  //   field: 'maintainItem',
  //   component: 'JSearchSelectCustom',
  //   ifShow: (renderCallbackParams) => !!renderCallbackParams.values.equipId,
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue, submit } = formActionType;
  //
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/equipment/eamEquipment/listEamEquipMaintainItemByMainId',
  //       params: { equipId: getFieldsValue().equipId },
  //       columns: [
  //         {
  //           name: '保养项目',
  //           code: 'name',
  //         },
  //         {
  //           name: '保养位置',
  //           code: 'location',
  //         },
  //         {
  //           name: '保养方式',
  //           code: 'method',
  //         },
  //         {
  //           name: '保养标准',
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
  //       onChange: function (e) {
  //         submit()
  //           .then(() => {
  //             setFieldsValue({ maintainItem: e });
  //           })
  //           .catch(() => {
  //             setFieldsValue({ maintainItem: '' });
  //           });
  //       },
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
export const formSchemaMaintain: FormSchema[] = [
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
    label: '计划保养日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      disabled: true,
    },
  },
  {
    label: '计划保养人',
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
    label: '实际保养日期',
    field: 'acOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择维实际保养日期!' }];
    },
  },
  {
    label: '实际保养人',
    field: 'acOperateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择实际保养人!' }];
    },
  },
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
//子表表格配置
export const eamEquipMaintainRecItemJVxeColumns: JVxeColumn[] = [
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '保养位置',
    key: 'location',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养方式',
    key: 'method',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养标准',
    key: 'standard',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
//子表表格配置
export const eamMaintainRecItemJVxeColumns: JVxeColumn[] = [
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '保养位置',
    key: 'location',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '保养方式',
    key: 'method',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '保养标准',
    key: 'standard',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
    disabled: true,
  },
  {
    title: '结果',
    key: 'result',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
    width: '200px',
    placeholder: '请输入${title}',
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
