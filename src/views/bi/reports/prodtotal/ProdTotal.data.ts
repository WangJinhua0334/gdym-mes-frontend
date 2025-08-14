import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
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
    title: '设备',
    align: 'center',
    dataIndex: 'equipId_dictText',
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
    title: '计划数',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
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
    title: '批号',
    align: 'center',
    dataIndex: 'batch',
    width: 150,
  },
  {
    title: '报工人',
    align: 'center',
    dataIndex: 'wokeBy_dictText',
    width: 200,
  },
  {
    title: '停机时间(分)',
    align: 'center',
    dataIndex: 'stopTime',
    width: 150,
  },
  {
    title: '停机原因',
    align: 'center',
    dataIndex: 'stopCause',
    width: 200,
  },
  {
    title: '加工时间(分)',
    align: 'center',
    dataIndex: 'wokeHour',
    width: 150,
  },
  {
    title: '达成率',
    align: 'center',
    dataIndex: 'overRate',
    width: 120,
    format: (text) => {
      return !text ? '' : text + '%';
    },
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
    defaultValue: [dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
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
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];
