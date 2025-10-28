import {FormSchema} from "@/components/Form";
import {JVxeTypes} from "@/components/jeecg/JVxeTable/types";
import dayjs from "dayjs";
import {planStartTime} from "@/views/mes/mo/components/MesMoPlanCreateSn.data";
import {rules} from "@/utils/helper/validator";
import {useUserStore} from "@/store/modules/user";
import { getTenantId } from "/@/utils/auth";
//冷轧扫码完工新增弹框页面表单配置
export const formSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'newCoilNo',
    component: 'Input',
    dynamicDisabled: true, // 设置为禁用状态，只能通过程序设置
  },
  {
    label: '钢卷号',//用来过滤物料编码信息
    field: 'flowCardId',
    component: 'Input',
    dynamicDisabled: true, // 设置为禁用状态，只能通过程序设置
    show: false,//禁止显示
  },
  {
    label: '重量',
    field: 'weight',
    component: 'Input',
  },
  {
    label: '物料编码',
    field: 'materialNumber',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/etl/rolling/materialMappingInfo',
        params: { column: 'createTime', order: 'desc', flowCardId: '${flowCardId}',searchFields: 'number,name'},
        columns: [
          {name: '物料编码', code: 'number'},
          {name: '物料名称', code: 'name'},
          {name: '规格型号', code: 'materialModelNumber'},
        ],
        isShowNum: false,
        rowKey: 'number',
        labelKey: ['name'],
        linkmap: [
          {
            number:'number',//物料编码
            name:'name',//物料名称
            materialModelNumber:'materialModelNumber',//规格型号
          },
        ],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择',
        // 启用滚动分页
        scroll: {
          pageSize: 10
        },
      };
    },
  },
  {
    label: '物料名称',
    field: 'name',
    component: 'Input',
    show: false,//禁止显示
  },
  {
    label: '规格型号',
    field: 'materialModelNumber',
    component: 'Input',
    show: false,//禁止显示
  },
  {
    label: '流转去向',
    field: 'destination',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'gxlzqx',
    },
  },
  {
    label: '仓库 Id',
    field: 'warehouseId',
    component: 'Input',
    show: false,//禁止显示
  },
  {
    label: '仓库',
    field: 'warehouseName',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
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
        rowKey: 'name',
        labelKey: ['name'],
        linkmap: [
          {
            id:'warehouseId',//物料编码
          },
        ],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择',
        // 启用滚动分页
        scroll: {
          pageSize: 10
        },
      };
    },
  },
];

//冷轧扫码完工页面表单配置
export function getFormSchema(): FormSchema[] {
  const retValue = [
    {
      label: '钢卷号',
      field: 'newCoilNo',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          //url: '/mes/picking/list',
          url: '/etl/rolling/end/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,newCoilNo', },
          columns: [
            {
              name: '钢卷号',
              code: 'newCoilNo',
            },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'newCoilNo',
          labelKey: ['newCoilNo'],
          placeholder: '请输入',
          linkmap: [
            {
              materialId:'materialId',//物料编号
              materialNumber:'materialNumber',//物料编码
              /*materialName:'materialName',//物料名称*/
              modelNumber: 'modelNumber',//规格型号
              exceptedWeight: 'exceptedWeight',//标签重
              weight: 'weight',//重量
              cardId:'flowCardId',//流转卡号
            },
          ],
        };
      },
    },
    {
      label: '流转卡号',
      field: 'flowCardId',
      component: 'Input',
      show: false,//禁止显示
    },
    /*{
      label: '物料编码',
      field: 'materialId',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
     {
       label: '物料名称',
       field: 'materialName',
       component: 'Input',
       dynamicDisabled: true,//禁用
     },
    {
      label: '规格型号',
      field: 'modelNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },*/
    /*{
      label: '生产厂区',
      field: 'plantId',
      component: 'Input',
    },*/
    {
      label: '生产车间',
      field: 'workShopNumber',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/workshop/basWorkShop/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name' },
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
      field: 'workTeamId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/basic/basWorkTeam/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'id,name'},
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
      field: 'operatorId',
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
  return retValue;
}
//冷轧扫码完工页面产品表格字段
export const getDetailJVxeColumns = function () {
  const arr: any[] = [];
  arr.push(
    {
      title: '钢卷号',
      key: 'newCoilNo',
      type: JVxeTypes.input,
    },
    {
      title: '重量',
      key: 'weight',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    {
      title: '物料编码',
      key: 'materialNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    {
      title: '物料名称',
      key: 'materialName',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    {
      title: '规格型号',
      key: 'materialModelNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    /**
     * 流转去向: 1入库、2退料
     */
    {
      title: '流传去向',
      key: 'destination',
      type: JVxeTypes.select,// 使用 select 类型
      dictCode: 'gxlzqx',// 指定字典编码
      disabled: true,   // 禁止编辑
    },
    {
      title: '仓库Id',
      key: 'warehouseId',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      visible: false,   // 设置为隐藏状态，只能通过程序设置
    },
    {
      title: '仓库名称',
      key: 'warehouseName',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
  );
  return arr;
};
