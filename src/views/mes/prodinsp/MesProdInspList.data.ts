import { BasicColumn } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { FormSchema } from '/@/components/Table';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'id',
    ifShow: false,
  },
  {
    title: '入库申请单号',
    align: 'center',
    dataIndex: 'prodInCode',
  },
  {
    title: '物料',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName',
  },
  {
    title: '检验单编号',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '抽样数量',
    align: 'center',
    dataIndex: 'samplingQty',
    width: 150,
  },
  {
    title: '结果',
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
  {
    title: '缺陷代码',
    align: 'center',
    dataIndex: 'defectIds_dictText',
    width: 150,
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 150,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '检验人',
    align: 'center',
    dataIndex: 'inspBy_dictText',
    width: 150,
  },
  {
    title: '检验时间',
    align: 'center',
    dataIndex: 'inspTime',
    width: 150,
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '检验单编号',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '入库申请单号',
    field: 'prodInCode',
    component: 'Input',
  },
  {
    label: '物料',
    field: 'prodQuery',
    component: 'Input',
  },
];
