import {FormSchema} from "@/components/Form";
//扫码开工页面表单配置
export function getFormSchema(): FormSchema[] {
  const retValue = [
    {
      label: '工序号',
      field: 'code',
      component: 'Input',
    },
    {
      label: '工序名称',
      field: 'licensePlateNumber',
      component: 'Input',
    },
    {
      label: '钢卷号',
      field: 'stock_emp_id',
      component: 'Input',
    },
    {
      label: '物料编码',
      field: 'warehouseId',
      component: 'Input',
    },
    {
      label: '生产厂区',
      field: 'note',
      component: 'Input',
    },
    {
      label: '规格型号',
      field: 'code',
      component: 'Input',
    },
    {
      label: '生产班组',
      field: 'licensePlateNumber',
      component: 'Input',
    },
    {
      label: '操作员',
      field: 'stock_emp_id',
      component: 'Input',
    },
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
      field: 'stock_emp_id',
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
