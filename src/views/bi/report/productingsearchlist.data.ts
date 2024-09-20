import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const productionColumns: BasicColumn[] = [
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 160,
  },
  // {
  //   title: '工作中心',
  //   align: 'center',
  //   dataIndex: 'wkcIds_dictText',
  //   width: 160,
  // },
  {
    title: '产品分类',
    align: 'center',
    dataIndex: 'prodType_dictText',
    width: 160,
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
    width: 160,
  },
  {
    title: '生产状态',
    align: 'center',
    dataIndex: 'status_dictText',
    width: 120,
  },
  {
    title: '操作员',
    align: 'center',
    dataIndex: 'operateBys_dictText',
    width: 120,
  },
  // {
  //   title: '当前工序开始时间',
  //   align: 'center',
  //   dataIndex: 'acStartTime',
  //   width: 120,
  // },
  // {
  //   title: '当前工序',
  //   align: 'center',
  //   dataIndex: 'wfsId_dictText',
  //   width: 120,
  // },
  {
    title: '计划数量',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
  },
  {
    title: '已完工数量',
    align: 'center',
    dataIndex: 'completedQty',
    width: 120,
  },
  // {
  //   title: '合格数量',
  //   align: 'center',
  //   dataIndex: 'okQty',
  //   width: 120,
  // },
  // {
  //   title: '不合格数量',
  //   align: 'center',
  //   dataIndex: 'ngQty',
  //   width: 120,
  // },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '计划开始日期',
    align: 'center',
    dataIndex: 'planStartTime',
    width: 150,
  },
  {
    title: '计划结束日期',
    align: 'center',
    dataIndex: 'planCompleteTime',
    width: 150,
  },
];
//查询数据
export const productionSearchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编码或名称',
    },
    colProps: { span: 6 },
  },
  {
    label: '生产车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
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
        pageSize: 10,
        multi: true,
        maxTagCount: 2,
        placeholder: '请选择',
      };
    },
    colProps: { span: 6 },
  },
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
];