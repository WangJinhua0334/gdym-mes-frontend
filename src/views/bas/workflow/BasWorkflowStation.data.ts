import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { ref, unref } from 'vue';

export const workflowId = ref<string>('');

export const prodId = ref<string>('');

export const stationId = ref<string>('');

export const isGroup = ref(false);

//查询数据
export const basWorkflowStationSearchFormSchema: FormSchema[] = [
  {
    label: '工序编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '工序名称',
    field: 'name',
    component: 'Input',
  },
];
//列表数据
export const basWorkflowStationColumns: BasicColumn[] = [
  {
    title: 'ID',
    align: 'center',
    dataIndex: 'id',
    width: 120,
    ifShow: false,
  },
  {
    title: '工序ID',
    align: 'center',
    dataIndex: 'stationId',
    ifShow: false,
  },
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '是否开始节点',
    align: 'center',
    dataIndex: 'isStart_dictText',
    width: 120,
  },
  {
    title: '加工物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    //width: 160,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 100,
  },
  {
    title: '固定工时',
    align: 'center',
    dataIndex: 'fixedHours_dictText',
    width: 100,
  },
  {
    title: '工时',
    align: 'center',
    dataIndex: 'standardHours',
    width: 100,
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工序ID',
    field: 'stationId',
    component: 'Input',
    show: false,
  },
  {
    label: '工序',
    field: 'stationId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '是否子工序',
    field: 'isChild',
    component: 'Input',
    show: false,
  },
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '是否开始节点',
    field: 'isStart',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '物料ID',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  {
    label: '加工物料',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return values.isStart == 'Y';
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return values.isStart == 'Y';
    },
  },
  {
    label: '是否打印流转卡',
    field: 'isPrintSn',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    ifShow: ({ values }) => {
      return values.isStart == 'Y' && values.prodId != unref(prodId);
    },
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入顺序!' },
        //{ pattern: /^-?\d+$/, message: '输入不合法' },
      ];
    },
  },
  {
    label: '固定工时',
    field: 'fixedHours',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    ifShow: ({ values }) => {
      return values.stationType != 'station_group';
    },
  },
  {
    label: '工时',
    field: 'standardHours',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.stationType != 'station_group';
    },
  },
  {
    label: '图片',
    field: 'image',
    component: 'JImageUpload',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
// 设计器抽屉工序节点编辑
export const formSchemaDrawer: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工序',
    field: 'stationId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      const parameters = {};
      if (isGroup.value) {
        parameters.type = 'station_group';
      } else {
        parameters.filterType = 'station_group';
      }

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/station/basStation/listByType',
        params: parameters,
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
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
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
        labelKey: ['name', 'code'],
        linkmap: [
          { name: 'title', type: 'stationType', childStationIds: 'childStationIds', fixedHours: 'fixedHours', standardHours: 'standardHours' },
        ],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({}) => {
      return [{ required: true, message: '请选择工序!' }];
    },
  },
  {
    label: '工序类型',
    field: 'stationType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'station_type',
    },
    dynamicDisabled: true,
    show: ({}) => {
      return !unref(isGroup);
    },
  },
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    dynamicRules: ({}) => {
      return [{ required: true, message: '请输入标题!' }];
    },
  },
  {
    label: '子工序',
    field: 'childStationIds',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/station/basStation/listByType',
        params: { filterType: 'station_group' },
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
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
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
        labelKey: ['name', 'code'],
        /*linkmap: [
          { name: 'title', type: 'stationType', type_dictText: 'stationType_dictText', fixedHours: 'fixedHours', standardHours: 'standardHours' },
        ],*/
        placeholder: '请选择',
        multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ values }) => {
      return [{ required: values.stationType == 'station_group', message: '请选择子工序!' }];
    },
    ifShow: ({ values }) => {
      return values.stationType == 'station_group';
    },
  },
  {
    label: '是否开始节点',
    field: 'isStart',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否开始节点!' }];
    },
    dynamicDisabled: true,
  },
  {
    label: '加工物料',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/productbom/basProductBom/queryAllVerBomProductList',
        params: {},
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
        linkmap: [{ name: 'prodName_dictText' }],
        placeholder: '请选择',
        queryBefore: function (currentParams) {
          currentParams.prodId = prodId.value;
          currentParams.addProd = true;

          return currentParams;
        },
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择加工物料!' }];
    },
    ifShow: ({ values }) => {
      return values.isStart == 'Y';
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return values.isStart == 'Y';
    },
  },
  {
    label: '是否打印流转卡',
    field: 'isPrintSn',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    ifShow: ({ values }) => {
      return values.isStart == 'Y' && values.prodId != unref(prodId);
    },
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '请输入顺序!' },
        //{ pattern: /^-?\d+$/, message: '格式错误！' },
      ];
    },
  },
  {
    label: '固定工时',
    field: 'fixedHours',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    ifShow: ({ values }) => {
      return values.stationType != 'station_group';
    },
  },
  {
    label: '工时',
    field: 'standardHours',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.stationType != 'station_group';
    },
  },
  {
    label: '图片',
    field: 'image',
    component: 'JImageUpload',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
// 设计器抽屉工艺路径编辑
export const formSchemaPathSelectorDrawer: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'stationId',
    component: 'Input',
    show: false,
  },
  {
    label: '路径',
    field: 'pathSelectorId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workflow/basPathSelector/list',
        params: {
          /*code: '${code}'*/
        },
        columns: [
          {
            title: '编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '描述',
            align: 'center',
            code: 'description',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择',
        //pageSize: 10,
        //multi: false,
        //maxTagCount: 2,
        linkmap: [{ code: 'pathSelectorCode' }],
      };
    },
  },
  {
    label: '',
    field: 'pathSelectorCode',
    component: 'Input',
    show: false,
  },
  {
    label: '是否默认',
    field: 'isDefault',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择是否默认!' }];
    },
  },
];

