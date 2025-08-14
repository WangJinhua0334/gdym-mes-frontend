import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '日期',
    align: 'center',
    dataIndex: 'date',
    width: 120,
  },
];
//查询数据
export const formSchema: FormSchema[] = [
  {
    label: '时间范围',
    field: 'dateRange',
    component: 'RangePicker',
    colProps: { span: 6 },
    defaultValue: [dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
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
        multi: true,
        maxTagCount: 2,
        placeholder: '请选择',
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '产品编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
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
        labelKey: ['code', 'name'],
        placeholder: '请选择',
        queryBefore: (params) => {
          params.sourceType = 'product';
          return params;
        },
      };
    },
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/workpost/basWorkPost/list',
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
];
