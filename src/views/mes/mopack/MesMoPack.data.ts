import { ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const doEnterPress = ref();
//包装信息配置
export const packList: BasicColumn[] = [
  {
    title: '包装条码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '流转卡',
    align: 'center',
    sorter: true,
    dataIndex: 'lotSn',
    width: 160,
  },
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '产品编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
    width: 160,
  },
  {
    title: '产品型号',
    align: 'center',
    sorter: true,
    dataIndex: 'picNo_dictText',
    width: 160,
  },
  {
    title: '托号',
    dataIndex: 'snNum',
    align: 'center',
    width: 80,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'packNum',
    width: 80,
  },
  {
    title: '标准数量',
    align: 'center',
    dataIndex: 'packQty',
    width: 100,
  },
  {
    title: '包装数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '包装单位',
    align: 'center',
    dataIndex: 'packUnitId_dictText',
    width: 80,
  },
  {
    title: '批次',
    align: 'center',
    sorter: true,
    dataIndex: 'batch',
    width: 160,
  },
  {
    title: '工位',
    align: 'center',
    sorter: true,
    dataIndex: 'wkpId_dictText',
    width: 160,
  },
  {
    title: '包装人',
    align: 'center',
    dataIndex: 'packBy_dictText',
    width: 100,
  },
  {
    title: '包装时间',
    align: 'center',
    sorter: true,
    dataIndex: 'packTime',
    width: 120,
  },
];
//包装信息查询配置
export const packListFormSchema: FormSchema[] = [
  {
    label: '包装条码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '流转卡',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '批次',
    field: 'batch',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工单',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '产品编码/名称/型号',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '工位',
    field: 'wkpQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
];

/**附件表单配置 */
export const attachmentsFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUpload',
    /*component: 'JUploadCustom',
      componentProps: {
        uploadType: ['camera', 'uplaod'],
      },*/
    colProps: { span: 24 },
  },
];

//包装
export const upFormSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPress.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    ifShow: false,
  },
  {
    label: '工位',
    field: 'workPostName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  // {
  //   label: '完成数量',
  //   field: 'completeQty',
  //   component: 'Input',
  //   componentProps: {
  //     disabled: true,
  //   },
  //   colProps: { span: 12 },
  // },
  {
    label: '包装规则',
    field: 'packRule',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '包装数量',
    field: 'packQty',
    component: 'InputNumber',
  },
  {
    label: '托号',
    field: 'snNum',
    component: 'InputNumber',
  },
  {
    label: '箱号',
    field: 'packNum',
    component: 'InputNumber',
  },
  // {
  //   label: '是否提前生成条码',
  //   field: 'isBefore',
  //   defaultValue: 'Y',
  //   component: 'JSwitch',
  //   componentProps: {
  //     dictCode: 'is_open',
  //   },
  //   colProps: { span: 12 },
  // },
  {
    label: '是否混批',
    field: 'isBatch',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
];

//包装
export const formSchema: FormSchema[] = [
  {
    label: '包装条码',
    field: 'code',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工位',
    field: 'wkpId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    ifShow: false,
  },
  {
    label: '标准数量',
    field: 'packQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '包装数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '包装单位',
    field: 'packUnitId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '批次',
    field: 'batch',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '包装人',
    field: 'packBy_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '托号',
    field: 'snNum',
    component: 'InputNumber',
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入托号!' }];
    },
  },
  {
    label: '顺序',
    field: 'packNum',
    component: 'InputNumber',
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入顺序!' }];
    },
  },
  {
    label: '包装时间',
    field: 'packTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择包装时间!' }];
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

//打印模板
export const printFormSchema: FormSchema[] = [
  {
    label: '打印模板',
    field: 'templateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'code', order: 'asc' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];
