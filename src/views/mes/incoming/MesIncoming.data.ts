import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { ref, h } from 'vue';
import dayjs from 'dayjs';
import { useUserStore } from '/@/store/modules/user';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { Icon } from '/@/components/Icon';
import { Button } from 'ant-design-vue';

export const doQrCode = ref();
//来料单列表数据
export const columns: BasicColumn[] = [
  {
    title: '钢卷号',
    align: 'center',
    dataIndex: 'internalCoilNumber',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'materialName',
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'materialNumber',
  },
  {
    title: '规格型号',
    align: 'center',
    dataIndex: 'modelNumber',
  },
  {
    title: '重量',
    align: 'center',
    dataIndex: 'weight',
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'baseUnitId_dictText',
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'supplierId_dictText',
  },
  {
    title: '车牌号',
    align: 'center',
    dataIndex: 'licensePlateNumber',
  },
  {
    title: '收料后的第一道工序',
    align: 'center',
    dataIndex: 'firstOperationNumber_dictText',
  },
  {
    title: '入库时间',
    align: 'center',
    dataIndex: 'productionDate',
  },
  {
    title: '收料员工',
    align: 'center',
    dataIndex: 'createBy_dictText',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'materialDesc',
  },

  /*{
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mes_incoming_status', true);
    },
  },
  {
    title: '是否合格',
    align: 'center',
    dataIndex: 'isOk',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否入库',
    align: 'center',
    dataIndex: 'isStock',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },

  {
    title: '库位',
    align: 'center',
    dataIndex: 'whBinId_dictText',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },*/
];

// 新增页面的表单数据
export const formSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'coilNo',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      // 创建防抖函数
      const debounceFocus = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
      // 聚焦函数
      const focusProductNumber = debounceFocus(() => {
        console.log('触发聚焦到生产编号');
        // 多次尝试，确保成功
        let attempts = 0;
        const maxAttempts = 8;
        const tryFocus = () => {
          attempts++;
          const input = document.getElementById('productNumberInput') ||
            document.querySelector('input[data-field="productNumber"]');
          if (input) {
            console.log(`尝试聚焦 (${attempts}/${maxAttempts})`);

            // 确保输入框完全渲染
            if (input.offsetParent !== null) {
              input.focus();

              // 使用多种方式确保选中文本
              if (input.tagName === 'INPUT') {
                setTimeout(() => {
                  input.select();
                  // 如果 select() 不生效，使用 setSelectionRange
                  const length = input.value.length;
                  input.setSelectionRange(length, length);
                }, 10);
              }
              // 验证焦点是否成功
              setTimeout(() => {
                if (document.activeElement !== input && attempts < maxAttempts) {
                  console.log('焦点未保持，重新尝试');
                  setTimeout(tryFocus, 100);
                }
              }, 50);
            } else if (attempts < maxAttempts) {
              setTimeout(tryFocus, 150);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(tryFocus, 150);
          }
        };
        // 延迟开始，确保 JPopupCustom 弹窗已关闭
        setTimeout(() => {
          tryFocus();
        }, 200);
      }, 100);
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mes/incoming/preDeliveryBillDetail/list',
        params: {
          status: 'false',
        },
        columns: [
          {
            title: '钢卷号',
            align: 'center',
            dataIndex: 'coilNo',
          },
          {
            title: '预送货单号',
            align: 'center',
            dataIndex: 'billNo',
          },
          {
            title: '物料编号',
            align: 'center',
            dataIndex: 'materialId',
          },
          {
            title: '物料编码',
            align: 'center',
            dataIndex: 'materialNumber',
          },
          {
            title: '物料名称',
            align: 'center',
            dataIndex: 'materialName',
          },
          {
            title: '规格型号',
            align: 'center',
            dataIndex: 'modelNumber',
          },
          {
            title: '牌号',
            align: 'center',
            dataIndex: 'brand',
          },
          {
            title: '重量',
            align: 'center',
            dataIndex: 'weight',
          },
        ],
        queryInfo: [
          {
            field: 'coilNo',
            label: '钢卷号',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'billNo',
            label: '预送货单号',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'coilNo',
        labelKey: ['coilNo'],
        linkmap: [
          {
            materialId: 'materialId',
            materialNumber: 'materialNumber',
            materialName: 'materialName',
            modelNumber: 'modelNumber',
            brand: 'brand',
            weight: 'weight',
          },
        ],
        placeholder: '请选择钢卷号',
        // 添加多个事件监听，确保能捕获到变化
        onChange: (value) => {
          console.log('onChange 事件:', value);
          if (value) {
            // 清空生产编号（可选）
            setFieldsValue({ productNumber: '' });
            focusProductNumber();
          }
        },
        onSelect: (record) => {
          console.log('onSelect 事件:', record);
          if (record?.coilNo) {
            // 延迟执行，确保表单值已更新
            setTimeout(() => {
              focusProductNumber();
            }, 250);
          }
        },
        onOk: (value) => {
          console.log('onOk 事件:', value);
          if (value) {
            // 延迟更长一些，确保弹窗完全关闭
            setTimeout(() => {
              focusProductNumber();
            }, 300);
          }
        },
        // 如果 JPopupCustom 支持更多事件
        onPopupClose: () => {
          console.log('弹窗关闭事件');
          const coilNoValue = getFieldsValue()?.coilNo;
          if (coilNoValue) {
            setTimeout(() => {
              focusProductNumber();
            }, 200);
          }
        },
        // 列表上方按钮渲染函数
        tableTitleRender: (reload) => {
          const { createMessage } = useMessage();
          const handleSync = () => {
            // 显示加载提示
            const hide = createMessage.loading('正在同步金蝶预送货单信息...', 0);
            // 调用接口
            defHttp.get({
              url: '/etl/preDeliveryBill/importAllPreDeliveryBills',
              params: {
                tenantId: useUserStore().getTenant,
              },
            }).then(() => {
              hide();
              createMessage.success('同步成功');
              // 刷新列表数据
              if (reload && typeof reload === 'function') {
                reload(1); // 传递参数1表示重置到第一页
              }
            }).catch(() => {
              hide();
              createMessage.error('同步失败');
            });
          };
          return h('div', [
            h(Button, {
              type: 'primary',
              onClick: handleSync,
              style: { marginRight: '8px' },
            }, {
              default: () => '同步金蝶预送货单信息',
              icon: () => h(Icon, { icon: 'ant-design:import-outlined' }),
            }),
          ]);
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择钢卷号!' }];
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
            inputs[currentIndex + 1].focus();
          }
        }
      },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入生产编号!' }];
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
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入车牌号!' }];
    },
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
    label: '物料名称',
    field: 'materialName',
    component: 'Input',
    dynamicDisabled: true,
    show: true,
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

