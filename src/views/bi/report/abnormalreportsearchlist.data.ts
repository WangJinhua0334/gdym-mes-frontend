import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const abnormalreportColumns: BasicColumn[] = [
  {
    title: '异常类型',
    align: 'center',
    dataIndex: 'abnormalType',
    width: 120,
  },
  {
    title: '异常次数',
    align: 'center',
    dataIndex: 'abnormalNum',
    width: 120,
  },
];
//查询数据
export const abnormalreportSearchFormSchema: FormSchema[] = [
  // {
  //   label: '生产车间',
  //   field: 'wksId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;

  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       methods: 'get',
  //       url: '/workshop/basWorkShop/list',
  //       params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
  //       columns: [
  //         {
  //           name: '编码',
  //           code: 'code',
  //         },
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       pageSize: 10,
  //       multi: true,
  //       maxTagCount: 2,
  //       placeholder: '请选择',
  //     };
  //   },
  //   colProps: { span: 6 },
  // },
  // {
  //   label: '工作中心',
  //   field: 'wkcId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;

  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       methods: 'get',
  //       url: '/workcenter/basWorkCenter/list',
  //       params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
  //       columns: [
  //         {
  //           name: '编码',
  //           code: 'code',
  //         },
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       pageSize: 10,
  //       multi: true,
  //       maxTagCount: 2,
  //       placeholder: '请选择',
  //     };
  //   },
  //   colProps: { span: 6 },
  // },
  // {
  //   label: '工位',
  //   field: 'wkpId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;

  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       methods: 'get',
  //       url: '/workpost/basWorkPost/list',
  //       params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
  //       columns: [
  //         {
  //           name: '编码',
  //           code: 'code',
  //         },
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       pageSize: 10,
  //       multi: true,
  //       maxTagCount: 2,
  //       placeholder: '请选择',
  //     };
  //   },
  //   colProps: { span: 6 },
  // },
  // {
  //   label: '状态',
  //   field: 'status',
  //   component: 'JSelectMultiple',
  //   componentProps: {
  //     dictCode: 'abnormal_status',
  //   },
  // },
  {
    label: '开始时间',
    field: 'dateRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD',
      // 设置不可选
      // disabledDate: (current) => {
      //   // 不可选择未来时间
      //   return current && current > Date.now() + 1;
      // },
      getPopupContainer: (node) => document.body,
    },
  },
];