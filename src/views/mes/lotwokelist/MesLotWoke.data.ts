import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

//调试记录列表配置
export const listColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 150,
  },
  {
    title: '生产任务',
    align: 'center',
    sorter: true,
    dataIndex: 'moPlanId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '产品名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
    width: 150,
  },
  {
    title: '图号',
    align: 'center',
    sorter: true,
    dataIndex: 'picNo_dictText',
    width: 150,
  },
  {
    title: '流转卡号',
    align: 'center',
    sorter: true,
    dataIndex: 'lotSn',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
  },
  {
    title: '动作',
    align: 'center',
    dataIndex: 'actionId_dictText',
    width: 100,
  },
  {
    title: '良品数量',
    align: 'center',
    sorter: true,
    dataIndex: 'okQty',
    width: 100,
  },
  {
    title: '不良品数量',
    align: 'center',
    sorter: true,
    dataIndex: 'ngQty',
    width: 110,
  },
  {
    title: '报废数量',
    align: 'center',
    sorter: true,
    dataIndex: 'scrapedQty',
    width: 100,
  },
  {
    title: '用料信息',
    align: 'center',
    sorter: true,
    dataIndex: 'matData',
    width: 300,
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '报工人',
    align: 'center',
    sorter: true,
    dataIndex: 'wokeBy_dictText',
    width: 120,
  },
  {
    title: '报工时间',
    align: 'center',
    sorter: true,
    dataIndex: 'wokeTime',
    width: 120,
  },
  {
    title: '设备',
    align: 'center',
    sorter: true,
    dataIndex: 'equipId_dictText',
    width: 120,
  },
  {
    title: '停机时间(分)',
    align: 'center',
    dataIndex: 'stopTime',
    width: 120,
  },
  {
    title: '停机原因',
    align: 'center',
    dataIndex: 'stopCause',
    width: 120,
  },
  {
    title: '是否返工',
    align: 'center',
    dataIndex: 'isRework',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
];
//调试记录列表查询配置
export const listSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'mo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlan',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '工序',
    field: 'station',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '报工人',
    field: 'wokeByQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '是否返工',
    field: 'isRework',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    defaultValue: 'N',
    colProps: { span: 6 },
  },
];
//打印模板
export const printFormSchema: FormSchema[] = [
  {
    label: '打印模板',
    field: 'templateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'code', order: 'asc' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];
