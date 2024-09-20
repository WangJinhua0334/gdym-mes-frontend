import { ref, computed, unref, provide } from 'vue';

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { checkHasEnableProd } from './BasProdInspSchema.api';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '版本',
    align: 'center',
    sorter: true,
    dataIndex: 'version',
    width: 120,
  },
  {
    title: '是否启用',
    align: 'center',
    sorter: true,
    dataIndex: 'isEnable_dictText',
    width: 120,
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'prodSearch',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '描述',
    field: 'description',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '版本',
    field: 'version',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
        columns: [
          {
            title: '编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version',
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'specification',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName_dictText' }],
        placeholder: '请选择',
        //multi: true,
        //maxTagCount: 2,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料编码！' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '版本',
    field: 'version',
    defaultValue: 'v1.0',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入版本!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: ({ model, schema, values }) => {
      return [
        {
          required: false,
          validator: (_, value) => {
            if (model.prodId && value == 'Y') {
              let params = {};
              params['prodId'] = model.prodId;
              params['neid'] = model.id;
              params['isEnable'] = value;

              return new Promise<void>((resolve, reject) => {
                checkHasEnableProd(params)
                  .then((res) => {
                    if (res == 0) {
                      resolve();
                    } else {
                      reject('一个料号同一时间只能启用一个检验方案');
                    }
                  })
                  .catch((err) => {
                    reject(err.message || '验证失败');
                  });
              });
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
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {
      maxCount: 10,
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
