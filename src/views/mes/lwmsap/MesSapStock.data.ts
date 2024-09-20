import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'MATNR',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'MAKTX',
    width: 350,
  },
  {
    title: '库存地点',
    align: 'center',
    dataIndex: 'LGORT',
    format: (text) => {
      if (text == 'B004') {
        text = '物探所车间半成品库';
      } else if (text == '1008') {
        text = '物探销售领用库';
      } else if (text == '1010') {
        text = '物探营销备件库';
      } else if (text == '1006') {
        text = '研发库';
      } else if (text == '1005') {
        text = '物探成品库';
      }
      return text;
    },
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'MEINS',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'LABST',
  },
  {
    title: '批次编号',
    align: 'center',
    dataIndex: 'CHARG',
  },
  {
    title: '序列号',
    align: 'center',
    dataIndex: 'SERNR',
  },
  {
    title: '物料类型',
    align: 'center',
    dataIndex: 'MTART',
  },
  {
    title: '物料组',
    align: 'center',
    dataIndex: 'MATKL',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'MATNR',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '库存地点',
    field: 'LGORT',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehouse/basWarehouse/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
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
        rowKey: 'code',
        labelKey: ['name'],
        placeholder: '请选择',
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '物料类型',
    field: 'MTART',
    component: 'Input',
    colProps: { span: 6 },
  },
];
/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return [];
}
