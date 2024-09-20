import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '报废单号',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '工单',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'moId_dictText',
  },
  {
    title: '生产任务',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'moPlanId_dictText',
  },
  {
    title: '流转卡/序列号',
    dataIndex: 'lotSn',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '产品编码',
    dataIndex: 'prodId_dictText',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '产品名称',
    dataIndex: 'prodName_dictText',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '缺陷代码',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'defectId_dictText',
  },
  {
    title: '缺陷数量',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'defectQty',
  },
  {
    title: '报废来源',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'scrapType_dictText',
  },
  {
    title: '报废数量',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'scrapQty',
  },
  {
    title: '提交人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'submitBy_dictText',
  },
  {
    title: '提交时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'submitTime',
  },
  {
    title: '审核人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'checkBy_dictText',
  },
  {
    title: '审核时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'checkTime',
  },
  {
    title: '状态',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'status_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '报废单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlanCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '提交人',
    field: 'submitBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '审核人',
    field: 'checkBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_status',
    },
    colProps: { span: 6 },
  },
  {
    label: '审核结果',
    field: 'result',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_result',
    },
    colProps: { span: 6 },
  },
  {
    label: '报废单来源',
    field: 'scrapType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'scrap_type',
    },
    colProps: { span: 6 },
  },
];
