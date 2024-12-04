import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

// export const scanFunc = ref<any>(null);

// export const wkpId = ref<string>('');
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '量具编号',
    align: 'center',
    sorter: true,
    dataIndex: 'measuringId_dictText',
    width: 150,
  },
  {
    title: '量具名称',
    align: 'center',
    dataIndex: 'measuringName_dictText',
    width: 150,
  },
  {
    title: '检验人',
    align: 'center',
    dataIndex: 'inspBy_dictText',
    width: 150,
  },
  {
    title: '校验日期',
    align: 'center',
    dataIndex: 'inspTime',
    width: 150,
  },
  {
    title: '校验结果',
    align: 'center',
    dataIndex: 'result',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'pass_ng', true);
    },
  },
  {
    title: '校验次数',
    align: 'center',
    dataIndex: 'inspTimes',
    width: 150,
  },
  {
    title: '校验工时',
    align: 'center',
    dataIndex: 'hours',
    width: 150,
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'attachments',
    width: 150,
    slots: { customRender: 'fileSlot' },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '量具编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '量具名称',
    field: 'name',
    component: 'Input',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '校验结果',
    field: 'result',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'pass_ng',
    },
  },
  {
    label: '校验工时',
    field: 'hours',
    component: 'InputNumber',
  },
  {
    label: '校验价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {},
  },
  {
    label: '校验状态',
    field: 'status',
    component: 'InputNumber',
    defaultValue: 'Inspected',
    show: false,
  },
  {
    label: '模具ID',
    field: 'measuringId',
    component: 'Input',
    show: false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//查询子列表数据
export const emaMeasuringInspItemSelectFormSchema: FormSchema[] = [];
//子列表数据
export const mstMeasuringInspItemColumns: BasicColumn[] = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'orderNo',
    width: 150,
  },
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '内容',
    align: 'center',
    dataIndex: 'content',
    width: 200,
  },
  {
    title: '上限',
    align: 'center',
    dataIndex: 'limitMax',
    width: 150,
  },
  {
    title: '下限',
    align: 'center',
    dataIndex: 'limitMin',
    width: 150,
  },
  {
    title: '值',
    align: 'center',
    dataIndex: 'value',
    width: 150,
  },
  {
    title: '是否合格',
    align: 'center',
    dataIndex: 'result',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
];
//子表表格配置
export const mstMeasuringInspItemJVxeColumns: JVxeColumn[] = [
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '内容',
    key: 'content',
    type: JVxeTypes.textarea,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '上限',
    key: 'limitMax',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '下限',
    key: 'limitMin',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '值',
    key: 'value',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '是否合格',
    key: 'result',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    type: JVxeTypes.slot,
    width: '200px',
    placeholder: '请输入${title}',
    slotName: 'resultslot',
  },
];
