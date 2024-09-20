import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '不良单号',
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
    title: '流转卡/序列号',
    dataIndex: 'lotSn',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '来源类型',
    dataIndex: 'sourceType_dictText',
    width: 200,
    sorter: true,
    align: 'center',
  },
  {
    title: '来源单号',
    dataIndex: 'sourceCode',
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
    title: '检验人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'inspBy_dictText',
  },
  {
    title: '检验时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'inspTime',
  },
  {
    title: '处理人',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'handleBy_dictText',
  },
  {
    title: '处理时间',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'handleTime',
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
    label: '不良单号',
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
    label: '流传卡/序列号',
    field: 'lotSnQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '来源类型',
    field: 'sourceType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'LotDefectiveSouceType',
    },
    colProps: { span: 6 },
  },
  {
    label: '检验人',
    field: 'inspBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '处理人',
    field: 'handleBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  // {
  //   label: '状态',
  //   field: 'status',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'defective_status',
  //   },
  //   colProps: { span: 6 },
  // },
  {
    label: '处理结果',
    field: 'handleMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'defective_handle_method',
    },
    colProps: { span: 6 },
  },
];
