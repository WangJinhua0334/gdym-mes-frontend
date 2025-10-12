import {FormSchema} from "@/components/Form";
//酸洗扫码开工页面表单配置
export function getFormSchema(): FormSchema[] {
  const retValue = [
    {
      label: '钢卷号',
      field: 'stock_emp_id',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name' /*, code: '${code}'*/ },
          //url: '/bas/basPlant/list',
          //params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}'},
          columns: [
            { name: '钢卷号', code: 'name' },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
          linkmap: [
            {
              code:'code',
              createTime: 'createTime',
            },
          ],
        };
      },
    },
    {
      label: '物料编码',
      field: 'code',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    {
      label: '规格型号',
      field: 'createTime',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    {
      label: '生产厂区',
      field: 'note',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name' /*, code: '${code}'*/ },
          //url: '/bas/basPlant/list',
          //params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}'},
          columns: [
            { name: '编码', code: 'id' },
            { name: '名称', code: 'name' },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
        };
      },
    },
    {
      label: '生产班组',
      field: 'licensePlateNumber',
      component: 'Input',
    },
    /*{
      label: '操作员',
      field: '操作员',
      component: 'Input',
    },*/
    {
      label: '开工时间',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '标签重',
      field: 'note',
      component: 'Input',
    },
    {
      label: '实际重量',
      field: '实际重量',
      component: 'Input',
    },
    {
      label: '范围值',
      field: 'note',
      component: 'Input',
    },
    {
      label: '设备',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '要求查看',
      field: 'warehouseId',
      component: 'Input',
    },
  ];
  return retValue;
}
