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
    title: '末检检验单',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'lotSn',
    width: 150,
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'stationId_dictText',
    width: 150,
  },
  {
    title: '工位',
    align: 'center',
    dataIndex: 'wkpId_dictText',
    width: 150,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'trackQty_dictText',
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
    label: '工单号',
    field: 'moCode',
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
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工位',
    field: 'wkpQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '末检检验单',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
