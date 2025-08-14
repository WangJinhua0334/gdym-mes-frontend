import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

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
    label: '报废来源',
    field: 'scrapType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料分类',
    field: 'category',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_category',
    },
    colProps: { span: 6 },
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
    label: '工位',
    field: 'wkpQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const scrapColumns: BasicColumn[] = [
  {
    title: '报废单号',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '工单',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'moId_dictText',
  },
  {
    title: '生产任务',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'moPlanId_dictText',
  },
  {
    title: '流转卡/序列号',
    dataIndex: 'lotSn',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '产品编码',
    dataIndex: 'prodId_dictText',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '产品名称',
    dataIndex: 'prodName_dictText',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '缺陷代码',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'defectId_dictText',
  },
  {
    title: '缺陷数量',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'defectQty',
  },
  {
    title: '报废来源',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'scrapType_dictText',
  },
  {
    title: '报废数量',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'scrapQty',
  },
  {
    title: '提交人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'submitBy_dictText',
  },
  {
    title: '提交时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'submitTime',
  },
  {
    title: '审核人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'checkBy_dictText',
  },
  {
    title: '审核时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'checkTime',
  },
  {
    title: '状态',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'scrap_status', true);
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '报废单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlanCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '提交人',
    field: 'submitBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '审核人',
    field: 'checkBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '审核结果',
    field: 'result',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_result',
    },
    colProps: { span: 6 },
  },
  {
    label: '报废单来源',
    field: 'scrapType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '传递的产品',
    field: 'prodCode',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '日期',
    field: 'date',
    component: 'Input',
    dynamicDisabled: true,
  },
];
