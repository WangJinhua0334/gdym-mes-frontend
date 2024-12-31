import { ref, computed, unref, provide } from 'vue';

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { checkHasEnableProd } from './BasProdInspSchema.api';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 160,
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
    dataIndex: 'isEnable',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
  {
    title: '关联产品列表',
    align: 'center',
    dataIndex: 'listSlot',
    slots: { customRender: 'listSlot' },
    width: 180,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
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
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
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
            if (model.code && value == 'Y') {
              const params = {};
              params['code'] = model.code;
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

//列表数据
export const prodSchemaColumns: BasicColumn[] = [
  {
    title: '产品',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
  },
];
//查询数据
export const prodSchemaFormSchema: FormSchema[] = [
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
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
