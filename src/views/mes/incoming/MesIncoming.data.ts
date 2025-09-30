import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
import { ref } from 'vue';
import dayjs from "dayjs";

export const doQrCode = ref();
//来料单列表数据
export const columns: BasicColumn[] = [
  {
    title: '钢卷号',
    align: 'center',
    dataIndex: 'originalCoilNumber',
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'materialId',
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'materialName',
  },
  {
    title: '物料说明',
    align: 'center',
    dataIndex: 'prodName',
  },
  {
    title: '规格',
    align: 'center',
    dataIndex: 'inQty',
  },
  {
    title: '规格型号',
    align: 'center',
    dataIndex: 'modelNumber',
  },
  {
    title: '重量',
    align: 'center',
    dataIndex: 'expectedWeight',
  },
  {
    title: '车牌号',
    align: 'center',
    dataIndex: 'purchaseCode',
  },
  {
    title: '供应商',
    align: 'center',
    dataIndex: 'supplierId',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'note',
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
//查询数据-来料单查询条件
export const searchFormSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'originalCoilNumber',
    component: 'JInput',
  },
  {
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
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}'},
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
       /* scroll: {
          pageSize: 10
        }*/
      };
    },
  },
  {
    label: '入库时间',
    field: 'inStockTime',
    component: 'DatePicker',
    // 如果这个工具函数能返回当天日期
    defaultValue: dayjs().format('YYYY-MM-DD'), // 需要先引入 dayjs
    //defaultValue: new Date().toISOString().split('T')[0], // YYYY-MM-DD 格式
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择日期', // 添加占位符
      getPopupContainer: (node) => document.body, // 确保弹出层正确显示
    },
  },
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'JInput',
  },
  {
    label: '仓库',
    field: 'wksId',
    //field: 'warehouseId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/basic/wareHouse/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name', code: '${code}' },
        columns: [
          {
            name: '仓库编码',
            code: 'id',
          },
          {
            name: '仓库名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //pageSize: 10,
        multi: true,
        maxTagCount: 2,
        placeholder: '请选择',
        // 启用滚动分页
        scroll: {
          pageSize: 10
        }
      };
    },
  },
  {
    label: '备注',
    field: 'note',
    component: 'JInput',
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '来料单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.id;
    },
  },
  {
    label: '二维码解析',
    field: 'qrCode',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doQrCode.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '采购单号',
    field: 'purchaseCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入采购单号!' }];
    },
  },
  {
    label: '物料',
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
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version',
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
        linkmap: [{ name: 'prodName' }],
        placeholder: '请选择物料',
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择物料!' }];
    },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    defaultValue: 1,
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入数量!' }];
    },
  },
  {
    label: '供应商',
    field: 'supplierId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        getPopupContainer: (node) => document.body,
      };
    },
  },
  {
    label: '生产日期',
    field: 'prodTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择生产日期!' }];
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
          currentParams.whQuery = 'waitInsp';
          return currentParams;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择库位!' }];
    },
  },
  {
    label: '批次号',
    field: 'batchNo',
    component: 'Input',
  },
  {
    label: '物料成本',
    field: 'materialCost',
    component: 'InputNumber',
    defaultValue: 0,
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
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
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
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
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
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入或扫描流转卡号信息!' }];
    },
  },
  {
    label: '入库数量',
    field: 'inQty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
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
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
