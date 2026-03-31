import { FormSchema } from '@/components/Form';
import { rules } from '@/utils/helper/validator';
import { planStartTime } from '@/views/mes/mo/components/MesMoPlanCreateSn.data';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/modules/user';
import { getTenantId } from '@/utils/auth';

/** 与 App 酸洗开工页一致：钢卷号回车查询、分区、字段顺序 */
export type AcidPickStartHandlers = {
  onQueryCoil: () => void | Promise<void>;
  onCoilChange: (e: Event) => void;
  onWeightPressEnter?: () => void;
  onWeightChange?: () => void;
  onWeightBlur?: () => void;
};

/** 钢卷号 / 实际重量输入框 id，供查询成功后聚焦、开工成功后回焦 */
export const ACID_PICK_COIL_INPUT_ID = 'acidPickOldCoilNo';
export const ACID_PICK_WEIGHT_INPUT_ID = 'acidPickWeight';

export function getFormSchema(handlers?: AcidPickStartHandlers): FormSchema[] {
  const onQuery = handlers?.onQueryCoil ?? (() => {});
  const onCoilChange = handlers?.onCoilChange ?? (() => {});
  const onWeightPressEnter = handlers?.onWeightPressEnter ?? (() => {});
  const onWeightChange = handlers?.onWeightChange ?? (() => {});
  const onWeightBlur = handlers?.onWeightBlur ?? (() => {});

  return [
    {
      label: '流转卡号',
      field: 'flowCardId',
      component: 'Input',
      show: false,
      dynamicDisabled: true,
    },
    {
      label: '物料编号',
      field: 'materialId',
      component: 'Input',
      dynamicDisabled: true,
      show: false,
    },
    {
      component: 'Divider',
      label: '钢卷信息',
      field: '_divider_coil',
      colProps: { span: 24 },
    },
    {
      label: '钢卷号',
      field: 'oldCoilNo',
      component: 'Input',
      componentProps: {
        id: ACID_PICK_COIL_INPUT_ID,
        placeholder: '请输入或扫描钢卷号，按回车查询',
        allowClear: true,
        onPressEnter: onQuery,
        onChange: onCoilChange,
      },
      dynamicRules: () => {
        return [{ required: true, message: '请输入钢卷号!' }];
      },
    },
    {
      label: '物料编码',
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
      show: true,
    },
    {
      label: '标签重',
      field: 'exceptedWeight',
      component: 'InputNumber',
      componentProps: {
        style: { width: '100%' },
      },
      dynamicDisabled: true,
    },
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
        getPopupContainer: () => document.body,
      },
      dynamicRules: ({ model }) => {
        if (model.planStartTime) planStartTime.value = model.planStartTime;
        else planStartTime.value = null;
        return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }] as any;
      },
    } as FormSchema,
    {
      label: '操作员',
      field: 'operatorNumber',
      component: 'Input',
      defaultValue: useUserStore().getUserInfo.username,
      dynamicDisabled: true,
      show: true,
      componentProps: {
        style: { width: '100%' },
      },
    },
    {
      label: '选中记录更新时间',
      field: 'updateTime',
      component: 'Input',
      show: false,
    },
    {
      component: 'Divider',
      label: '称重信息',
      field: '_divider_weight',
      colProps: { span: 24 },
    },
    {
      label: '实际重量',
      field: 'weight',
      component: 'InputNumber',
      componentProps: {
        id: ACID_PICK_WEIGHT_INPUT_ID,
        style: { width: '100%' },
        placeholder: '请输入实际重量',
        min: 0,
        precision: 3,
        step: 0.001,
        onPressEnter: onWeightPressEnter,
        onChange: onWeightChange,
        onBlur: onWeightBlur,
      },
      dynamicRules: () => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (value === null || value === undefined || value === '') {
                return Promise.reject(new Error('请输入实际重量'));
              }
              const numValue = typeof value === 'number' ? value : parseFloat(String(value).trim());
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
      label: '范围值',
      field: 'rangeValue',
      component: 'InputNumber',
      defaultValue: 3,
      componentProps: {
        addonAfter: '‰',
        style: { width: '100%' },
        min: 0,
      },
    },
    {
      label: '限定占比',
      field: 'limitedProportion',
      component: 'InputNumber',
      dynamicDisabled: true,
      componentProps: {
        style: { width: '100%' },
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
