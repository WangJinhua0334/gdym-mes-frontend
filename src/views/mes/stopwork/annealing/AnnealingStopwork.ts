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
    componentProps: ({ formActionType }) => {
      const { setFieldsValue: originalSetFieldsValue } = formActionType;
      return {
        style: { width: '100%' },
        placeholder: '请输入重量',
        onBlur: (e: FocusEvent) => {
          // 失去焦点时，格式化数字（保留两位小数）
          const target = e.target as HTMLInputElement;
          const currentValue = target.value;
          
          if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
            let strValue = String(currentValue).trim();
            // 处理以小数点结尾的情况，如 "10." -> "10"
            if (strValue.endsWith('.')) {
              strValue = strValue.slice(0, -1);
            }
            // 检查是否是有效的数字（只允许数字和小数点，不允许字母或负号）
            const numberRegex = /^\d+(\.\d*)?$/;
            if (numberRegex.test(strValue) && strValue !== '.' && strValue !== '') {
              const numValue = parseFloat(strValue);
              if (!isNaN(numValue) && isFinite(numValue) && numValue >= 0) {
                // 格式化为两位小数，直接使用 toFixed(2) 返回的字符串
                const formattedValue = numValue.toFixed(2);
                // 只有当格式化后的值与当前值不同时才更新
                if (formattedValue !== strValue) {
                  // 更新输入框的值
                  target.value = formattedValue;
                  // 更新表单值
                  originalSetFieldsValue({
                    weight: formattedValue,
                  });
                }
              }
            }
          }
        },
      };
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            // 如果值为空，允许通过（因为 required: false）
            if (value === null || value === undefined || value === '') {
              return Promise.resolve();
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
                return Promise.reject(new Error('重量不能为负数'));
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
              return Promise.reject(new Error('重量不能小于0'));
            }
            return Promise.resolve();
          },
          trigger: ['change', 'blur'],
        },
      ];
    },
  },
  {
    label: '物料名称',
    field: 'newMaterialName',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/etl/rolling/getNewMaterialInfo',
        params: {
          column: 'createTime',
          order: 'desc',
          flowCardId: '${flowCardId}',
          searchFields: 'old_name,old_model_number'
        },
        columns: [
          {name: '物料编码', code: 'code'},
          {name: '物料名称', code: 'name'},
          {name: '规格型号', code: 'modelNumber'},
        ],
        isShowNum: false,
        rowKey: 'name',
        labelKey: ['name'],
        linkmap: [
          {
            id:'newMaterialId',//物料编号
            code:'newMaterialNumber',//物料编码
            // name:'newMaterialName',//物料名称
            modelNumber:'newModelNumber',//规格型号
          },
        ],
        //pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择',
        // // 启用滚动分页
        // scroll: {
        //   pageSize: 10
        // },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择物料!' }];
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
    dynamicRules: () => {
      return [{ required: true, message: '请选择流转去向!' }];
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
          url: '/etl/annealing/end/list',
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
      dynamicRules: ({ model }) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
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
        getPopupContainer: () => document.body
      },
      dynamicRules: ({ model }) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }] as any;
      },
    } as FormSchema,
    {
      label: '重量',
      field: 'weight',
      component: 'InputNumber',
      dynamicDisabled: true,//禁用
      componentProps: {
        style: { width: '100%' },
        precision: 2,        // 设置小数点后两位，会自动格式化为两位小数（如 5 显示为 5.00）
        step: 0.01,          // 设置步进值为0.01
        min: 0,              // 最小值为0
        // 控制输入：只允许输入数字和小数点
        keyboard: true,      // 允许键盘输入
      },
      dynamicRules: () => {
        return [
          {
            required: false,
            validator: (_, value) => {
              // 检查是否为有效数字
              if (typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
                return Promise.resolve();
              }
              // 如果输入的不是合法数字或者为空值，返回错误
              // 注意：InputNumber 组件本身已经限制了只能输入数字，这个验证主要用于处理边界情况
              return Promise.reject(new Error('输入的不是合法数字'));
            },
            trigger: ['change', 'blur'],
          },
        ];
      },
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
      },
      dynamicRules: () => {
        return [
          {
            required: true,
            message: '操作员信息不能为空，请重新登录或联系管理员!'
          },
          {
            validator: (_, value) => {
              if (!value || value.trim() === '') {
                return Promise.reject('操作员信息不能为空，请重新登录或联系管理员!');
              }
              return Promise.resolve();
            }
          }
        ];
      },
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
      align: 'center',
      type: JVxeTypes.input,
      // width: auto,
      fixed: true,
      disabled: true,   // 禁止编辑
    },
    {
      title: '重量',
      key: 'weight',
      align: 'center',
      type: JVxeTypes.inputNumber,
      disabled: true,   // 禁止编辑
      componentProps: {
        style: { width: '100%' },
        precision: 2,        // 设置小数点后两位
        step: 0.01,          // 设置步进值为0.01
      },
      // width: 120
    },
    {
      title: '物料编码',
      align: 'center',
      key: 'newMaterialNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      // width: auto
    },
    {
      title: '物料名称',
      align: 'center',
      key: 'newMaterialName',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      // width: 120
    },
    {
      title: '规格型号',
      align: 'center',
      key: 'newModelNumber',
      type: JVxeTypes.input,
      disabled: true,   // 禁止编辑
      // width: 120
    },
    /**
     * 流转去向: 1入库、2退料
     */
    {
      title: '流传去向',
      align: 'center',
      key: 'destination',
      type: JVxeTypes.select,// 使用 select 类型
      dictCode: 'gxlzqx',// 指定字典编码
      disabled: true,   // 禁止编辑
    },
    {
      title: '质量汇报',
      align: 'center',
      fixed: true,
      key: 'qualityReport',
      type: JVxeTypes.textarea,// 使用 select 类型
      disabled: true,   // 禁止编辑
    },
  );
  return arr;
};


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
    dynamicRules: () => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];
