import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '规则编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '规则名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '规则编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '规则名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '规则编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入规则编码!' }];
    },
  },
  {
    label: '规则名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入规则名称!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
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
export const basPackRuleDetailColumns: BasicColumn[] = [
  {
    title: '包装层级',
    align: 'center',
    dataIndex: 'packLevel',
    width: 100,
  },
  {
    title: '包装单位',
    align: 'center',
    dataIndex: 'packUnitId_dictText',
    width: 200,
  },
  {
    title: '最小包装单位',
    align: 'center',
    dataIndex: 'isMinPack',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: '1', isChecked: true },
        { text: '否', value: '0', isChecked: false },
      ]);
    },
  },
  {
    title: '包装数量',
    align: 'center',
    dataIndex: 'packQty',
    width: 100,
  },
  {
    title: '生成包装条码',
    align: 'center',
    dataIndex: 'isNewSn',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: '1', isChecked: true },
        { text: '否', value: '0', isChecked: false },
      ]);
    },
  },
  {
    title: '包装编码规则',
    align: 'center',
    dataIndex: 'ruleCode',
    width: 100,
  },
  {
    title: '是否打印',
    align: 'center',
    dataIndex: 'isPrint',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: '1', isChecked: true },
        { text: '否', value: '0', isChecked: false },
      ]);
    },
  },
  {
    title: '模板类型',
    align: 'center',
    dataIndex: 'templateType_dictText',
  },
];
//子表表格配置
export const basPackRuleDetailJVxeColumns: JVxeColumn[] = [
  {
    title: '层级',
    key: 'packLevel',
    type: JVxeTypes.inputNumber,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  /*{
      title: '包装单位',
      key: 'packUnitId',
      type: JVxeTypes.select,
      options:[],
      dictCode:"bas_pack_unit,name,id",
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },*/
  {
    title: '包装单位',
    key: 'packUnitId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/packUnit/basPackUnit/list',
    params: { column: 'createTime', order: 'desc', /*code: '${code}',*/ searchFields: 'code,name' },
    //pageSize: 10,
    width: '250px',
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
    labelKey: 'name',
    //multi: false,
    //maxTagCount: 4,
    //linkmap: [{ name: 'packUnitCode_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '最小包装单位',
    key: 'isMinPack',
    type: JVxeTypes.checkbox,
    customValue: [1, 0],
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '包装数量',
    key: 'packQty',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '生成包装条码',
    key: 'isNewSn',
    type: JVxeTypes.checkbox,
    customValue: [1, 0],
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '包装编码规则',
    key: 'ruleCode',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '是否打印',
    key: 'isPrint',
    type: JVxeTypes.checkbox,
    customValue: [1, 0],
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '模板类型',
    key: 'templateType',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'print_template_type',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
