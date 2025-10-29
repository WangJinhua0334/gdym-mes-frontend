import {FormSchema} from "@/components/Form";
import {JVxeTypes} from "@/components/jeecg/JVxeTable/types";
import dayjs from "dayjs";
import {planStartTime} from "@/views/mes/mo/components/MesMoPlanCreateSn.data";
import {rules} from "@/utils/helper/validator";
import {useUserStore} from "@/store/modules/user";
import { getTenantId } from "/@/utils/auth";
//酸洗扫码完工页面表单配置
export const getDetailJVxeColumns = function () {
  const arr: any[] = [];
  arr.push(
    {
      title: '钢卷号',
      align: 'center',
      headerAlign: 'center',  // 标题居中
      key: 'coilNo',
      type: JVxeTypes.input,
      disabled: true,
      fixed: 'left',
      width: 120
    },
    {
      title: '物料编号',
      align: 'center',
      headerAlign: 'center',  // 标题居中
      key: 'materialId',
      type: JVxeTypes.input,
      disabled: true,
      visible: false,   // 禁止显示
    },
    {
      title: '物料编码',
      key: 'materialNumber',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 180
    },
    {
      title: '物料名称',
      key: 'materialName',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '规格型号',
      key: 'modelNumber',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '牌号',
      key: 'brand',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '车牌号',
      align: 'center',
      key: 'licensePlateNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '供应商',
      key: 'supplierId',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '供应商编码',
      key: 'supplierNumber',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: false,   // 禁止显示
      width: 120
    },
    {
      title: '供应商名称',
      key: 'supplierName',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: false,   // 禁止显示
      width: 120
    },
    {
      title: '重量',
      align: 'center',
      key: 'weight',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '备注',
      align: 'center',
      key: 'materialDesc',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '入库时间',
      align: 'center',
      key: ' inStockTime',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '收料员',
      align: 'center',
      fixed: 'right',
      key: 'operatorNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: true,   // 禁止显示
      width: 120
    },
    {
      title: '租户 id',
      align: 'center',
      key: 'tenantId',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: false,   // 禁止显示
      width: 120
    }
  );
  return arr;
};
//收料新增弹框页面表单配置
export const formSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'coilNo',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mes/incoming/preDeliveryBillDetail/list',
        params: {
          column: 'id',
          isReceipted: "0",
          order: 'desc',
          searchFields: 'coilNo',
        },
        columns: [
          {
            name: '钢卷号',
            code: 'coilNo',
          }
        ],
        // 是否显示序号
        isShowNum: false,
        rowKey: 'coilNo',
        labelKey: ['coilNo'],
        placeholder: '请输入',
        linkmap: [
          {
            materialId:'materialId',//物料编号
            materialNumber:'materialNumber',//物料编码
            materialName:'materialName',//物料名称
            modelNumber: 'modelNumber',//规格型号
            brand: 'brand',//牌号
            exceptedWeight: 'exceptedWeight',//标签重
            weight: 'weight',//重量
          },
        ],
      };
    },
  },
  {
    label: '车牌号',
    field: 'licensePlateNumber',
    component: 'Input',
    dynamicDisabled: false,
    dynamicRules: () => {
      return [{ required: true, message: '请输入车牌号' }];
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
      dynamicRules: ({ model}) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }];
      },
      dynamicDefaultValue: () => {
        return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  },
  {
    label: "物料编号",
    field: 'materialId',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: "物料编码",
    field: 'materialNumber',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'materialName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '重量',
    field: 'weight',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: "牌号",
    field: 'brand',
    component: 'Input',
    dynamicDisabled: true,
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
        linkmap: [{
            // supplierId:'id',//供应商编号
            code:'supplierNumber',//供应商编号
            name:'supplierName',//供应商名称
        }],
        // pageSize: 10,
        multi: false,
        // maxTagCount: 2,
        placeholder: '请选择',

        // 启用滚动分页
        /* scroll: {
           pageSize: 10
         }*/
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入供应商' }];
    },
  },
  {
    label: "供应商编码",
    field: 'supplierNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false
  },
  {
    label: "供应商名称",
    field: 'supplierName',
    component: 'Input',
    dynamicDisabled: true,
    show: false
  },
  // {
  //   label: '流转去向',
  //   field: 'destination',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'gxlzqx',
  //   },
  // },
  {
    label: '备注',
    field: 'materialDesc',
    component: 'InputTextArea',
  },
  {
    label: '操作员编码',
    field: 'operatorNumber',
    component: 'Input',
    defaultValue: useUserStore().getUserInfo.username,
    dynamicDisabled: true,
  },
  {
    label: '租户 id',
    field: 'tenantId',
    component: 'Input',
    defaultValue: useUserStore().getTenant,
    dynamicDisabled: true,
    show: false,
  },
  // {
  //   label: '打印模板',
  //   field: 'templateId',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/template/basTemplate/list',
  //       params: { column: 'code', order: 'asc' },
  //       columns: [
  //         { name: '编码', code: 'code' },
  //         { name: '名称', code: 'name' },
  //       ],
  //       isShowNum: false,
  //       rowKey: 'id',
  //       labelKey: ['name'],
  //       placeholder: '请选择',
  //       getPopupContainer: () => document.body,
  //     };
  //   },
  //   dynamicRules: () => {
  //     return [{ required: true, message: '请选择打印模板!' }];
  //   },
  // },
];

