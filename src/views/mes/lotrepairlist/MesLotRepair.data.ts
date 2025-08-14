import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '返工单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '派工单',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
  },
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'lotSn',
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'lotQty',
  },

  {
    title: '工艺工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
  },

  {
    title: '检验单',
    align: 'center',
    dataIndex: 'lotInspId_dictText',
  },

  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'repair_status', true);
    },
  },
  {
    title: '返工人',
    align: 'center',
    dataIndex: 'repairBy_dictText',
  },
  {
    title: '返工时间',
    align: 'center',
    dataIndex: 'repairTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '返工单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '流转卡/序列号',
    field: 'lotSn',
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
    label: '任务单号',
    field: 'moPlanCodeQuery',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '返工人',
    field: 'repairBy',
    component: 'JSelectUser',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'repair_status',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'lotId',
    component: 'Input',
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'Input',
  },
  {
    label: '数量',
    field: 'lotQty',
    component: 'InputNumber',
  },
  {
    label: '工单',
    field: 'moId',
    component: 'Input',
  },
  {
    label: '派工单',
    field: 'moPlanId',
    component: 'Input',
  },
  {
    label: '工艺工序',
    field: 'wfsId',
    component: 'Input',
  },
  {
    label: '工序',
    field: 'stationId',
    component: 'Input',
  },
  {
    label: '在制检验单',
    field: 'lotInspId',
    component: 'Input',
  },
  {
    label: '返工单号',
    field: 'code',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Input',
  },
  {
    label: '返工人',
    field: 'repairBy',
    component: 'Input',
  },
  {
    label: '返工时间',
    field: 'repairTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
//子表列表数据
export const mesLotRepairDetailColumns: BasicColumn[] = [
  {
    title: '维修主表Id',
    align: 'center',
    dataIndex: 'lotRepairId',
  },
  {
    title: '缺陷代码',
    align: 'center',
    dataIndex: 'defectId',
  },
  {
    title: '缺陷数量',
    align: 'center',
    dataIndex: 'defectQty',
  },
  {
    title: '缺陷描述',
    align: 'center',
    dataIndex: 'defectDesc',
  },
  {
    title: '不良原因',
    align: 'center',
    dataIndex: 'defectReasonId',
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapQty',
  },
  {
    title: '报废原因',
    align: 'center',
    dataIndex: 'scrapReason',
  },
  {
    title: '维修内容',
    align: 'center',
    dataIndex: 'repairDesc',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表格配置
export const mesLotRepairDetailJVxeColumns: JVxeColumn[] = [
  {
    title: '维修主表Id',
    key: 'lotRepairId',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '缺陷代码',
    key: 'defectId',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '缺陷数量',
    key: 'defectQty',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '缺陷描述',
    key: 'defectDesc',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '不良原因',
    key: 'defectReasonId',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '报废数量',
    key: 'scrapQty',
    type: JVxeTypes.inputNumber,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '报废原因',
    key: 'scrapReason',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '维修内容',
    key: 'repairDesc',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
