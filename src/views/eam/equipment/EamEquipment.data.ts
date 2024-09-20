import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
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
    title: '规格',
    align: 'center',
    dataIndex: 'specification',
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'category',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
  },
  {
    title: '特种设备',
    align: 'center',
    dataIndex: 'isSpecial_dictText',
  },
  {
    title: '设备分类',
    align: 'center',
    dataIndex: 'equipTypeId_dictText',
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'suppId_dictText',
  },
  {
    title: '出厂时间',
    align: 'center',
    dataIndex: 'purchaseTime',
  },
  {
    title: '领用时间',
    align: 'center',
    dataIndex: 'useTime',
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
  },
  {
    title: '领用人',
    align: 'center',
    dataIndex: 'useBy_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '设备分类',
    field: 'equipTypeId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "eam_equipment_type where sys_org_code like '#{sys_org_code}%',name,id",
      pageSize: 10,
      async: true,
      params: { column: 'code', order: 'asc', searchCols: 'code,name' },
      getPopupContainer: () => document.body,
    },
    colProps: { span: 6 },
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '特种设备',
    field: 'isSpecial',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equipment_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "bas_work_shop where sys_org_code like '#{sys_org_code}%',name,id",
      pageSize: 10,
      async: true,
      params: { column: 'code', order: 'asc', searchCols: 'code,name' },
      getPopupContainer: () => document.body,
    },
    colProps: { span: 6 },
  },
];

//列表数据
export const checkRecordColumns: BasicColumn[] = [
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
//列表数据
export const maintainRecordColumns: BasicColumn[] = [
  {
    title: '保养单号',
    align: 'center',
    dataIndex: 'code',
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
    title: '计划保养人',
    align: 'center',
    dataIndex: 'planOperateBy_dictText',
  },
  {
    title: '计划保养日期',
    align: 'center',
    dataIndex: 'planOperateTime',
  },
  {
    title: '逾期天数',
    align: 'center',
    dataIndex: 'planOperateTime',
    customRender: ({ record }) => {
      // @ts-ignore
      try {
        // @ts-ignore
        let acOperateTime = record?.acOperateTime;
        let acOperateTimeDate;
        if (!acOperateTime) {
          acOperateTimeDate = new Date();
        } else {
          acOperateTimeDate = acOperateTime;
        }
        // @ts-ignore
        let planOperateTimeDate = record?.planOperateTime ? new Date(record?.planOperateTime) : new Date();
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
  },

  {
    title: '实际保养日期',
    align: 'center',
    dataIndex: 'acOperateTime',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
  },
];
//列表数据
export const checkRecordDetailsColumns: BasicColumn[] = [
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '点检方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '点检标准',
    align: 'center',
    dataIndex: 'standard',
  },
  {
    title: '是否异常',
    align: 'center',
    dataIndex: 'result',
    customRender: ({ text }) => {
      let v;
      switch (text) {
        case 'Y':
          v = '是';
          break;
        case 'N':
          v = '否';
          break;
        default:
          v = '未知';
      }
      return v;
    },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
];
//列表数据
export const maintainRecordDetailsColumns: BasicColumn[] = [
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '保养位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '保养方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '保养标准',
    align: 'center',
    dataIndex: 'standard',
  },
  {
    title: '是否异常',
    align: 'center',
    dataIndex: 'result',
    customRender: ({ text }) => {
      let v;
      switch (text) {
        case 'Y':
          v = '是';
          break;
        case 'N':
          v = '否';
          break;
        default:
          v = '未知';
      }
      return v;
    },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '设备分类',
    field: 'equipTypeId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "eam_equipment_type where sys_org_code like '#{sys_org_code}%',name,id",
      pageSize: 10,
      async: true,
      params: { column: 'code', order: 'asc', searchCols: 'code,name' },
      getPopupContainer: () => document.body,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入设备分类!' }];
    },
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '规格',
    field: 'specification',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入设备规格!' }];
    },
  },
  {
    label: '类型',
    field: 'category',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入设备类型!' }];
    },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equipment_status',
      showChooseOption: false,
      getPopupContainer: () => document.body,
    },
  },
  {
    label: '特种设备',
    field: 'isSpecial',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '生成点检计划',
    field: 'isAutoGeneratedSpotCheckPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '生成保养计划',
    field: 'isAutoGeneratedMaintainPlan',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
  },
  {
    label: '出厂编码',
    field: 'fixedAssetsCode',
    component: 'Input',
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
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: false,
      };
    },
  },
  {
    label: '出厂时间',
    field: 'purchaseTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
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
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择车间!' }];
    },
  },
  {
    label: '领用人',
    field: 'useBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
  {
    label: '价值',
    field: 'value',
    component: 'InputNumber',
  },
  {
    label: '存放位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
  },
  {
    label: '图片',
    field: 'images',
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

//子表列表数据
export const eamEquipSpotCheckItemColumns: BasicColumn[] = [
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
    title: '点检方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '点检标准',
    align: 'center',
    dataIndex: 'standard',
  },
  {
    title: '点检周期（天）',
    align: 'center',
    dataIndex: 'cycle',
  },
  {
    title: '提前预警（小时）',
    align: 'center',
    dataIndex: 'alarm',
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
  },
  {
    title: '上一次点检时间',
    align: 'center',
    dataIndex: 'lastSpotCheckTime',
  },
];
//子表表单数据
export const eamEquipSpotCheckItemFormSchema: FormSchema[] = [
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
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '点检方式',
    field: 'method',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入点检方式!' }];
    },
  },
  {
    label: '点检标准',
    field: 'standard',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入点检标准!' }];
    },
  },
  {
    label: '点检周期（天）',
    field: 'cycle',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入点检周期!' }];
    },
  },
  {
    label: '提前预警（小时）',
    field: 'alarm',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入提前预警时间!' }];
    },
  },
  {
    label: '责任人',
    field: 'responsibleBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
  },
];
//子表列表数据
export const eamEquipMaintainItemColumns: BasicColumn[] = [
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
    title: '保养位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '保养方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '保养标准',
    align: 'center',
    dataIndex: 'standard',
  },
  {
    title: '保养周期（天）',
    align: 'center',
    dataIndex: 'cycle',
  },
  {
    title: '提前预警（小时）',
    align: 'center',
    dataIndex: 'alarm',
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
  },
  {
    title: '上一次保养时间',
    align: 'center',
    dataIndex: 'lastMaintainTime',
  },
];
//子表表单数据
export const eamEquipMaintainItemFormSchema: FormSchema[] = [
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
    dynamicRules: () => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '保养位置',
    field: 'location',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入保养位置!' }];
    },
  },
  {
    label: '保养方式',
    field: 'method',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入保养方式!' }];
    },
  },
  {
    label: '保养标准',
    field: 'standard',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入保养标准!' }];
    },
  },
  {
    label: '保养周期（天）',
    field: 'cycle',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入保养周期!' }];
    },
  },
  {
    label: '提前预警（小时）',
    field: 'alarm',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入提前预警时间!' }];
    },
  },
  {
    label: '责任人',
    field: 'responsibleBy',
    component: 'JSelectUser',
  },
];
