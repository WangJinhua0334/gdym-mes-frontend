import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

// 收料记录列表数据
export const columns: BasicColumn[] = [
  {
    title: '钢卷号',
    align: 'center',
    dataIndex: 'internalCoilNumber',
    width: 150,
    fixed: 'left',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'materialName',
    width: 150,
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'materialNumber',
    width: 150,
  },
  {
    title: '规格型号',
    align: 'center',
    dataIndex: 'modelNumber',
    width: 150,
  },
  {
    title: '重量',
    align: 'center',
    dataIndex: 'weight',
    width: 100,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'baseUnitId_dictText',
    width: 100,
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'supplierId_dictText',
    width: 150,
  },
  {
    title: '车牌号',
    align: 'center',
    dataIndex: 'licensePlateNumber',
    width: 120,
  },
  {
    title: '收料后的第一道工序',
    align: 'center',
    dataIndex: 'firstOperationNumber_dictText',
    width: 180,
  },
  {
    title: '入库时间',
    align: 'center',
    dataIndex: 'productionDate',
    width: 160,
  },
  {
    title: '收料员工',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 120,
  },
  {
    title: '生产编号',
    align: 'center',
    dataIndex: 'materialDesc',
    width: 200,
  },
];

// 查询表单配置
export const searchFormSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'internalCoilNumber',
    component: 'JInput',
    colProps: { span: 6 },
  },
  // {
  //   label: '供应商',
  //   field: 'supplierId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       methods: 'get',
  //       url: '/basic/basSupplier/getAllSupplier',
  //       params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}' },
  //       columns: [
  //         {
  //           name: '编码',
  //           code: 'id',
  //         },
  //         {
  //           name: '供应商名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       multi: true,
  //       maxTagCount: 2,
  //       placeholder: '请选择供应商',
  //     };
  //   },
  //   colProps: { span: 6 },
  // },
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '物料编码',
    field: 'materialNumber',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'materialName',
    component: 'JInput',
    colProps: { span: 6 },
  },
];

// 编辑弹窗表单配置
export const editFormSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'Input', show: false },
  {
    label: '钢卷号',
    field: 'internalCoilNumber',
    component: 'Input',
    componentProps: { disabled: true },
    colProps: { span: 12 },
  },
  {
    label: '收料后的第一道工序',
    field: 'firstOperationNumber',
    component: 'RadioButtonGroup',
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '酸洗', value: '10' },
        { label: '退火', value: '40' },
      ],
    },
    dynamicRules: () => [
      { required: true, message: '请选择钢卷的第一道工序!', trigger: 'change' },
    ],
  },
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'Input',
    componentProps: { placeholder: '请输入车牌号' },
    colProps: { span: 12 },
  },
  {
    label: '生产编号',
    field: 'materialDesc',
    component: 'Input',
    componentProps: { placeholder: '请输入生产编号'},
    colProps: { span: 12 },
  },
  {
    label: '入库时间',
    field: 'productionDate',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: { width: '100%' },
    },
    colProps: { span: 12 },
  },
];

// 打印模板表单配置
export const printFormSchema: FormSchema[] = [
  {
    label: '打印模板',
    field: 'templateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'code', order: 'asc' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        getPopupContainer: () => document.body,
      };
    },
    defaultValue: '1986615937373085698',
    dynamicRules: () => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];

