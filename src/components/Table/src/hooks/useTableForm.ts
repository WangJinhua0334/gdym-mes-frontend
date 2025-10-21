import type { ComputedRef, Slots } from 'vue';
import type { BasicTableProps, FetchParams } from '../types/table';
import { unref, computed } from 'vue';
import type { FormProps } from '/@/components/Form';
import { isFunction } from '/@/utils/is';

export function useTableForm(
  propsRef: ComputedRef<BasicTableProps>,
  slots: Slots,      // 组件的插槽
  fetch: (opt?: FetchParams | undefined) => Promise<void>, // 获取数据的函数
  getLoading: ComputedRef<boolean | undefined>             // 获取加载状态的计算属性
) {
  // 提取表单的配置
  const getFormProps = computed((): Partial<FormProps> => {
    const { formConfig } = unref(propsRef);
    const { submitButtonOptions, autoSubmitOnEnter} = formConfig || {};
    return {
      showAdvancedButton: true,
      ...formConfig,
      submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
      compact: true,
      //update-begin-author:liusq---date:20230605--for: [issues/568]设置 autoSubmitOnEnter: false 不生效 ---
      autoSubmitOnEnter: autoSubmitOnEnter,
      //update-end-author:liusq---date:20230605--for: [issues/568]设置 autoSubmitOnEnter: false 不生效 ---
    };
  });

  const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
    const keys = Object.keys(slots);
    return keys.map((item) => (item.startsWith('form-') ? item : null)).filter((item) => !!item) as string[];
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/form\-/, '') ?? '';
  }

  function handleSearchInfoChange(info: Recordable) {
    const { handleSearchInfoFn } = unref(propsRef);
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      info = handleSearchInfoFn(info) || info;
    }
    fetch({ searchInfo: info, page: 1 });
  }

  return {
    getFormProps,
    replaceFormSlotKey,
    getFormSlotKeys,
    handleSearchInfoChange,
  };
}
