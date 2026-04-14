import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { nextTick } from 'vue';
import { useUserStore } from '/@/store/modules/user';
import { message } from 'ant-design-vue';

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
    label: '钢卷号排除列表',
    field: 'existCoilNoList',
    component: 'Input',
    show: false,
    defaultValue: [],
  },
  {
    label: '钢卷号',
    field: 'coilNo',
    component: 'Input',
    colProps: { span: 7 },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        'data-field': 'coilNo',
        allowClear: true,
        onChange: (e: Event) => {
          // 监听清空事件（当值被清空时触发）
          const target = e.target as HTMLInputElement;
          if (!target.value) {
            console.log('[钢卷号] 被清空');
            // 清空所有关联字段
            setFieldsValue({
              materialId: '',
              materialName: '',
              materialNumber: '',
              modelNumber: '',
              brand: '',
              weight: '',
              purchaseOrderNo: '',
              purchaseOrderSeq: '',
              purchaseOrderFId: '',
              purchaseOrderEntryId: '',
              supplierId: '',
              supplierNumber: '',
              stockUnitNumber: '',
              priceUnitNumber: '',
              purchaseUnitNumber: '',
              entryTaxRate: '',
              billNo: '',
              taxPrice: '',
              price: '',
              amount: '',
              amountLc: '',
              entryTaxAmount: '',
              taxAmountLc: '',
              allAmount: '',
              allAmountLc: '',
            });
          }
        },
        onKeyup: async (e) => {
          // 监听回车键
          if (e.keyCode === 13) {
            const coilNoValue = e.target.value;
            if (!coilNoValue) {
              return;
            }
            // 安全获取 existCoilNoList，避免 undefined
            const allValues = getFieldsValue();
            const existCoilNoList1 = Array.isArray(allValues.existCoilNoList) ? allValues.existCoilNoList : [];
            if (existCoilNoList1.includes(coilNoValue)) {
              message.warn(`钢卷号 ${coilNoValue} 已存在于收料列表中`);
              return; // 如果已存在，则不执行后续查询
            }
            try {
              // 调用 API 获取数据
              const { defHttp } = await import('/@/utils/http/axios');

              console.log('[WebSocket] 获取钢卷号:', existCoilNoList1);

              const result = await defHttp.get({
                url: '/etl/preDeliveryBill/getDetailByCoilNo',
                params: {
                  coilNo: coilNoValue,
                  tenantId: useUserStore().getTenant,
                },
              });
              console.log('返回的数据：', result);
              const detail = result?.result ?? result;
              // 获取返回的第一条数据（与 MesPreDeliveryBillDetail 一致，提交时携带以免后端查库）
              if (detail) {
                setFieldsValue({
                  coilNo: detail.coilNo,
                  materialId: detail.materialId,
                  materialName: detail.materialName,
                  materialNumber: detail.materialNumber,
                  modelNumber: detail.modelNumber,
                  brand: detail.brand,
                  weight: detail.weight,
                  purchaseOrderNo: detail.purchaseOrderNo,
                  purchaseOrderSeq: detail.purchaseOrderSeq,
                  purchaseOrderFId: detail.purchaseOrderFId,
                  purchaseOrderEntryId: detail.purchaseOrderEntryId,
                  supplierId: detail.supplierId,
                  supplierNumber: detail.supplierNumber,
                  stockUnitNumber: detail.stockUnitNumber,
                  priceUnitNumber: detail.priceUnitNumber,
                  purchaseUnitNumber: detail.purchaseUnitNumber,
                  entryTaxRate: detail.entryTaxRate,
                  billNo: detail.billNo,
                  taxPrice: detail.taxPrice,
                  price: detail.price,
                  amount: detail.amount,
                  amountLc: detail.amountLc,
                  entryTaxAmount: detail.entryTaxAmount,
                  taxAmountLc: detail.taxAmountLc,
                  allAmount: detail.allAmount,
                  allAmountLc: detail.allAmountLc,
                });
                nextTick(() => {
                  const nextInput = document.querySelector('input[data-field="licensePlateNumber"]') as HTMLInputElement | null;
                  if (nextInput) nextInput.focus();
                });
              }
            } catch (error) {
              console.error('查询钢卷号失败:', error);
            }
          }
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择钢卷号!' }];
    },
  },
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'Input',
    colProps: { span: 4},
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
    colProps: { span: 4},
    component: 'Input',
    componentProps: {
      'data-field': 'productNumber',
      id: 'productNumberInput', // 添加 ID 便于查找
      // 回车触发与「确认」按钮相同的提交逻辑（与收料页 .form-actions 内主按钮一致）
      onPressEnter: (e: KeyboardEvent) => {
        e?.preventDefault?.();
        const btn = document.querySelector('.receive-page .form-actions .ant-btn.ant-btn-primary') as HTMLButtonElement | null;
        if (btn && !btn.disabled) {
          btn.click();
        }
      },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入生产编号!' }];
    },
  },
  {
    label: '牌号',
    field: 'brand',
    colProps: { span: 5},
    component: 'Input',
    dynamicDisabled: false,
    show: true,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '重量',
    field: 'weight',
    component: 'InputNumber',
    colProps: { span: 4 },
    dynamicDisabled: true,
    show: true,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'Input',
    colProps: { span: 4},
    dynamicDisabled: true,
    show: true,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '入库时间',
    field: 'inStockTime',
    component: 'DatePicker',
    colProps: { span: 5},
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
    colProps: { span: 4},
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
    colProps: { span: 5 },
    dynamicDisabled: true,
    show: true,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '物料编号',
    field: 'materialId',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '物料编码',
    field: 'materialNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
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
    label: '供应商编码',
    field: 'supplierNumber',
    component: 'Input',
    dynamicDisabled: true,
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
  {
    label: '预送货单单号',
    field: 'billNo',
    component: 'Input',
    show: false,
  },
  {
    label: '含税单价',
    field: 'taxPrice',
    component: 'Input',
    show: false,
  },
  {
    label: '不含税单价',
    field: 'price',
    component: 'Input',
    show: false,
  },
  {
    label: '金额',
    field: 'amount',
    component: 'Input',
    show: false,
  },
  {
    label: '金额本位币',
    field: 'amountLc',
    component: 'Input',
    show: false,
  },
  {
    label: '税额',
    field: 'entryTaxAmount',
    component: 'Input',
    show: false,
  },
  {
    label: '税额本位币',
    field: 'taxAmountLc',
    component: 'Input',
    show: false,
  },
  {
    label: '价税合计',
    field: 'allAmount',
    component: 'Input',
    show: false,
  },
  {
    label: '价税合计本位币',
    field: 'allAmountLc',
    component: 'Input',
    show: false,
  },
  {
    label: '收料员',
    field: 'operatorNumber',
    component: 'Input',
    defaultValue: useUserStore().getUserInfo.username,
    dynamicDisabled: true,
    show: true,
    dynamicRules: () => {
      return [{ required: true, message: '请输入信息' }];
    },
  },
  {
    label: '租户编号',
    field: 'tenantId',
    component: 'Input',
    defaultValue: useUserStore().getTenant,
    show: false,
  },
];

