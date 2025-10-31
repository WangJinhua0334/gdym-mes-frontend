import {FormSchema} from "@/components/Form";
import {rules} from "@/utils/helper/validator";
import {planStartTime} from "@/views/mes/mo/components/MesMoPlanCreateSn.data";
import dayjs from "dayjs";
import {useUserStore} from "@/store/modules/user";
import {getTenantId} from "@/utils/auth";
//酸洗扫码开工页面表单配置
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '流转卡号',
      field: 'flowCardId',
      component: 'Input',
      show: false,//禁止显示
      dynamicDisabled: true,//禁用
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
          url: '/etl/picking/start/list',  // 返回的是流转卡记录
          params: {
            column: 'createTime',
            order: 'asc',
            searchFields: 'id',
            // steelId: '${steelId}'
          },
          columns: [
            {
              name: '钢卷号',
              code: 'steelId',
            },
          ],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id', // 流转卡对象中的 id 和 steelId 是一样的值
          labelKey: ['steelId'],
          placeholder: '请输入',
          linkmap: [
            {
              id: 'flowCardId',
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
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择钢卷!' }];
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
      show: true,
    },
    // {
    //   label: '生产厂区',
    //   field: 'plantId',
    //   component: 'Input',
    // },
    // { // 生产车间根据登录用户绑定的车间
    //   label: '生产车间',
    //   field: 'workShopId',
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
    //       rowKey: 'id',
    //       linkmap: [{
    //         id:'workShopId',//车间编号
    //         code:'workShopNumber',//车间编号
    //         // workShopName:'workShopName',//车间名称
    //       }],
    //       labelKey: ['name'],
    //       placeholder: '请输入',
    //     };
    //   },
    // },
    // {
    //   label: '生产车间 number',
    //   field: 'workShopNumber',
    //   component: 'Input',
    //   dynamicDisabled: true,//禁用
    //   show: false,//禁止显示
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
    //       linkmap: [{
    //         workTeamId:'workTeamId',//班组编号
    //         workTeamNumber:'workTeamNumber',//班组编号
    //         // workTeamName:'workTeamName',//班组名称
    //       }],
    //       labelKey: ['name'],
    //       placeholder: '请输入',
    //     };
    //   },
    // },
    // {
    //   label: '生产班组 number',
    //   field: 'workTeamNumber',
    //   component: 'Input',
    //   dynamicDisabled: true,//禁用
    //   show: false,//禁止显示
    // },
    {
      label: '开工时间',
      field: 'startTime',
      component: 'DatePicker',
      dynamicDefaultValue: () => {
        return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
      },
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        getPopupContainer: () => document.body
      },
      dynamicRules: ({ model, schema, values }) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }];
      },
    },
    {
      label: '标签重',
      field: 'exceptedWeight',
      component: 'InputNumber',
      componentProps: {
        style: { width: '100%' }
      },
      dynamicDisabled: true,//禁用
    },
    {
      label: '实际重量',
      field: 'weight',
      component: 'InputNumber',
      // defaultValue: 0.00,
      componentProps: {
        style: { width: '100%' },
        precision: 2,        // 设置小数点后两位
        step: 0.01,          // 设置步进值为0.01
      },
    },
    {
      label: '限定占比',
      field: 'limitedProportion',
      component: 'InputNumber',
      dynamicDisabled: true,
      componentProps: {
        style: { width: '100%' }
      }
    },
    {
      label: '范围值',
      field: 'rangeValue',
      component: 'InputNumber',
      defaultValue: 3,  // 设置默认值为3
      componentProps: {
        addonAfter: '‰' , // 在输入框后添加千分号
        style: { width: '100%' }
      }
    },
    {
      label: '设备',
      field: 'equipmentId',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/basic/basEquipment/list',
          params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
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
          linkmap: [{
            // equipmentId:'equipmentId',//设备编号
            code:'equipmentNumber',//设备编号
            // equipmentName:'equipmentName',//设备名称
          }],
          // 是否显示序号
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请输入',
        };
      },
      dynamicRules: ({ model, schema, values }) => {
        return [{ required: true, message: '请选择设备!' }];
      },
    },
    {
      label: '设备 number',
      field: 'equipmentNumber',
      component: 'Input',
      dynamicDisabled: true,//禁用
      show: false,//禁止显示
    },
    {
      label:'操作员',
      field: 'operatorNumber',
      component:'Input',
      defaultValue:useUserStore().getUserInfo.username,
      dynamicDisabled: true,//禁用
      show: false,//默认隐藏
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
    // {
    //   label: '要求查看',
    //   field: 'requireId',
    //   component: 'Input',
    // },
  ];
}