//子表列表数据——————工序动作
export const basWfsActionColumns: BasicColumn[] = [
  {
    title: '动作',
    align: 'center',
    dataIndex: 'actionId_dictText',
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
  },
];
//子表表单数据
export const basWfsActionFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '动作',
    field: 'actionId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/action/basAction/list',
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
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name', 'code'],
        //linkmap: [{ name: 'actionCode_dictText' }],
        placeholder: '请输入',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择动作!' }];
    },
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
    dynamicRules: () => {
      return [
        { required: true, message: '请输入顺序！' },
        //{ pattern: /^-?\d+$/, message: '格式错误！' },
      ];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

//子表列表数据——————工艺物料
export const basWfsProductColumns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    sorter: true,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    sorter: true,
  },
  {
    title: '用量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
    sorter: true,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 100,
  },
  {
    title: '管控方式',
    align: 'center',
    dataIndex: 'controlMode_dictText',
    width: 100,
    sorter: true,
  },
  {
    title: '位置',
    align: 'center',
    dataIndex: 'location',
    width: 100,
    sorter: true,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 100,
    sorter: true,
  },
];
//子表表单数据
export const basWfsProductFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '物料编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/productbom/basProductBom/queryAllVerBomDetailList',
        params: {},
        columns: [
          {
            title: '物料编码',
            align: 'center',
            dataIndex: 'prodId_dictText',
          },
          {
            title: '物料名称',
            align: 'center',
            dataIndex: 'prodName',
          },
          {
            title: '是否关键料',
            align: 'center',
            dataIndex: 'isKeypart_dictText',
          },
          {
            title: '用量',
            align: 'center',
            dataIndex: 'qty',
          },
          {
            title: '单位',
            align: 'center',
            dataIndex: 'unitId_dictText',
          },
          {
            title: '位置',
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
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'prodId',
        labelKey: ['prodId_dictText'],
        linkmap: [
          {
            prodName_dictText: 'prodName_dictText',
            prodControlMode_dictText: 'controlMode',
            isKeypart: 'isKeypart',
            qty: 'qty',
            unitId: 'unitId',
            location: 'location',
            sequence: 'sequence',
          },
        ],
        placeholder: '请选择',
        queryBefore: function (currentParams) {
          //TODO: 获取工艺产品
          currentParams.prodId = prodId.value;
          return currentParams;
        },
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料！' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '用量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({}) => {
      return [
        { required: true, message: '请输入用量！' },
        //{ pattern: /^-?\d+$/, message: '格式错误！' },
      ];
    },
  },
  {
    label: '单位',
    field: 'unitId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
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
          {
            name: '是否默认',
            code: 'isDefault_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 6,
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择单位！' }];
    },
  },
  {
    label: '管控方式',
    field: 'controlMode',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_control_mode',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择管控方式！' }];
    },
  },
  {
    label: '位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
    dynamicRules: () => {
      return [
        { required: true, message: '请输入顺序！' },
        //{ pattern: /^-?\d+$/, message: '格式错误！' },
      ];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
];

//子表列表数据——————工艺工位
export const basWfsWorkPostColumns: BasicColumn[] = [
  {
    title: '工位',
    align: 'center',
    dataIndex: 'wkpId_dictText',
    sorter: true,
  },
  {
    title: '工时',
    align: 'center',
    dataIndex: 'standardHours',
    sorter: true,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表单数据
export const basWfsWorkPostFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/list',
        params: {},
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
            title: '工作中心',
            align: 'center',
            dataIndex: 'wkcId_dictText',
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
          },
          {
            title: '位置',
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
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        queryBefore: function (currentParams) {
          //过滤工序工位
          if (unref(stationId)) {
            currentParams.stationId = unref(stationId);
          }

          return currentParams;
        },
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工位!' }];
    },
  },
  {
    label: '工时',
    field: 'standardHours',
    component: 'InputNumber',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

//子表列表数据——————工艺SOP
export const basWfsSopColumns: BasicColumn[] = [
  {
    title: '文件名',
    align: 'center',
    dataIndex: 'fileName',
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'url',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//子表表单数据
export const basWfsSopFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '文件',
    field: 'url',
    component: 'JUpload',
    componentProps: {},
    dynamicRules: ({}) => {
      return [{ required: true, message: '请选择文件！' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
];

//子表列表数据——————工艺资源
export const basWfsResourceColumns: BasicColumn[] = [
  {
    title: '类型',
    align: 'center',
    dataIndex: 'resType_dictText',
    sorter: true,
  },
  {
    title: '资源',
    align: 'center',
    dataIndex: 'resId',
    sorter: true,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    sorter: true,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表单数据
export const basWfsResourceFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '类型',
    field: 'resType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'workflow_res_type',
    },
  },
  {
    label: '资源',
    field: 'resId',
    component: 'Input',
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: () => {
      return [
        { required: true, message: '请输入数量！' },
        //{ pattern: /^-?\d+$/, message: '输入不合法' }
      ];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

//子表列表数据——————测试项
export const basWfsTestItemColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    sorter: true,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '标识',
    align: 'center',
    dataIndex: 'testTag_dictText',
    width: 115,
    sorter: true,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 115,
  },
  {
    title: '下限比较符', // 下限比较符
    align: 'center',
    dataIndex: 'minOperators_dictText',
    slots: { customRender: 'minOperators' },
    width: 115,
    sorter: true,
  },
  {
    title: '规格下限',
    align: 'center',
    dataIndex: 'limitMin',
  },
  {
    title: '上限比较符', // 上限比较符
    align: 'center',
    dataIndex: 'maxOperators_dictText',
    slots: { customRender: 'maxOperators' },
    width: 115,
    sorter: true,
  },
  {
    title: '规格上限',
    align: 'center',
    dataIndex: 'limitMax',
  },
];
//子表表单数据
export const basWfsTestItemFormSchema: FormSchema[] = [
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
    componentProps: {},
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '标识',
    field: 'testTag',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'Inspection_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入标识!' }];
    },
  },
  {
    label: '下限比较符',
    field: 'minOperators',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lower_limit',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '规格下限',
    field: 'limitMin',
    component: 'InputNumber',
  },
  {
    label: '上限比较符',
    field: 'maxOperators',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'top_limit',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '规格上限',
    field: 'limitMax',
    component: 'InputNumber',
  },
  {
    label: '单位',
    field: 'unitId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
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
          {
            name: '是否默认',
            code: 'isDefault_dictText',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 6,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
  },
];
