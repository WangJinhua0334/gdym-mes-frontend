<template>
  <BasicModal v-bind="$attrs" @register="registerDrawer" title="编辑工序" width="700px" @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm" />
    <!--右下角按钮-->
    <template #footer>
      <a-button @click="closeModal" type="ghost">取消</a-button>
      <a-button @click="handleSubmit" type="primary" :loading="loading">确定</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, useAttrs } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { formSchemaDrawer, workflowId, prodId, isGroup } from '../BasWorkflowStation.data';
  import { basWorkflowStation } from '../BasWorkflowStation.api';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const attrs = useAttrs();
  const loading = ref(false);
  //const isUpdate = ref(true);

  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 110,
    schemas: formSchemaDrawer,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: true });

    workflowId.value = data.workflowId;
    prodId.value = data.prodId;
    isGroup.value = data.isGroup;

    let stationData = data.record;
    if (!data.record.editflag) {
      // 查询工序数据
      await basWorkflowStation({ id: data.record.id }).then((record) => {
        if (record) {
          stationData = record;
        }
      });
    }

    setFieldsValue({
      ...stationData,
    });

    //禁用表单
    setProps({ disabled: !attrs.showFooter });
  });

  /**
   * 提交
   */
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      values.editflag = true;
      if (unref(workflowId)) {
        values.workflowId = unref(workflowId);
      }

      if (values.childStationIds && values.childStationIds.indexOf(',') > -1) {
        values.childStationIds = values.childStationIds.split(',');
      } else if (values.childStationIds) {
        values.childStationIds = [values.childStationIds];
      }

      /*await basWorkflowStationSaveOrUpdate(values).then((data) => {
        values.id = data;
      });*/

      closeModal();
      emit('success', values);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
