import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Description } from '/@/components/Description';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料条码',
    align: 'center',
    dataIndex: 'lwmsSn',
    width: 150,
  },
  {
    title: '库位',
    align: 'center',
    width: 270,
    dataIndex: 'whBinId_dictText',
    customRender: ({ record }: { record: any }) => {
      return h(Description, {
        column: 1,
        bordered: false,
        data: { whName: record.whId_dictText, whAreaName: record.whAreaId_dictText, whBinName: record.whBinId_dictText },
        schema: [
          {
            field: 'whAreaName',
            label: '仓库名称',
          },
          {
            field: 'whBinName',
            label: '仓库区域',
          },
          {
            field: 'whBinName',
            label: '区域库位',
          },
        ],
      });
    },
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 150,
    customRender: ({ text }) => {
      return text || '暂无';
    },
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodCode_dictText',
    width: 150,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 200,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'rdType',
    width: 150,
  },
  {
    title: '库存数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 150,
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '类型',
    field: 'rdType',
    component: 'Select',
    componentProps: {
      options: [
        { label: '出库', value: '出库' },
        { label: '入库', value: '入库' },
      ],
    },
  },
  {
    label: '物料条码',
    field: 'lwmsSn',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码',
    field: 'prodCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
