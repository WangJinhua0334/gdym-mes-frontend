import { FormSchema } from '@/components/Form';
import { rules } from '@/utils/helper/validator';
import { planStartTime } from '@/views/mes/mo/components/MesMoPlanCreateSn.data';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/modules/user';
import { getTenantId } from '@/utils/auth';

/**
 * 精拉开工：与冷轧相同结构；无实际重量、无称重校验（与酸洗的差异）
 */
export type StaticPullStartHandlers = {
  onQueryCoil: () => void | Promise<void>;
  onCoilChange: (e: Event) => void;
};

export const STATIC_PULL_COIL_INPUT_ID = 'staticPullOldCoilNo';
export const STATIC_PULL_START_TIME_ID = 'staticPullStartTime';

export function getFormSchema(handlers?: StaticPullStartHandlers): FormSchema[] {
  const onQuery = handlers?.onQueryCoil ?? (() => {});
  const onCoilChange = handlers?.onCoilChange ?? (() => {});

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
        id: STATIC_PULL_COIL_INPUT_ID,
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
        precision: 3,
        step: 0.001,
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
        id: STATIC_PULL_START_TIME_ID,
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
      label: '重量',
      field: 'weight',
      component: 'InputNumber',
      show: false,
      dynamicDisabled: true,
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