//查询数据-来料单查询条件
export const searchFormSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'originalCoilNumber',
    component: 'JInput',
  },
  /*{
    label: '供应商',
    // field: 'wksId',
    field: 'supplierId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/basic/basSupplier/getAllSupplier',
        //url: '/workshop/basWorkShop/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}' },
        columns: [
          {
            name: '编码',
            code: 'id',
          },
          {
            name: '供应商名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        // pageSize: 10,
        multi: true,
        maxTagCount: 2,
        placeholder: '请选择',
        // 启用滚动分页
        /!* scroll: {
          pageSize: 10
        }*!/
      };
    },
  },*/
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'JInput',
  },
  // {
  //   label: '入库时间',
  //   field: 'productionDate',
  //   component: 'DatePicker',
  //   // 如果这个工具函数能返回当天日期
  //   // defaultValue: dayjs().format('YYYY-MM-DD'), // 需要先引入 dayjs
  //   //defaultValue: new Date().toISOString().split('T')[0], // YYYY-MM-DD 格式
  //   componentProps: {
  //     format: 'YYYY-MM-DD',
  //     valueFormat: 'YYYY-MM-DD',
  //     placeholder: '请选择日期', // 添加占位符
  //     getPopupContainer: () => document.body, // 确保弹出层正确显示
  //   },
  // },
  {
    label: '入库时间',
    field: 'prodTimeRange',
    component: 'RangePicker',
    // colProps: { span: 10 },
    defaultValue: [dayjs().subtract(0, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['请选择开始时间', '请选择结束时间'],
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: () => document.body,
    },
  },
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
  //       params: { column: 'createTime', order: 'desc', searchFields: 'id,name', /** code: '${code}' */},
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
  //       //pageSize: 10,
  //       multi: true,
  //       maxTagCount: 2,
  //       placeholder: '请选择',
  //       // // 启用滚动分页
  //       // scroll: {
  //       //   pageSize: 10
  //       // }
  //     };
  //   },
  // },
  // {
  //   label: '备注',
  //   field: 'note',
  //   component: 'JInput',
  // },
];

//退货
export const returnFormSchema: FormSchema[] = [
  {
    label: '库位',
    field: 'whBinId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehousearea/basWarehouseBin/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,whQuery' /*, code: '${code}'*/ },
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
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
        queryBefore: function (currentParams) {
          //currentParams.whQuery = 'waitInsp';
          return currentParams;
        },
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择库位!' }];
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
//入库
export const stockFormSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入或扫描流转卡号信息!' }];
    },
  },
  {
    label: '入库数量',
    field: 'inQty',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入数量!' }];
    },
  },
  {
    label: '库位',
    field: 'whBinId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehousearea/basWarehouseBin/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,whQuery' /*, code: '${code}'*/ },
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
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请输入',
        queryBefore: function (currentParams) {
          //currentParams.whQuery = 'waitInsp';
          return currentParams;
        },
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择库位!' }];
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
// 高级查询数据
export const superQuerySchema = {
  code: { title: '编码', order: 0, view: 'text', type: 'string' },
  purchaseCode: { title: '采购单号', order: 1, view: 'text', type: 'string' },
  prodId: { title: '物料', order: 2, view: 'text', type: 'string' },
  prodName: { title: '物料名称', order: 3, view: 'text', type: 'string' },
  qty: { title: '数量', order: 4, view: 'number', type: 'number' },
  supplierId: { title: '供应商', order: 5, view: 'text', type: 'string' },
  prodTime: { title: '生产日期', order: 6, view: 'datetime', type: 'string' },
  batchNo: { title: '批次号', order: 7, view: 'text', type: 'string' },
  status: { title: '状态', order: 8, view: 'text', type: 'string' },
  isOk: { title: '是否合格', order: 9, view: 'text', type: 'string' },
  isStock: { title: '是否入库', order: 10, view: 'text', type: 'string' },
  materialCost: { title: '物料成本', order: 11, view: 'number', type: 'number' },
  remark: { title: '备注', order: 12, view: 'text', type: 'string' },
  whBinId: { title: '库位', order: 13, view: 'text', type: 'string' },
  attachments: { title: '附件', order: 14, view: 'text', type: 'string' },
};

export function getBpmFormSchema(): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}

//打印模板
export const printFormSchema: FormSchema[] = [
  {
    label: '打印模板',
    field: 'templateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'code', order: 'asc' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        getPopupContainer: () => document.body,
      };
    },
    defaultValue: '1986615937373085698',
    dynamicRules: () => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];
