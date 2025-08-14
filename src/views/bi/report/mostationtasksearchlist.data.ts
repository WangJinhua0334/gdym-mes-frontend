import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

//列表数据
export const mostationtaskColumns: BasicColumn[] = [
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
    width: 160,
  },
  {
    title: '工作中心',
    align: 'center',
    dataIndex: 'wkcIds_dictText',
    width: 160,
  },
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
    title: '流转卡类型',
    align: 'center',
    dataIndex: 'moSnType',
    width: 160,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_sn_type', true);
    },
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'sn',
    width: 160,
  },
  {
    title: '工艺工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  // {
  //   title: '工序',
  //   align: 'center',
  //   dataIndex: 'stationId_dictText',
  //   width: 150,
  // },
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
export const mostationtaskSearchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '任务单号',
    field: 'moPlanCode',
    component: 'Input',
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
    label: '流转卡号',
    field: 'sn',
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
];
