import dayjs from 'dayjs';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

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
    title: '工位',
    align: 'center',
    dataIndex: 'wkpIds_dictText',
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
    slots: { customRender: 'listSlot' },
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
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const detailColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '派工单',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
  },
  {
    title: '加工产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '流转卡',
    align: 'center',
    dataIndex: 'sn',
  },
  {
    title: '工艺工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'stationId_dictText',
    width: 150,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 100,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '投入数量',
    align: 'center',
    dataIndex: 'inputQty',
    width: 100,
  },
  {
    title: '完工数量',
    align: 'center',
    dataIndex: 'completeQty',
    width: 100,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapQty',
    width: 100,
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 100,
  },
  {
    title: '不良次数',
    align: 'center',
    dataIndex: 'ngCout',
    width: 100,
  },
  {
    title: '维修数量',
    align: 'center',
    dataIndex: 'repairQty',
    width: 100,
  },
  {
    title: '维修次数',
    align: 'center',
    dataIndex: 'repairCout',
    width: 100,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'lot_status', true);
    },
  },
  {
    title: '工位',
    align: 'center',
    dataIndex: 'wkpIds_dictText',
  },
  {
    title: '操作员',
    align: 'center',
    dataIndex: 'operateBys_dictText',
  },
  {
    title: '计划开始时间',
    align: 'center',
    dataIndex: 'planStartTime',
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
  },
  {
    title: '实际开工时间',
    align: 'center',
    dataIndex: 'acStartTime',
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const detailFormSchema: FormSchema[] = [
  {
    label: '传递的产品',
    field: 'prodCode',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工序',
    field: 'wfsDesc',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '日期',
    field: 'date',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位',
    field: 'wkpDesc',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品Id查询',
    field: 'prodId',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工序ID查询',
    field: 'wfsId',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位ID查询',
    field: 'wkpIds',
    component: 'Input',
    dynamicDisabled: true,
  },
];
