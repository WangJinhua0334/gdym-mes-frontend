<script setup lang="ts" name="mo-SalesOutboundModel">

import {saveOrUpdate, getEditData, listMoPlanTaskByMoPlanId,} from './SalesOutbound.api'
import {getFormSchema, mesSalesOutboundTaskJVxeColumns} from './SalesOutbound.data';
import {BasicModal, useModal, useModalInner} from "@/components/Modal";
import {computed, reactive, ref, unref} from "vue";
import {BasicForm, useForm} from "@/components/Form";
import {JVxeTable} from "@/components/jeecg/JVxeTable";
import {useJvxeMethod} from "@/hooks/system/useJvxeMethods";
import {useMessage} from "@/hooks/web/useMessage";
//设置标题
const title = computed(() => ('销售发货'));

/**销售发货 备料弹框 */
const [registerForm, { setProps, setFieldsValue, updateSchema,resetFields }] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: false,
});
// 提示方法声明
const $message = useMessage();
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref<boolean>(false);
const disabled = ref<boolean>(false);
const moPlanId = ref<string>();
const refKeys = ref(['mesSalesOutboundTask']);
const activeKey = ref('mesSalesOutboundTask');
const mesSalesOutboundTask = ref();
const tableRefs = { mesSalesOutboundTask };
const props = defineProps({
  moId: {
    type: String,
    default: '',
  },
});
//备料产品列表
const mesSalesOutboundTaskTable = reactive({
  loading: false,
  dataSource: [],
  columns: mesSalesOutboundTaskJVxeColumns,
});

/**子表格方法配置*/
const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
  requestAddOrEdit,
  classifyIntoFormData,
  tableRefs,
  activeKey,
  refKeys
);
/**表单提交事件*/
async function requestAddOrEdit(values) {
  try {
    setModalProps({ confirmLoading: true });
    //提交表单
    await saveOrUpdate(values, isUpdate.value);

    //关闭弹窗
    closeModal();
    //刷新列表
    emit('success');
  } catch (error) {
    console.log(error);
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
/**取消事件 */
function handleCancel() {
  //关闭弹窗
  closeModal();
}
/**提交参数构造 */
function classifyIntoFormData(allValues) {
  let main = Object.assign({}, allValues.formValue);
  return {
    ...main, // 展开
  };
}
/**表单赋值*/
const [registerModalInner, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //重置表单
  await resetFields();

  setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: true });

  isUpdate.value = !!data?.isUpdate;
  disabled.value = !!data?.disabled;
  if (unref(isUpdate)) {
    moPlanId.value = data.record.id;
    try {
      setModalProps({ confirmLoading: true });

      /**表单赋值 */
      await getEditData({ moPlanId: data.record.id }).then((res) => {
        setFieldsValue({ ...res });
        requestSubTableData(listMoPlanTaskByMoPlanId, { moPlanId: data.record.id }, mesSalesOutboundTaskTable);
      });
    } catch (error) {
      closeModal();
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  } else {
    if (props.moId && props.moId != '') {
      setFieldsValue({ moId: props.moId });
      updateSchema({ field: 'moId', dynamicDisabled: true });
    } else {
      setFieldsValue({ planStartTime: new Date().setMinutes(0, 0), planCompleteTime: new Date().setMinutes(0, 0) });
    }
  }

  setProps({ disabled: unref(disabled) });
});
</script  >
<!--销售发货页面-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModalInner" :title="title" destroyOnClose  :width="896" :showFullScreen="true" @cancel="handleCancel" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="发货物料明细" key="mesSalesOutboundTask" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesSalesOutboundTask"
          :loading="mesSalesOutboundTaskTable.loading"
          :columns="mesSalesOutboundTaskTable.columns"
          :dataSource="mesSalesOutboundTaskTable.dataSource"
          :max-height="450"
          :disabled="disabled"
          :rowNumber="true"
          :sortKey="''"
          :rowSelection="false"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<style scoped lang="less" >

</style>
