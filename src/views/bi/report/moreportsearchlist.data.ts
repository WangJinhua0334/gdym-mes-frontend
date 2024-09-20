import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const moreportColumns: BasicColumn[] = [
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '任务单号',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
    width: 160,
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'sn',
    width: 160,
  },
  {
    title: '流转卡类型',
    align: 'center',
    dataIndex: 'snType_dictText',
    width: 120,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'wksId_dictText',
    width: 120,
  },
  // {
  //   title: '工作中心',
  //   align: 'center',
  //   dataIndex: 'wkcId_dictText',
  //   width: 120,
  // },
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
    title: '生产进度',
    align: 'center',
    dataIndex: 'produced',
    width: 120,
  },
  {
    title: '流转卡进度',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
  },
  {
    title: '计划数量',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
  },
  {
    title: '已完工数量',
    align: 'center',
    dataIndex: 'completeQty',
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
  }
];
//查询数据
export const moreportSearchFormSchema: FormSchema[] = [
  {
    label: '生产车间',
    field: 'wksId',
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
  {
    label: '工单号',
    field: 'moCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '任务单号',
    field: 'moPlanQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'snQuery',
    component: 'Input',
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
];