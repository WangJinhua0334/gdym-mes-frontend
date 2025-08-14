import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref, unref } from 'vue';

export const scanSn = ref<any>();

export const wkpId = ref<string>('');

export const action = ref<string>('');

export const scanFunc = ref<any>(null);
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '流转卡/序列号',
    field: 'lotSn',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: '请扫描不良流转卡',
      onkeyup: function (e) {
        if (e.key == 'Enter') {
          //scanSn.value = e.target.value;
          unref(scanSn)(e.target.value);
        }
      },
    },
  },

  {
    label: '生产任务单号',
    field: 'moPlanId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '数量',
    field: 'lotQty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '不良工序',
    field: 'wfsId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
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

//子表表格配置
export const prodBindJVxeColumns: JVxeColumn[] = [
  {
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '条码',
    key: 'materialSn',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
    width: '200px',
    disabled: true,
  },
  {
    title: '物料批次',
    key: 'materialBatch',
    type: JVxeTypes.input,
    width: '100px',
    disabled: true,
  },
  {
    title: '数量',
    key: 'qty',
    type: JVxeTypes.input,
    width: '100px',
    disabled: true,
  },
  {
    title: '操作',
    key: 'action',
    width: '100px',
    // 固定在右侧
    // 对齐方式为居中
    align: 'center',
    // 组件类型定义为【插槽】
    type: JVxeTypes.slot,
    // slot 的名称，对应 v-slot 冒号后面和等号前面的内容
    slotName: 'action',
  },
];

/**手动绑定表单配置 */
export const bindFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '物料条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      placeholder: '请扫描物料条码',
      onkeydown: (e) => {
        if (e.key != 'Enter') return;

        if (unref(scanFunc)) {
          unref(scanFunc)(e.target.value);
        }
      },
    },
    colProps: { span: 24 },
  },
  {
    label: '物料批次',
    field: 'batch',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入替换数量!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '物料来源类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_src_type',
    },
    colProps: { span: 24 },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: false,
      };
    },
    ifShow: ({ values }) => {
      if (values.type == null || values.type === '') {
        return false;
      }

      return values.type != 'product';
    },
    colProps: { span: 24 },
  },
  {
    label: '设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/basEquipment/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        queryBefore: (params) => {
          params.notStatus = 'discard';
          return params;
        },
      };
    },
    ifShow: ({}) => {
      return unref(action) == 'bind' || unref(action) == 'bindReplace';
    },
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
    ifShow: ({}) => {
      return unref(action) == 'bind' || unref(action) == 'detail';
    },
  },
  {
    label: '替换原因',
    field: 'reason',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入替换原因!' }];
    },
    ifShow: ({}) => {
      return unref(action) == 'bindReplace';
    },
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
];

/**解绑表单配置 */
export const unbindFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入解绑数量!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '原因',
    field: 'reason',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入解绑数量!' }];
    },
    colProps: { span: 24 },
  },
];
