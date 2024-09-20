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
    title: '出厂检验编号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '条码',
    align: 'center',
    dataIndex: 'lotSn',
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'stationId_dictText',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'trackQty_dictText',
  },
  {
    title: '抽样数量',
    align: 'center',
    dataIndex: 'samplingQty',
  },
  {
    title: '结果',
    align: 'center',
    dataIndex: 'result',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },
  },
  {
    title: '缺陷代码',
    align: 'center',
    dataIndex: 'defectIds_dictText',
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
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
  },
  {
    title: '检验时间',
    align: 'center',
    dataIndex: 'inspTime',
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '出厂检验编号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
