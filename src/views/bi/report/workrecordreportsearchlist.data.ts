import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const workrecordreportColumns: BasicColumn[] = [
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 160,
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
    title: '流转卡号',
    align: 'center',
    dataIndex: 'moSn',
    width: 160,
  },
  {
    title: '流转产品编码',
    align: 'center',
    dataIndex: 'moSnProdId_dictText',
    width: 160,
  },
  {
    title: '流转产品名称',
    align: 'center',
    dataIndex: 'moSnProdName_dictText',
    width: 160,
  },
  {
    title: '当前工艺工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 160,
  }
  ,{
    title: '标准工时（H）',
    align: 'center',
    dataIndex: 'standardHours',
    width: 120,
  },
  {
    title: '实际工时（H）',
    align: 'center',
    dataIndex: 'actualHours',
    width: 120,
  }
];
//查询数据
export const workrecordreportSearchFormSchema: FormSchema[] = [
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
  // {
  //   label: '产品',
  //   field: 'prodQuery',
  //   component: 'JInput',
  //   colProps: { span: 6 },
  // },
];