//酸洗扫码完工页面表单配置
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '钢卷号',
      field: 'flowCardId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/mes/incoming/preDeliveryBillDetail/list',
          params: {
            column: 'id',
            isReceipted: "0",
            order: 'desc',
            searchFields: 'coilNo',
          },
          columns: [
            {
              name: '钢卷号',
              code: 'coilNo',
            }
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'coilNo',
          labelKey: ['coilNo'],
          placeholder: '请输入',
          linkmap: [
            {
              materialId:'materialId',//物料编号
              materialNumber:'materialNumber',//物料编码
              materialName:'materialName',//物料名称
              modelNumber: 'modelNumber',//规格型号
              exceptedWeight: 'exceptedWeight',//标签重
              weight: 'weight',//重量
            },
          ],
        };
      },
    },
    {
      label: '物料编号',
      field: 'materialId',
      component: 'Input',
      dynamicDisabled: true,//禁用
      show: false,//禁止显示
    },
    {
      label: '物料编码',
      field: 'materialNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    /* {
       label: '物料名称',
       field: 'materialName',
       component: 'Input',
       dynamicDisabled: true,//禁用
     },*/
    {
      label: '规格型号',
      field: 'modelNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    /*{
      label: '生产厂区',
      field: 'plantId',
      component: 'Input',
    },*/
    // {
    //   label: '生产车间',
    //   field: 'workShopNumber',
    //   component: 'JSearchSelectCustom',
    //   componentProps: ({ formActionType }) => {
    //     const { setFieldsValue, getFieldsValue } = formActionType;
    //     return {
    //       setFieldsValue: setFieldsValue,
    //       getFieldsValue: getFieldsValue,
    //       method: 'get',
    //       url: '/workshop/basWorkShop/list',
    //       params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
    //       columns: [
    //         { name: '编码', code: 'id' },
    //         { name: '名称', code: 'name' },
    //       ],
    //       // 是否显示序号
    //       isShowNum: false,
    //       rowKey: 'code',
    //       labelKey: ['name'],
    //       placeholder: '请输入',
    //     };
    //   },
    // },
    // {
    //   label: '生产班组',
    //   field: 'workTeamId',
    //   component: 'JSearchSelectCustom',
    //   componentProps: ({ formActionType }) => {
    //     const { setFieldsValue, getFieldsValue } = formActionType;
    //     return {
    //       setFieldsValue: setFieldsValue,
    //       getFieldsValue: getFieldsValue,
    //       method: 'get',
    //       url: '/basic/basWorkTeam/list',
    //       params: { column: 'createTime', order: 'desc', searchFields: 'id,name'},
    //       columns: [
    //         { name: '编码', code: 'id' },
    //         { name: '名称', code: 'name' },
    //       ],
    //       // 是否显示序号
    //       isShowNum: false,
    //       rowKey: 'id',
    //       labelKey: ['name'],
    //       placeholder: '请输入',
    //     };
    //   },
    // },
    {
      label: '完工时间',
      field: 'endTime',
      component: 'DatePicker',
      dynamicDefaultValue: () => {
        return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      },
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        getPopupContainer: () => document.body
      },
      dynamicRules: ({ model}) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }];
      },
    },
    {
      label: '重量',
      field: 'weight',
      component: 'InputNumber',
      dynamicDisabled: true,//禁用
      componentProps: {
        style: { width: '100%' }
      }
    },
    {
      label:'操作员',
      field: 'operatorNumber',
      component:'Input',
      defaultValue:useUserStore().getUserInfo.username,
      dynamicDisabled: true,//禁用
      //show: false,//默认隐藏
      componentProps: {
        style: { width: '100%' }
      }
    },
    {
      label:'租户 ID',
      field: 'tenantId',
      component:'Input',
      defaultValue:getTenantId(),
      dynamicDisabled: true,//禁用
      show: false,//默认隐藏
      componentProps: {
        style: { width: '100%' }
      }
    },
  ];
  // return retValue;
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
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];

