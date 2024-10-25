import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
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
