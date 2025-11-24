import {FormSchema} from "@/components/Form";
import {JVxeTypes} from "@/components/jeecg/JVxeTable/types";
import dayjs from "dayjs";
import {useUserStore} from "@/store/modules/user";
import { getTenantId } from "/@/utils/auth";

/**
 * 领料弹框表单配置
 */
export const materialFormSchema: FormSchema[] = [
  {
    label: '钢卷号',
    field: 'oldCoilNo',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basMaterial/list', // 根据实际情况调整URL
        params: {
          column: 'createTime',
          order: 'desc',
        },
        columns: [
          {
            title: '钢卷号',
            align: 'center',
            dataIndex: 'code',
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
        ],
        queryInfo: [
          {
            field: 'materialName',
            label: '物料名称',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'modelNumber',
            label: '规格型号',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择',
        linkmap: [
          {
            code: 'oldCoilNo',
            materialName: 'materialName',
            materialNumber: 'materialNumber',
            modelNumber: 'modelNumber',
            weight: 'weight',
          },
        ],
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择钢卷号!' }];
    },
  },
  {
    label: '钢卷名称',
    field: 'materialName',
    component: 'Input',
    componentProps: {
      placeholder: '请输入钢卷名称',
    },
  },
  {
    label: '材质',
    field: 'materialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '请输入材质',
    },
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'Input',
    componentProps: {
      placeholder: '请输入规格型号',
    },
  },
  {
    label: '重量',
    field: 'weight',
    component: 'Input',
    componentProps: {
      placeholder: '请输入重量',
    },
    dynamicRules: () => {
      return [
        {
          validator: (_, value) => {
            if (value === null || value === undefined || value === '') {
              return Promise.resolve();
            }
            const numValue = parseFloat(value);
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
];

/**
 * 罩退开工主表单配置
 */
export function getFormSchema(): FormSchema[] {
  return [
    {
      label: '设备',
      field: 'equipmentNumber',
      component: 'JSearchSelectCustom',
      componentProps: ({ formActionType }) => {
        const { setFieldsValue, getFieldsValue } = formActionType;
        return {
          setFieldsValue: setFieldsValue,
          getFieldsValue: getFieldsValue,
          method: 'get',
          url: '/basic/basEquipment/list',
          params: {
            column: 'code',
            order: 'asc',
            searchFields: 'code,name',
          },
          columns: [
            {
              name: '设备编码',
              code: 'code',
            },
            {
              name: '设备名称',
              code: 'name',
            },
          ],
          isShowNum: false,
          rowKey: 'id',
          labelKey: ['name'],
          placeholder: '请选择设备',
        };
      },
      dynamicRules: () => {
        return [{ required: true, message: '请选择设备!' }];
      },
    },
    {
      label: '开工时间',
      field: 'startTime',
      component: 'DatePicker',
      defaultValue: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        getPopupContainer: () => document.body,
      },
      dynamicRules: () => {
        return [{ required: true, message: '请选择开工时间!' }];
      },
    },
    {
      label: '炉温',
      field: 'temperature',
      component: 'Input',
      componentProps: {
        placeholder: '请输入炉温',
      },
    },
    {
      label: '保温时间',
      field: 'keepWarmTime',
      component: 'Input',
      componentProps: {
        placeholder: '请输入保温时间（如：2小时30分钟）',
      },
    },
    {
      label: '天然气用量',
      field: 'tUsage',
      component: 'Input',
      componentProps: {
        placeholder: '请输入天然气用量',
      },
    },
    {
      label: '氮气用量',
      field: 'dUsage',
      component: 'Input',
      componentProps: {
        placeholder: '请输入氮气用量',
      },
    },
    {
      label: '氢气用量',
      field: 'qUsage',
      component: 'Input',
      componentProps: {
        placeholder: '请输入氢气用量',
      },
    },
    {
      label: '备注',
      field: 'note',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
    {
      label: '操作员',
      field: 'operatorNumber',
      component: 'Input',
      defaultValue: useUserStore().getUserInfo.username,
      dynamicDisabled: true,
      componentProps: {
        style: { width: '100%' },
      },
      dynamicRules: () => {
        return [
          {
            required: true,
            message: '操作员信息不能为空，请重新登录或联系管理员!',
          },
        ];
      },
    },
    {
      label: '租户 ID',
      field: 'tenantId',
      component: 'Input',
      defaultValue: getTenantId(),
      dynamicDisabled: true,
      show: false,
      componentProps: {
        style: { width: '100%' },
      },
    },
  ];
}

/**
 * 表格列配置
 */
export const getMaterialColumns = function () {
  const arr: any[] = [
    {
      title: '钢卷号',
      key: 'oldCoilNo',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,
      width: 180,
    },
    {
      title: '钢卷名称',
      key: 'materialName',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,
      width: 150,
    },
    {
      title: '材质',
      key: 'materialNumber',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,
      width: 120,
    },
    {
      title: '规格型号',
      key: 'modelNumber',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,
      width: 150,
    },
    {
      title: '重量',
      key: 'weight',
      align: 'center',
      type: JVxeTypes.input,
      disabled: true,
      width: 120,
    },
  ];
  return arr;
};
