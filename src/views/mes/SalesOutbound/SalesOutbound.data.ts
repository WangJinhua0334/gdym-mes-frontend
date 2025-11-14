import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {JVxeColumn, JVxeTypes} from "@/components/jeecg/JVxeTable/src/types";
//销售发货列表数据
export const columns: BasicColumn[] = [
  {
    title: '单据编号',
    align: 'center',
    sorter: true,
    dataIndex: 'billNo',
    width: 160,
  },
  {
    title: '销售组织',
    align: 'center',
    dataIndex: 'saleOrgId_dictText',
    width: 140,
  },
  {
    title: '日期',
    align: 'center',
    sorter: true,
    dataIndex: 'date',
    width: 130,
  },
  {
    title: '客户',
    align: 'center',
    dataIndex: 'customerId_dictText',
    width: 160,
  },
  {
    title: '发货组织',
    align: 'center',
    dataIndex: 'deliveryOrgId_dictText',
    width: 160,
  },
  {
    title: '发货部门',
    align: 'center',
    dataIndex: 'deliveryDeptId_dictText',
    width: 160,
  },
  {
    title: '库存组',
    align: 'center',
    dataIndex: 'stockerGroupId_dictText',
    width: 140,
  },
  {
    title: '仓管员',
    align: 'center',
    dataIndex: 'stockerId_dictText',
    width: 140,
  },
  {
    title: '销售部门',
    align: 'center',
    dataIndex: 'saleDeptId_dictText',
    width: 140,
  },
  {
    title: '销售组',
    align: 'center',
    dataIndex: 'saleGroupId_dictText',
    width: 140,
  },
  {
    title: '销售员',
    align: 'center',
    dataIndex: 'salesManId_dictText',
    width: 140,
  },
  {
    title: '承运商',
    align: 'center',
    dataIndex: 'carrierId_dictText',
    width: 140,
  },
  {
    title: '运输单号',
    align: 'center',
    dataIndex: 'carriageNo',
    width: 160,
  },
  {
    title: '单据类型',
    align: 'center',
    dataIndex: 'billTypeId_dictText',
    width: 140,
  },
  {
    title: '货主类型',
    align: 'center',
    dataIndex: 'ownerTypeIdHead',
    width: 140,
  },
  {
    title: '货主',
    align: 'center',
    dataIndex: 'ownerIdHead_dictText',
    width: 140,
  },
  {
    title: '交货方式',
    align: 'center',
    dataIndex: 'headDeliveryWay',
    width: 140,
  },
  {
    title: '交货地点',
    align: 'center',
    dataIndex: 'headLocId',
    width: 160,
  },
  {
    title: '交货明细地址',
    align: 'center',
    dataIndex: 'planRecAddress',
    width: 200,
  },
  {
    title: '交货方式说明',
    align: 'center',
    dataIndex: 'oraRemarks',
    width: 200,
  },
  {
    title: '包装方式',
    align: 'center',
    dataIndex: 'oraBase',
    width: 160,
  },
  {
    title: '送货地址',
    align: 'center',
    dataIndex: 'oraBaseProperty',
    width: 200,
  },
  {
    title: '租户ID',
    align: 'center',
    dataIndex: 'tenantId',
    width: 100,
  },
];
//销售发货查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '单据编号',
    field: 'billNo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '销售组织',
    field: 'saleOrgId',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '客户',
    field: 'customerId',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '发货组织',
    field: 'deliveryOrgId',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '承运商',
    field: 'carrierId',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '运输单号',
    field: 'carriageNo',
    component: 'Input',
    colProps: { span: 6 },
  },
];

//销售发货备料弹框 数据
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '单据编号',
      field: 'billNo',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '销售组织',
      field: 'saleOrgId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '客户',
      field: 'customerId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '发货组织',
      field: 'deliveryOrgId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '发货部门',
      field: 'deliveryDeptId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '销售员',
      field: 'salesManId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '备注',
      field: 'oraRemarks',
      component: 'InputTextArea',
      dynamicDisabled: true,
      colProps: { span: 16 },
    },
    {
      label: '送货地址',
      field: 'oraBaseProperty',
      component: 'InputTextArea',
      dynamicDisabled: true,
      colProps: { span: 16 },
    },
    {
      label: '承运商',
      field: 'carrierId_dictText',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '运输单号',
      field: 'carriageNo',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '交货方式',
      field: 'headDeliveryWay',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '交货地点',
      field: 'headLocId',
      component: 'Input',
      dynamicDisabled: true,
    },
    {
      label: '交货明细地址',
      field: 'planRecAddress',
      component: 'InputTextArea',
      dynamicDisabled: true,
      colProps: { span: 16 },
    },
  ];
}

/**销售发货 选择产品 */
export const mesSalesOutboundTaskJVxeColumns: JVxeColumn[] = [
  {
    title: '物料编码',
    key: 'materialId',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '物料名称',
    key: 'materialName',
    type: JVxeTypes.input,
    disabled: true,
    minWidth: 180,
  },
  {
    title: '规格型号',
    key: 'materialModel',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '销售数量',
    key: 'qty',
    type: JVxeTypes.input,
    disabled: true,
    width: 120,
  },
  {
    title: '出货仓库',
    key: 'stockId',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '出货仓位',
    key: 'stockLocId',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
  {
    title: '未出库数量',
    key: 'remainOutQty',
    type: JVxeTypes.input,
    disabled: true,
    width: 140,
  },
  {
    title: '备注',
    key: 'noteEntry',
    type: JVxeTypes.input,
    disabled: true,
    minWidth: 200,
  },
  {
    title: '要货日期',
    key: 'deliveryDate',
    type: JVxeTypes.input,
    disabled: true,
    width: 160,
  },
];
