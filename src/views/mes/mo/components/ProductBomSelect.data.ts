import { FormSchema } from '/@/components/Table';
import { ref, unref } from 'vue';

/**产品ID */
export const bomProdId = ref();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: 'BOM版本',
    field: 'bomId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/productbom/basProductBom/list',
        params: { column: 'version', order: 'desc', searchFields: 'description' },
        columns: [
          { name: '版本', code: 'version' },
          { name: '是否默认', code: 'isDefault_dictText' },
          { name: '描述', code: 'description' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['version', 'description'],
        placeholder: '请选择',
        pageSize: 10,
        queryBefore: (params) => {
          params.isEnable = 'Y';
          params.prodId = unref(bomProdId);
          return params;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择BOM版本!' }];
    },
  },
];
