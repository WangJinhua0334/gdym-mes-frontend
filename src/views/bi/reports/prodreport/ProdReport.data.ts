import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '产品型号',
    align: 'center',
    dataIndex: 'picNo',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'title',
    width: 150,
  },
  {
    title: '库存数',
    align: 'center',
    dataIndex: 'completeQty',
    width: 150,
  },
];
//查询数据
export const formSchema: FormSchema[] = [
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
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择',
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '产品型号',
    field: 'picNo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
];
