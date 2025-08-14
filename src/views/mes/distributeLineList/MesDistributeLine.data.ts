import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'sn',
    width: 150,
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
    width: 150,
  },
  {
    title: '派工单',
    align: 'center',
    dataIndex: 'moPlanId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '下发数量',
    align: 'center',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  {
    title: '下发产线工位',
    align: 'center',
    dataIndex: 'wkpId_dictText',
    width: 150,
  },
  {
    title: '结果',
    align: 'center',
    dataIndex: 'result',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '成功', value: 'Y', isChecked: true },
        { text: '失败', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '消息提示',
    align: 'center',
    dataIndex: 'message',
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '流转卡/序列号',
    field: 'sn',
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
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入在制流转卡号!' }];
    },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工单!' }];
    },
  },
  {
    label: '派工单',
    field: 'moPlanId_dictText',
    component: 'Input',
  },
  {
    label: '产品',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入产品!' }];
    },
  },
  {
    label: '下发数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入下发数量!' }];
    },
  },
  {
    label: '工艺工序',
    field: 'wfsId_dictText',
    component: 'Input',
  },
  {
    label: '下发产线工位',
    field: 'wkpId_dictText',
    component: 'Input',
  },
  {
    label: '结果',
    field: 'result',
    component: 'Switch',
    componentProps: {
      //开关大小，可选值：default small
      size: 'default',
      //非选中时的内容
      unCheckedChildren: '失败',
      //非选中时的值
      unCheckedValue: 'N',
      //选中时的内容
      checkedChildren: '成功',
      //选中时的值
      checkedValue: 'Y',
    },
  },
  {
    label: '消息提示',
    field: 'message',
    component: 'InputTextArea',
  },
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
