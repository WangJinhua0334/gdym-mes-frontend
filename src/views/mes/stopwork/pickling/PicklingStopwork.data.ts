import { FormSchema } from '@/components/Form';
import { JVxeTypes } from '@/components/jeecg/JVxeTable/types';
import dayjs from 'dayjs';
import { planStartTime } from '@/views/mes/mo/components/MesMoPlanCreateSn.data';
import { rules } from '@/utils/helper/validator';
import { useUserStore } from '@/store/modules/user';
import { getTenantId } from '/@/utils/auth';
//酸洗扫码完工页面产品表格字段
export const getDetailJVxeColumns = function (showCoilNo = false) {
  const arr: any[] = [];
  // 只有在 showCoilNo 为 true 时才添加钢卷号列
  if (showCoilNo) {
    arr.push({
      title: '钢卷号',
      key: 'newCoilNo',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true, // 禁止编辑
    });
  }
  arr.push(
    {
      title: '重量',
      key: 'weight',
      align: 'center',
      type: JVxeTypes.inputNumber,
      componentProps: {
        style: { width: '100%' },
        precision: 2, // 设置小数点后两位
        step: 0.01, // 设置步进值为0.01
      },
      disabled: true, // 禁止编辑
    },
    {
      label: '物料编码',
      field: 'materialNumber',
      component: 'JSearchSelectCustom',
      show: false,//禁止显示
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/etl/basProductMapping2/listByMaterialNumber',
          params: {
            column: 'defaultMapping',
            order: 'desc',
            oldMaterialNumber: '${oldMaterialNumber}',
            tenantId: getTenantId?.() || useUserStore().getUserInfo?.tenantId || '',
            searchFields: 'newMaterialNumber,newMaterialName',
            pageNo: 1,
            pageSize: 20,
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
      show: false,//禁止显示
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
      label: '物料名称',
      field: 'newMaterialName',
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
    /**
     * 流转去向: 1入库、2退料
     */
    {
      title: '流传去向',
      key: 'destination',
      align: 'center',
      type: JVxeTypes.select, // 使用 select 类型
      dictCode: 'gxlzqx', // 指定字典编码
      disabled: true, // 禁止编辑
    },
    {
      title: '质量汇报',
      key: 'qualityReport',
      align: 'center',
      type: JVxeTypes.textarea, // 文本框
      disabled: true,   // 禁止编辑
    },
    // {
    //   title: '仓库Id',
    //   key: 'warehouseId',
    //   type: JVxeTypes.input,
    //   disabled: false,   // 禁止编辑
    //   visible: false,   // 设置为隐藏状态，只能通过程序设置
    // },
    // {
    //   title: '仓库名称',
    //   key: 'warehouseName',
    //   type: JVxeTypes.input,
    //   disabled: false,   // 禁止编辑
    //   visible: false,   // 设置为隐藏状态，只能通过程序设置
    // },
  );
  return arr;
};
//酸洗扫码完工新增弹框页面表单配置（与App端保持一致：重量、物料名称、物料编码、规格型号、流转去向、质量汇报）
export const formSchema: FormSchema[] = [
  // 用于物料选择接口的隐藏参数，从主表单 materialNumber 传入
  {
    label: '原材料编码',
    field: 'oldMaterialNumber',
    component: 'Input',
    show: false,
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
                // 格式化为三位小数，与App端保持一致
                const formattedValue = numValue.toFixed(3);
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
        url: '/etl/basProductMapping2/listByMaterialNumber',
        params: {
          column: 'defaultMapping',
          order: 'desc',
          oldMaterialNumber: '${oldMaterialNumber}',
          tenantId: getTenantId?.() || useUserStore().getUserInfo?.tenantId || '',
          searchFields: 'newMaterialNumber,newMaterialName',
          pageNo: 1,
          pageSize: 10,
        },
        columns: [
          { name: '物料编码', code: 'newMaterialNumber' },
          { name: '物料名称', code: 'newMaterialName' },
          { name: '规格型号', code: 'newModelNumber' },
        ],
        isShowNum: false,
        rowKey: 'newMaterialNumber',
        labelKey: ['newMaterialName'],
        linkmap: [
          {
            newMaterialId: 'newMaterialId',
            newMaterialNumber: 'newMaterialNumber',
            newMaterialName: 'newMaterialName',
            newModelNumber: 'newModelNumber',
          },
        ],
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择物料名称',
        scroll: {
          pageSize: 10,
        },
      };
    },
    dynamicRules: () => [
      {
        required: true,
        message: '请选择物料名称',
      },
    ],
  },
  {
    label: '物料编号',
    field: 'newMaterialId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料编码',
    field: 'newMaterialNumber',
    component: 'Input',
    dynamicDisabled: true,
    componentProps: {
      placeholder: '自动获取',
    },
  },
  {
    label: '规格型号',
    field: 'newModelNumber',
    component: 'Input',
    dynamicDisabled: true,
    componentProps: {
      placeholder: '自动获取',
    },
  },
  {
    label: '流转去向',
    field: 'destination',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'gxlzqx',
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请选择流转去向',
        },
      ];
    },
  },
  {
    label: '质量汇报',
    field: 'qualityReport',
    component: 'InputTextArea',
  }
  // {
  //   label: '仓库 Id',
  //   field: 'warehouseId',
  //   component: 'Input',
  //   show: false,//禁止显示
  // },
  // {
  //   label: '仓库',
  //   field: 'warehouseName',
  //   component: 'JSearchSelectCustom',
  //   componentProps: ({ formActionType }) => {
  //     const { setFieldsValue, getFieldsValue } = formActionType;
  //     return {
  //       setFieldsValue: setFieldsValue,
  //       getFieldsValue: getFieldsValue,
  //       method: 'get',
  //       url: '/basic/wareHouse/list',
  //       params: { column: 'createTime', order: 'desc', searchFields: 'id,name,number', code: '${code}' },
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
  //       rowKey: 'number',
  //       labelKey: ['name'],
  //       linkmap: [
  //         {
  //           id:'warehouseId', //物料编码
  //         },
  //       ],
  //       //pageSize: 10,
  //       multi: false,
  //       maxTagCount: 2,
  //       placeholder: '请选择',
  //       // 启用滚动分页
  //       scroll: {
  //         pageSize: 10
  //       },
  //     };
  //   },
  // },
];

