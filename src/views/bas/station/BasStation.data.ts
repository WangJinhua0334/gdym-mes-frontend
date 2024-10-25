import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '类型',
    align: 'center',
    sorter: true,
    dataIndex: 'type_dictText',
    width: 150,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '固定工时',
    align: 'center',
    dataIndex: 'fixedHours',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '标准工时',
    align: 'center',
    dataIndex: 'standardHours',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'station_type',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'station_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入类型!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '固定工时',
    field: 'fixedHours',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '标准工时',
    field: 'standardHours',
    component: 'InputNumber',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表列表数据
export const basStationActionColumns: BasicColumn[] = [
  {
    title: '顺序',
    align: 'center',
    sorter: true,
    dataIndex: 'sequence',
    width: 200,
  },
  {
    title: '动作',
    align: 'center',
    dataIndex: 'actionName_dictText',
    width: 200,
  },
];
//子表列表数据
export const basStationSkillColumns: BasicColumn[] = [
  {
    title: '技能编码',
    align: 'center',
    sorter: true,
    dataIndex: 'skillId_dictText',
    width: 150,
  },
  {
    title: '技能名称',
    align: 'center',
    dataIndex: 'skillName_dictText',
    width: 200,
  },
  {
    title: '等级',
    align: 'center',
    sorter: true,
    dataIndex: 'skillLevelId_dictText',
    width: 200,
  },
  {
    title: '等级名称',
    align: 'center',
    dataIndex: 'skillLevelName_dictText',
    width: 200,
  },
];
//子表列表数据
export const basChildStationColumns: BasicColumn[] = [
  {
    title: '子工序',
    align: 'center',
    dataIndex: 'childStationName_dictText',
    width: 200,
  },
  {
    title: '顺序',
    align: 'center',
    sorter: true,
    dataIndex: 'sequence',
    width: 200,
  },
];
//子表表格配置
export const basStationActionJVxeColumns: JVxeColumn[] = [
  {
    title: '动作编码',
    key: 'actionId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/action/basAction/list',
    params: { column: 'code', order: 'asc', /*code: '${code}',*/ searchFields: 'code,name' },
    //pageSize: 10,
    columns: [
      {
        name: '编号',
        code: 'code',
      },
      {
        name: '名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'code',
    linkmap: [{ name: 'actionName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: '*', message: '${title}格式不正确' },
    ],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '动作名称',
    key: 'actionName_dictText',
    width: 160,
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 80,
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];
export const basStationSkillJVxeColumns: JVxeColumn[] = [
  {
    title: '技能编码',
    key: 'skillId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/skill/basSkill/list',
    params: { column: 'code', order: 'asc', /*code: '${code}',*/ searchFields: 'code,name' },
    columns: [
      {
        name: '编号',
        code: 'code',
      },
      {
        name: '名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'code',
    linkmap: [{ name: 'skillName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '技能名称',
    key: 'skillName_dictText',
    width: 160,
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '等级',
    key: 'skillLevelId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/skill/basSkill/queryBasSkillLevelPageByMainId',
    params: { column: 'level', order: 'asc', skillId: '${skillId}' },
    columns: [
      {
        name: '等级',
        code: 'level',
      },
      {
        name: '等级名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'level',
    linkmap: [{ name: 'skillLevelName_dictText' }],
    placeholder: '请输入${title}',
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '等级名称',
    key: 'skillLevelName_dictText',
    width: 160,
    type: JVxeTypes.input,
    disabled: true,
  },
];
export const basChildStationJVxeColumns: JVxeColumn[] = [
  {
    title: '工序编码',
    key: 'childStationId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/station/basStation/listByType',
    params: { column: 'code', order: 'asc', filterType: 'station_group', searchFields: 'code,name' },
    //pageSize: 10,
    columns: [
      {
        name: '编号',
        code: 'code',
      },
      {
        name: '名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'code',
    //multi: false,
    //maxTagCount: 4,
    linkmap: [{ name: 'childStationName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '工序名称',
    key: 'childStationName_dictText',
    type: JVxeTypes.input,
    width: 200,
    disabled: true,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 80,
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];
