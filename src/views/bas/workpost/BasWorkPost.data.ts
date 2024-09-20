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
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
  },
  {
    title: '类型',
    align: 'center',
    sorter: true,
    dataIndex: 'type_dictText',
  },
  {
    title: '位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
  },
  {
    title: '工位IP',
    align: 'center',
    sorter: true,
    dataIndex: 'ip',
  },
  {
    title: '工作中心',
    align: 'center',
    sorter: true,
    dataIndex: 'wkcId_dictText',
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
      dictCode: 'work_post_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工位分类!' }];
    },
  },
  {
    label: '位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '工位IP',
    field: 'ip',
    component: 'Input',
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
        method: 'get',
        url: '/workcenter/basWorkCenter/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        //multi: false,
        //maxTagCount: 2,
        placeholder: '请选择',
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工作中心!' }];
    },
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
//子表表格配置
export const basWorkPostStationColumns: BasicColumn[] = [
  {
    title: '工序编码',
    align: 'center',
    dataIndex: 'stationId_dictText',
  },
  {
    title: '工序名称',
    align: 'center',
    dataIndex: 'stationName_dictText',
  },
];
//子表列表数据
export const basWorkPostEquipColumns: BasicColumn[] = [
  {
    title: '设备编码',
    align: 'center',
    dataIndex: 'equipId_dictText',
  },
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'equipName_dictText',
  },
];
export const basWorkPostStationJVxeColumns: JVxeColumn[] = [
  {
    title: '工序编码',
    key: 'stationId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/station/basStation/listByType',
    params: { column: 'code', order: 'asc', filterType: 'station_group', searchFields: 'code,name' },
    //pageSize: 10,
    //width: '200px',
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
    // multi: true,
    //maxTagCount: 4,
    linkmap: [{ name: 'stationName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '工序名称',
    key: 'stationName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
];
export const basWorkPostEquipJVxeColumns: JVxeColumn[] = [
  {
    title: '设备编码',
    key: 'equipId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/equipment/basEquipment/list',
    params: { column: 'createTime', order: 'desc', /*code: '${code}',*/ searchFields: 'code,name' },
    //pageSize: 10,
    //width: '200px',
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
    linkmap: [{ name: 'equipName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '设备名称',
    key: 'equipName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
];
/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
/*export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}*/
