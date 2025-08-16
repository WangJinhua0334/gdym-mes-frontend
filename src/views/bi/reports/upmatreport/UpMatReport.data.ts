import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '日期',
    align: 'center',
    dataIndex: 'wokeTime',
    width: 150,
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'wksId_dictText',
    width: 150,
  },
  {
    title: '工作中心',
    align: 'center',
    dataIndex: 'wkcId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '产品型号',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  {
    title: '合格数',
    align: 'center',
    dataIndex: 'okQty',
    width: 120,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '用料编码',
    align: 'center',
    dataIndex: 'matProdId_dictText',
    width: 150,
  },
  {
    title: '用料型号',
    align: 'center',
    dataIndex: 'matProdName_dictText',
    width: 150,
  },
  {
    title: '用料数量',
    align: 'center',
    dataIndex: 'matQty',
    width: 120,
  },
  {
    title: '合格率',
    align: 'center',
    dataIndex: 'okRate',
    width: 120,
    format: (text) => {
      return !text ? '' : text + '%';
    },
  },
  {
    title: '不良率',
    align: 'center',
    dataIndex: 'scrapRate',
    width: 120,
    format: (text) => {
      return !text ? '' : text + '%';
    },
  },
];
//查询数据
export const formSchema: FormSchema[] = [
  {
    label: '时间范围',
    field: 'dateRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    defaultValue: [dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD',
      getPopupContainer: () => document.body,
    },
  },
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
    label: '工作中心',
    field: 'wkcId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/workcenter/basWorkCenter/list',
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
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];
