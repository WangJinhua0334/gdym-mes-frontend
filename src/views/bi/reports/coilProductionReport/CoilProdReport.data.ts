import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '生产厂区',
    align: 'center',
    dataIndex: 'plantNumber_dictText',
    width: 150,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workshopId_dictText',
    width: 150,
  },
  {
    title: '工序号',
    align: 'center',
    dataIndex: 'operationNumber_dictText',
    width: 150,
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'flowCardId',
    width: 150,
  },
  {
    title: '旧钢卷号',
    align: 'center',
    dataIndex: 'oldCoilNo',
    width: 200,
  },
  {
    title: '旧物料编码',
    align: 'center',
    dataIndex: 'oldMaterialNumber',
    width: 200,
  },
  {
    title: '旧物料名称',
    align: 'center',
    dataIndex: 'oldMaterialName',
    width: 200,
  },
  {
    title: '旧规格型号',
    align: 'center',
    dataIndex: 'oldSpecification',
    width: 200,
  },
  {
    title: '旧钢卷重量',
    align: 'center',
    dataIndex: 'oldCoilWeight',
    width: 200,
  },
  {
    title: '开工班组',
    align: 'center',
    dataIndex: 'startTeamName_dictText',
    width: 150,
  },
  {
    title: '开工时间',
    align: 'center',
    dataIndex: 'startTime',
    width: 150,
  },
  {
    title: '新钢卷号',
    align: 'center',
    dataIndex: 'newCoilNo',
    width: 200,
  },
  {
    title: '新物料编码',
    align: 'center',
    dataIndex: 'newMaterialNumber',
    width: 200,
  },
  {
    title: '新物料名称',
    align: 'center',
    dataIndex: 'newMaterialName',
    width: 200,
  },
  {
    title: '新规格型号',
    align: 'center',
    dataIndex: 'newSpecification',
    width: 200,
  },
  {
    title: '新钢卷重量',
    align: 'center',
    dataIndex: 'newCoilWeight',
    width: 200,
  },
  {
    title: '完工班组',
    align: 'center',
    dataIndex: 'endTeam_dictText',
    width: 200,
  },
  {
    title: '完工时间',
    align: 'center',
    dataIndex: 'endTime',
    width: 200,
  },
  {
    title: '工序状态',
    align: 'center',
    dataIndex: 'status_dictText',
    width: 100,
  },
];
//查询数据
export const formSchema: FormSchema[] = [
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
        url: '/basic/basWorkShop/list',
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
    label: '工序',
    field: 'operationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/basic/operation/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'operationName,operationNumber'},
        columns: [
          {
            name: '编码',
            code: 'operationNumber',
          },
          {
            name: '名称',
            code: 'operationName',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['operationName'],
        pageSize: 10,
        multi: false,
        maxTagCount: 2,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '旧钢卷号',
    field: 'oldCoilNo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '开工时间',
    field: 'startTimeRange',
    component: 'RangePicker',
    // colProps: { span: 10 },
    defaultValue: [dayjs().subtract(0, 'day').startOf('day').format("YYYY-MM-DD HH:mm:ss"), dayjs().endOf('day').format("YYYY-MM-DD HH:mm:ss")],
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['请选择开始时间', '请选择结束时间'],
      // 传给后端的时间格式
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      getPopupContainer: () => document.body,
    },
  },
];
