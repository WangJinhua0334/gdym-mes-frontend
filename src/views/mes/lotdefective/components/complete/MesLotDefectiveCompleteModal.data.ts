import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { ref, computed, unref } from 'vue';

export const selectHandleMethod = ref();
export const scanSn = ref<any>();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '不良流转卡',
    field: 'sn',
    component: 'Input',
    colProps: { span: 24 },
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
    label: '流转卡/序列号',
    field: 'lotSn',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'lotQty',
    component: 'InputNumber',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '派工单',
    field: 'moPlanId_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '工艺工序',
    field: 'wfsId_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '工序',
    field: 'stationId_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '来源类型',
    field: 'sourceType_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '来源单号',
    field: 'sourceCode',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  // {
  //   label: '缺陷代码',
  //   field: 'defectId_dictText',
  //   component: 'Input',
  //   colProps: { span: 11 },
  //   dynamicDisabled: true,
  // },
  {
    label: '缺陷代码',
    field: 'defectId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/defecttype/basDefect/list',
        params: {},
        columns: [
          {
            title: '缺陷类型',
            align: 'center',
            dataIndex: 'defectTypeId_dictText',
          },
          {
            title: '缺陷代码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '缺陷代码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'description',
            label: '描述',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'type',
            label: '缺陷类型',
            mode: 'single',
            view: 'string',
            fuzzy: false,
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['description'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        maxTagCount: 2,
        /*queryBefore: (params) => {
          return params;
        },*/
      };
    },
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择缺陷代码!' }];
    },
  },
  {
    label: '缺陷数量',
    field: 'defectQty',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '检验人',
    field: 'inspBy_dictText',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '检验时间',
    field: 'inspTime',
    component: 'DatePicker',
    colProps: { span: 11 },
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '缺陷备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicDisabled: true,
  },
  {
    label: '处理方式',
    field: 'handleMethod',
    component: 'JDictSelectTag',
    colProps: { span: 11 },
    componentProps: {
      dictCode: 'defective_handle_method',
      onChange: function (v) {
        selectHandleMethod.value = v;
      },
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择处理方式!' }];
    },
  },
  {
    label: '报废数量',
    field: 'scrapQty',
    component: 'InputNumber',
    show: false,
    colProps: { span: 11 },
    dynamicRules: ({ model, schema, values }) => {
      return [
        { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '请输入正确的数量!' },
        {
          required: false,
          validator: (_, value) => {
            if (model.handleMethod == 'scrap' && !value) {
              return Promise.reject('报废时必须指定报废数量');
            } else if (model.handleMethod == 'scrap' && Number(value) > Number(model.defectQty)) {
              return Promise.reject('报废数量不能大于缺陷数量');
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'change',
        },
      ];
    },
  },
  {
    label: '处理意见',
    field: 'handleDesc',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {
      maxCount: 10,
    },
    colProps: { span: 24 },
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
