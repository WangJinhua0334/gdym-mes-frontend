import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref } from '@vue/runtime-core';

// export const scanFunc = ref<any>(null);

// export const wkpId = ref<string>('');
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工装编号',
    align: 'center',
    sorter: true,
    dataIndex: 'fixtureId_dictText',
    width: 150,
  },
  {
    title: '工装名称',
    align: 'center',
    sorter: true,
    dataIndex: 'fixtureName_dictText',
    width: 150,
  },
  {
    title: '校验人',
    align: 'center',
    sorter: true,
    dataIndex: 'inspBy_dictText',
    width: 150,
  },
  {
    title: '校验时间',
    align: 'center',
    sorter: true,
    dataIndex: 'inspTime',
    width: 150,
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '校验结果',
    sorter: true,
    align: 'center',
    dataIndex: 'result',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'fixture_pass_ng', true);
    },
  },
  {
    title: '校验次数',
    align: 'center',
    sorter: true,
    dataIndex: 'inspTimes',
    width: 150,
  },
  {
    title: '校验工时',
    align: 'center',
    sorter: true,
    dataIndex: 'hours',
    width: 150,
  },
  {
    title: '校验价格',
    align: 'center',
    sorter: true,
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
    label: '工装编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '工装名称',
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
      dictCode: 'fixture_pass_ng',
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
    field: 'fixtureId',
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
export const emaFixtureInspItemSelectFormSchema: FormSchema[] = [];
//子列表数据
export const fixFixtureInspItemColumns: BasicColumn[] = [
  {
    title: '序号',
    align: 'center',
    sorter: true,
    dataIndex: 'orderNo',
    width: 150,
  },
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '内容',
    align: 'center',
    sorter: true,
    dataIndex: 'content',
    width: 200,
  },
  {
    title: '上限',
    align: 'center',
    sorter: true,
    dataIndex: 'limitMax',
    width: 150,
  },
  {
    title: '下限',
    align: 'center',
    sorter: true,
    dataIndex: 'limitMin',
    width: 150,
  },
  {
    title: '值',
    align: 'center',
    sorter: true,
    dataIndex: 'value',
    width: 150,
  },
  {
    title: '是否合格',
    align: 'center',
    sorter: true,
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
export const fixFixtureInspItemJVxeColumns: JVxeColumn[] = [
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
