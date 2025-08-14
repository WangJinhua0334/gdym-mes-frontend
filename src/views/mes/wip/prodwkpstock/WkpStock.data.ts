import { ref } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const doUpEnterPress = ref();
export const doDownEnterPress = ref();

//上料
export const upFormSchema: FormSchema[] = [
  {
    label: '物料条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doUpEnterPress.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '物料条码',
    field: 'materialSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料成本',
    field: 'materialCost',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '供应商',
    field: 'suppId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '是否提醒',
    field: 'isRemind',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 12 },
  },
  {
    label: '提醒值',
    field: 'remindQty',
    component: 'InputNumber',
    colProps: { span: 12 },
    defaultValue: 0,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '供应商id',
    field: 'suppId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单id',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料id',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
];
//下料
export const downFormSchema: FormSchema[] = [
  {
    label: '物料条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doDownEnterPress.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '物料条码',
    field: 'materialSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '供应商',
    field: 'suppId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '供应商id',
    field: 'suppId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单id',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料id',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
];
export const deductColumns: BasicColumn[] = [
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 100,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 160,
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodCode',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName',
    width: 160,
  },
  {
    title: '是否关键料',
    align: 'center',
    dataIndex: 'isKeypart',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '用量',
    align: 'center',
    dataIndex: 'qty',
    width: 80,
  },
  {
    title: '绑定数量',
    align: 'center',
    dataIndex: 'bindQty',
    width: 120,
  },
  {
    title: '工位数量',
    align: 'center',
    dataIndex: 'wkpQty',
    width: 80,
    customRender: ({ text, record }) => {
      if (text < record.qty - record.bindQty) {
        return render.renderTag(text, 'red');
      } else {
        return render.renderTag(text, 'green');
      }
    },
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 100,
  },
];
//工位物料记录查询配置
export const deductSearchFormSchema: FormSchema[] = [
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
