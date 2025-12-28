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
        const { setFieldsValue: originalSetFieldsValue, getFieldsValue } = formActionType;
        return {
          // 包装 setFieldsValue，在设置字段值后计算限定占比
          setFieldsValue: (values: any) => {
            // 先设置 linkmap 映射的字段值（使用原始的 setFieldsValue）
            originalSetFieldsValue(values);
            // 如果标签重有值，计算限定占比
            if (values && values.exceptedWeight) {
              // 获取标签重和范围值（范围值从 values 中获取，如果没有则使用默认值3）
              const exceptedWeight = parseFloat(values.exceptedWeight || 0);
              // 使用 setTimeout 确保字段值已经设置完成后再获取范围值
              setTimeout(() => {
                const currentValues = getFieldsValue();
                const rangeValue = parseFloat(currentValues.rangeValue || 3); // 默认范围值为3
                
                // 如果标签重有值，计算限定占比
                if (exceptedWeight && exceptedWeight > 0) {
                  // 将范围值转换为小数（千分比转小数）
                  const rangeDecimal = rangeValue / 1000;
                  // 计算限定占比：标签重 × (1 - 范围值)
                  const limitedProportion = (exceptedWeight * (1 - rangeDecimal)).toFixed(2);
                  // 设置限定占比字段的值（使用原始的 setFieldsValue）
                  originalSetFieldsValue({
                    limitedProportion: limitedProportion, // 保留两位小数
                  });
                }
              }, 10);
            } else {
              // 如果标签重为空，清空限定占比
              originalSetFieldsValue({
                limitedProportion: undefined,
              });
            }
          },
          getFieldsValue: getFieldsValue,
          method: 'get',
          //url: '/mes/picking/list',
          url: '/etl/picking/start/list', // 返回的是流转卡记录
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
      dynamicRules: () => {
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
      dynamicRules: ({ model }) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }] as any;
      },
    } as FormSchema,
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
      component: 'Input',
      componentProps: {
        style: { width: '100%' },
        placeholder: '请输入实际重量',
      },
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_, value) => {
              // 如果值为空，返回错误
              if (value === null || value === undefined || value === '') {
                return Promise.reject(new Error('请输入实际重量'));
              }
              // 将值转换为字符串进行验证
              let strValue = String(value).trim();
              // 处理以小数点结尾的情况，如 "10." -> "10"
              if (strValue.endsWith('.')) {
                strValue = strValue.slice(0, -1);
              }
              // 检查是否包含非数字字符（除了小数点）
              // 正则表达式：只允许数字和小数点，不允许字母、负号或其他字符
              // 允许：纯数字、数字+小数点、数字+小数点+数字（包括两位小数）
              const numberRegex = /^\d+(\.\d*)?$/;
              if (!numberRegex.test(strValue) || strValue === '.' || strValue === '') {
                // 检查是否包含字母
                if (/[a-zA-Z]/.test(strValue)) {
                  return Promise.reject(new Error('请输入有效的数字，不能包含字母'));
                }
                // 检查是否包含负号
                if (strValue.includes('-')) {
                  return Promise.reject(new Error('实际重量不能为负数'));
                }
                // 其他无效字符
                return Promise.reject(new Error('请输入有效的数字，不能包含特殊字符'));
              }
              // 转换为数字进行范围检查
              const numValue = parseFloat(strValue);
              if (isNaN(numValue) || !isFinite(numValue)) {
                return Promise.reject(new Error('请输入有效的数字'));
              }
              if (numValue < 0) {
                return Promise.reject(new Error('实际重量不能小于0'));
              }
              return Promise.resolve();
            },
            trigger: ['change', 'blur'],
          },
        ];
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
    // {
    //   label: '设备',
    //   field: 'equipmentId',
    //   component: 'JSearchSelectCustom',
    //   componentProps: ({ formActionType }) => {
    //     const { setFieldsValue, getFieldsValue } = formActionType;
    //     return {
    //       setFieldsValue: setFieldsValue,
    //       getFieldsValue: getFieldsValue,
    //       method: 'get',
    //       url: '/etl/picking/getEquipment',
    //       params: {
    //         column: 'createTime',
    //         order: 'desc',
    //         searchFields: 'code,name',
    //         code: '${code}'
    //       },
    //       columns: [
    //         {
    //           name: '编码',
    //           code: 'code',
    //         },
    //         {
    //           name: '名称',
    //           code: 'name',
    //         },
    //       ],
    //       linkmap: [{
    //         // equipmentId:'equipmentId',//设备编号
    //         code:'equipmentNumber',//设备编号
    //         // equipmentName:'equipmentName',//设备名称
    //       }],
    //       // 是否显示序号
    //       isShowNum: false,
    //       rowKey: 'id',
    //       labelKey: ['name'],
    //       placeholder: '请输入',
    //     };
    //   },
    //   dynamicRules: () => {
    //     return [{ required: true, message: '请选择设备!' }];
    //   },
    // },
    // {
    //   label: '设备 number',
    //   field: 'equipmentNumber',
    //   component: 'Input',
    //   dynamicDisabled: true,//禁用
    //   show: false,//禁止显示
    // },
    {
      label:'操作员',
      field: 'operatorNumber',
      component:'Input',
      defaultValue:useUserStore().getUserInfo.username,
      dynamicDisabled: true,//禁用
      show: true,//默认隐藏
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
