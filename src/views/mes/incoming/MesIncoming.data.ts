import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { useUserStore } from '/@/store/modules/user';

// 收料表单数据
export const formSchema: FormSchema[] = [
  {
    component: 'Divider',
    label: '信息输入',
    field: '_divider_input',
    colProps: { span: 24 },
    componentProps: {
      class: 'incoming-divider-separator',
    },
  },
  {
    label: '钢卷号',
    field: 'coilNo',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/mes/incoming/preDeliveryBillDetail/list',
        params: {
          column: 'coilNo',
          order: 'asc',
          searchFields: 'coilNo',
        },
        columns: [
          { name: '钢卷号', code: 'coilNo' },
          { name: '预送货单号', code: 'billNo' }
        ],
        isShowNum: false,
        rowKey: 'coilNo',
        labelKey: ['coilNo'],
        pageSize: 10,
        placeholder: '钢卷号模糊查询',
        linkmap: [
          {
            materialId: 'materialId',
            materialNumber: 'materialNumber',
            materialName: 'materialName',
            modelNumber: 'modelNumber',
            brand: 'brand',
            weight: 'weight',
            purchaseOrderNo: 'purchaseOrderNo',
            purchaseOrderSeq: 'purchaseOrderSeq',
            purchaseOrderFId: 'purchaseOrderFId',
            purchaseOrderEntryId: 'purchaseOrderEntryId',
            supplierId: 'supplierId',
            supplierNumber: 'supplierNumber',
            stockUnitNumber: 'stockUnitNumber',
            priceUnitNumber: 'priceUnitNumber',
            purchaseUnitNumber: 'purchaseUnitNumber',
            entryTaxRate: 'entryTaxRate',
          },
        ],
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择钢卷号!' }];
    },
  },
  /*{
    label: '生产编号',
    field: 'productNumber',
    component: 'Input',
    componentProps: {
      'data-field': 'productNumber',
      // 添加回车键监听
      onKeyup: (e) => {
        if (e.keyCode === 13) {
          // 回车键的 keyCode 是 13
          // 查找下一个输入框并聚焦
          const inputs = document.querySelectorAll('input[data-field]');
          const currentIndex = Array.from(inputs).findIndex((input) => input.getAttribute('data-field') === 'productNumber');
          if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
          }
        }
      },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入生产编号!' }];
    },
  },*/
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'Input',
    componentProps: {
      'data-field': 'licensePlateNumber',
      onKeyup: (e) => {
        if (e.keyCode === 13) {
          const input = document.getElementById('productNumberInput') as HTMLInputElement | null;
          if (input) input.focus();
        }
      },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入车牌号!' }];
    },
  },
  {
    label: '生产编号',
    field: 'productNumber',
    component: 'Input',
    componentProps: {
      'data-field': 'productNumber',
      id: 'productNumberInput', // 添加 ID 便于查找
      onKeyup: (e) => {
        if (e.keyCode === 13) {
          const inputs = document.querySelectorAll('input[data-field]');
          const currentIndex = Array.from(inputs).findIndex((input) => input.getAttribute('data-field') === 'productNumber'
          );
          if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            (inputs[currentIndex + 1] as HTMLElement).focus();
          }
        }
      },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入生产编号!' }];
    },
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '牌号',
    field: 'brand',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '重量',
    field: 'weight',
    component: 'InputNumber',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '入库时间',
    field: 'inStockTime',
    component: 'DatePicker',
    defaultValue: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: () => document.body,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择生产日期!' }];
    },
  },
  {
    label: '第一道工序',
    field: 'firstOperation',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        {
          label: '酸洗',
          value: 'sx',
        },
        {
          label: '退火',
          value: 'th',
        },
      ],
    },
    //中晟组织下收的卷是只需要经过退火工序，星圣组织下收的卷是从酸洗工序开始的 中晟：1003、星圣：1005
    defaultValue: useUserStore().getTenant == '1003' ? 'th' : 'sx',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请选择钢卷的第一道工序!',
          trigger: 'change',
        },
      ];
    },
  },
  {
    label: '物料名称',
    field: 'materialName',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '物料编号',
    field: 'materialId',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '物料编码',
    field: 'materialNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
  },
  {
    label: '采购订单号',
    field: 'purchaseOrderNo',
    component: 'Input',
    show: false,
  },
  {
    label: '采购订单行号',
    field: 'purchaseOrderSeq',
    component: 'Input',
    show: false,
  },
  {
    label: '采购订单FID',
    field: 'purchaseOrderFId',
    component: 'Input',
    show: false,
  },
  {
    label: '采购订单EntryId',
    field: 'purchaseOrderEntryId',
    component: 'Input',
    show: false,
  },
  {
    label: '供应商ID',
    field: 'supplierId',
    component: 'Input',
    show: false,
  },
  {
    label: '库存单位',
    field: 'stockUnitNumber',
    component: 'Input',
    show: false,
  },
  {
    label: '计价单位',
    field: 'priceUnitNumber',
    component: 'Input',
    show: false,
  },
  {
    label: '采购单位',
    field: 'purchaseUnitNumber',
    component: 'Input',
    show: false,
  },
  {
    label: '税率',
    field: 'entryTaxRate',
    component: 'Input',
    show: false,
  },

  // {
  //   label: '收料组织',
  //   field: 'stockOrgId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/basic/basOrganization/list',
  //       params: { column: 'id', order: 'asc', searchFields: 'id,name,number' },
  //       columns: [
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       linkmap: [
  //         {
  //           number: 'stockOrgNumber',
  //         },
  //       ],
  //       // pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请输入',
  //       getPopupContainer: () => document.body,
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择收料组织!' }];
  //   },
  // },
  // {
  //   label: '收料组织编码',
  //   field: 'stockOrgNumber',
  //   component: 'Input',
  //   dynamicDisabled: true,
  //   show: false,
  // },
  // {
  //   label: '收料部门',
  //   field: 'stockDeptId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/sys/sysDepart/list',
  //       params: {
  //         status: '1',
  //         orgCategory: '2',
  //         column: 'id',
  //         order: 'asc',
  //         searchFields: 'id,departNameAbbr,orgCode',
  //       },
  //       columns: [
  //         {
  //           name: '名称',
  //           code: 'departNameAbbr',
  //         },
  //       ],
  //       isShowNum: true,
  //       rowKey: 'id',
  //       labelKey: ['departNameAbbr'],
  //       linkmap: [
  //         {
  //           orgCode: 'stockDeptNumber',
  //         },
  //       ],
  //       // pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请输入',
  //       getPopupContainer: () => document.body,
  //       // queryBefore: (params) => {
  //       //   params.status = "1";
  //       //   params.orgCategory = "2";
  //       //   return params;
  //       // }
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择收料组织!' }];
  //   },
  // },
  // {
  //   label: '收料部门编码',
  //   field: 'stockDeptNumber',
  //   component: 'Input',
  //   dynamicDisabled: true,
  //   show: false,
  // },
  {
    label: '收料员',
    field: 'operatorNumber',
    component: 'Input',
    defaultValue: useUserStore().getUserInfo.username,
    dynamicDisabled: true,
    show: true,
  },
  // {
  //   label: '收料员的 id',
  //   field: 'stockEmpId',
  //   component: 'InputNumber',
  //   defaultValue: useUserStore().getUserInfo.id,
  //   dynamicDisabled: true,
  //   show: false,
  // },
  // {
  //   label: '仓库',
  //   // field: 'wksId',
  //   field: 'warehouseId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       methods: 'get',
  //       url: '/basic/wareHouse/list',
  //       params: { column: 'id', order: 'asc', searchFields: 'id,name,code' /** code: '${code}' */ },
  //       columns: [
  //         {
  //           name: '仓库编码',
  //           code: 'id',
  //         },
  //         {
  //           name: '仓库名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       linkmap: [
  //         {
  //           code: 'warehouseNumber',
  //         },
  //       ],
  //       pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请选择仓库',
  //       // 启用滚动分页
  //       scroll: {
  //         pageSize: 10,
  //       },
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择仓库!' }];
  //   },
  // },
  // {
  //   label: '仓库编码',
  //   field: 'warehouseNumber',
  //   component: 'Input',
  //   dynamicDisabled: true,
  //   show: false,
  // },
  // {
  //   label: '采购组织',
  //   field: 'purchaseOrgId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/basic/basOrganization/list',
  //       params: { column: 'id', order: 'asc', searchFields: 'id,name,number' },
  //       columns: [
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       linkmap: [
  //         {
  //           number: 'purchaseOrgNumber',
  //         },
  //       ], //关联字段
  //       // pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请输入',
  //       getPopupContainer: () => document.body,
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择采购组织!' }];
  //   },
  // },
  // {
  //   label: '采购组织编码',
  //   field: 'purchaseOrgNumber',
  //   component: 'Input',
  //   dynamicDisabled: true,
  //   show: false,
  // },
  // {
  //   label: '供应商',
  //   field: 'supplierId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/basic/basSupplier/list',
  //       params: { column: 'id', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
  //       columns: [
  //         {
  //           name: '名称',
  //           code: 'name',
  //         },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       linkmap: [
  //         {
  //           code: 'supplierNumber',
  //         },
  //       ],
  //       // pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请输入',
  //       getPopupContainer: () => document.body,
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择供应商!' }];
  //   },
  // },
  {
    label: '供应商编码',
    field: 'supplierNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '租户编号',
    field: 'tenantId',
    component: 'Input',
    defaultValue: useUserStore().getTenant,
    show: false,
  },
];

