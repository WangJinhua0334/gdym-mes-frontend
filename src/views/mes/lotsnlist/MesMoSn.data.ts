import { BasicColumn, FormSchema } from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '流转卡号',
    sorter: true,
    align: 'center',
    dataIndex: 'sn',
    fixed: true,
    width: 150,
  },
  {
    title: '流转卡类型',
    align: 'center',
    dataIndex: 'snType_dictText',
    width: 120,
  },
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 150,
  },
  {
    title: '任务单号',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
    width: 150,
  },
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 350,
  },
  {
    title: '记录批次唯一码',
    align: 'center',
    dataIndex: 'isUniqSn',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 120,
  },
  {
    title: '是否投产',
    align: 'center',
    dataIndex: 'isInput',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '投产人',
    align: 'center',
    dataIndex: 'inputBy_dictText',
    width: 120,
  },
  {
    title: '投产时间',
    align: 'center',
    dataIndex: 'inputTime',
    width: 120,
  },
  {
    title: '完成数量',
    align: 'center',
    dataIndex: 'completeQty',
    width: 120,
  },
  {
    title: '是否完工',
    align: 'center',
    dataIndex: 'isComplete',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '完工人',
    align: 'center',
    dataIndex: 'completeBy_dictText',
    width: 120,
  },
  {
    title: '完工时间',
    align: 'center',
    dataIndex: 'completeTime',
    width: 120,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapedQty',
    width: 120,
  },
  {
    title: '是否报废',
    align: 'center',
    dataIndex: 'isScrap',
    width: 120,
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '报废人',
    align: 'center',
    dataIndex: 'scrapBy_dictText',
    width: 100,
  },
  {
    title: '报废时间',
    align: 'center',
    dataIndex: 'scrapTime',
    width: 150,
  },
];

/**查询表单配置 */
export function getSearchFormSchema(moId, moPlanId): FormSchema[] {
  const retValue = [];
  if ((!moId || moId == '') && (!moPlanId || moPlanId == '')) {
    retValue.push({
      label: '工单号',
      field: 'moCode',
      component: 'Input',
      colProps: { span: 6 },
    });
  }

  if (!moPlanId || moPlanId == '') {
    retValue.push({
      label: '生产任务单号',
      field: 'moPlanCode',
      component: 'Input',
      colProps: { span: 6 },
    });
  }

  retValue.push({
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编码或名称',
    },
    colProps: { span: 6 },
  });

  retValue.push({
    label: '流转卡',
    field: 'sn',
    component: 'JInput',
    colProps: { span: 6 },
  });

  return retValue;
}

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'code',
    component: 'Input',
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
  {
    label: '流转卡',
    field: 'sn',
    component: 'JInput',
    componentProps: {
      dictCode: 'mo_type',
    },
    colProps: { span: 6 },
  },
];
//替换绑定数据
export const bindFormSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: 'snID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '任务单号',
    field: 'moPlanId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '加工物料',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '物料条码',
    field: 'bindSn',
    component: 'Input',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入物料条码！' }];
    },
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
