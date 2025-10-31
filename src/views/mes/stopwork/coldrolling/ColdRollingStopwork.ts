import {FormSchema} from "@/components/Form";
import {JVxeTypes} from "@/components/jeecg/JVxeTable/types";
import dayjs from "dayjs";
import {planStartTime} from "@/views/mes/mo/components/MesMoPlanCreateSn.data";
import {rules} from "@/utils/helper/validator";
import {useUserStore} from "@/store/modules/user";
import { getTenantId } from "/@/utils/auth";
import { getUserInfo } from '@/api/sys/user';
//冷轧扫码完工新增弹框页面表单配置
export const formSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'newCoilNo',
    component: 'Input',
    dynamicDisabled: true, // 设置为禁用状态，只能通过程序设置
  },
  {
    label: '流转卡卡号',//用来过滤物料编码信息
    field: 'flowCardId',
    component: 'Input',
    dynamicDisabled: true, // 设置为禁用状态，只能通过程序设置
    show: true,//禁止显示
  },
  {
    label: '重量',
    field: 'weight',
    component: 'Input',
    componentProps: {
      style: { width: '100%' },
      precision: 2,        // 设置小数点后两位
      step: 0.01,          // 设置步进值为0.01
    }
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
        params: {
          column: 'createTime',
          order: 'desc',
          flowCardId: '${flowCardId}',
          searchFields: 'old_name,old_model_number'
        },
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
            id:'newMaterialId',//物料编号
            number:'newMaterialNumber',//物料编码
            name:'newMaterialName',//物料名称
            materialModelNumber:'newModelNumber',//规格型号
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
    label: "物料编号",
    field: 'newMaterialId',
    component: 'Input',
    show: true,//禁止显示
    dynamicDisabled : true,
  },
  {
    label: '物料名称',
    field: 'newMaterialName',
    component: 'Input',
    show: true,//禁止显示
    dynamicDisabled : true,
  },{
    label: '物料编码',
    field: 'newMaterialNumber',
    component: 'Input',
    show: true,//禁止显示
    dynamicDisabled : true,
  },
  {
    label: '规格型号',
    field: 'newModelNumber',
    component: 'Input',
    show: true,//禁止显示
    dynamicDisabled : true,
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
    label: '质量汇报',
    field: 'qualityReport',
    component: 'InputTextArea',
  }
];

//冷轧扫码完工页面表单配置
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '流转卡号',
      field: 'flowCardId',
      component: 'Input',
      show: false,//禁止显示
    },
    {
      label: '钢卷号',
      field: 'oldCoilNo',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          //url: '/mes/picking/list',
          url: '/etl/rolling/end/list',
          params: {
            column: 'createTime',
            order: 'desc',
            searchFields: 'oldCoilNo',
            username: useUserStore().getUserInfo.username,
          },
          columns: [
            {
              name: '钢卷号',
              code: 'oldCoilNo',
            },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'oldCoilNo',
          labelKey: ['oldCoilNo'],
          placeholder: '请输入',
          linkmap: [
            {
              oldMaterialId:'materialId',//物料编号
              oldMaterialNumber:'materialNumber',//物料编码
              oldMaterialName:'materialName',//物料名称
              oldModelNumber: 'modelNumber',//规格型号
              startWeight: 'weight',//
              cardId:'flowCardId',//流转卡号
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
      label: '物料名称',
      field: 'materialName',
      component: 'Input',
      dynamicDisabled: true,//禁用
    },
    {
      label: '物料编码',
      field: 'materialNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
      show: true,//禁止显示
    },
    {
      label: '规格型号',
      field: 'modelNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
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
        getPopupContainer: (node) => document.body
      },
      dynamicRules: ({ model, schema, values }) => {
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
      disabled: false,   // 禁止编辑
    },
    {
      title: '物料编码',
      key: 'newMaterialNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    {
      title: '物料名称',
      key: 'newMaterialName',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
    },
    {
      title: '规格型号',
      key: 'newModelNumber',
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
      title: '质量汇报',
      key: 'qualityReport',
      type: JVxeTypes.textarea,// 使用 select 类型
      disabled: true,   // 禁止编辑
    },
    // {
    //   title: '仓库Id',
    //   key: 'warehouseId',
    //   type: JVxeTypes.input,
    //   disabled: true,   // 禁止编辑
    //   visible: false,   // 设置为隐藏状态，只能通过程序设置
    // },
    // {
    //   title: '仓库名称',
    //   key: 'warehouseName',
    //   type: JVxeTypes.input,
    //   disabled: true,   // 禁止编辑
    // },
  );
  return arr;
};