//酸洗扫码完工页面表单配置
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '流转卡号',
      field: 'flowCardId',
      component: 'Input',
      show: false, //禁止显示
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
          url: '/etl/picking/end/list',
          params: {
            column: 'createTime',
            order: 'asc',
            searchFields: 'oldCoilNo',
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
              cardId: 'flowCardId', //钢卷号
              oldMaterialId: 'materialId', //物料编号
              oldMaterialNumber: 'materialNumber', //物料编码
              oldMaterialName: 'materialName', //物料名称
              oldModelNumber: 'modelNumber', //规格型号
              startWeight: 'weight', //重量
            },
          ],
        };
      },
    },
    {
      label: '物料编号',
      field: 'materialId',
      component: 'Input',
      dynamicDisabled: true, //禁用
      show: false, //禁止显示
    },
    {
      label: '物料名称',
      field: 'materialName',
      component: 'Input',
      dynamicDisabled: true, //禁用
    },
    {
      label: '物料编码',
      field: 'materialNumber',
      component: 'Input',
      dynamicDisabled: true, //禁用
    },
    {
      label: '规格型号',
      field: 'modelNumber',
      component: 'Input',
      dynamicDisabled: true, //禁用
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
      dynamicDisabled: true, //禁用
      componentProps: {
        style: { width: '100%' }
      }
    },
    {
      label: '操作员',
      field: 'operatorNumber',
      component: 'Input',
      defaultValue: useUserStore().getUserInfo.username,
      dynamicDisabled: true, //禁用
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
      label: '租户 ID',
      field: 'tenantId',
      component: 'Input',
      defaultValue: getTenantId(),
      dynamicDisabled: true, //禁用
      show: false, //默认隐藏
      componentProps: {
        style: { width: '100%' }
      }
    },
  ];
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
