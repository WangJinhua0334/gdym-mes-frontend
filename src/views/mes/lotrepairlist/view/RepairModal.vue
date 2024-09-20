<template>
  <BasicModal v-bind="$attrs" @register="registerRepairViewModal" destroyOnClose :title="'详情'" :width="896">
    <BasicForm @register="registerRepairForm" :showFooter="false" />
    <div v-for="item in defects" :key="item.id">
      <hr />
      <br />
      <DefectModal :defect="item" @addRefs="addRefs" />
    </div>
    <hr />
    <br />
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="物料绑定" key="prodBind" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="prodBind"
          :loading="prodBindTable.loading"
          :columns="prodBindTable.columns"
          :dataSource="prodBindTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, watch, inject, nextTick, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, prodBindJVxeColumns } from './RepairModal.data';
  import { saveOrUpdate, queryBySn, queryMesLotRepairDetailByRepairId, itembindsListByLotSn } from './RepairModal.api';
  import DefectModal from './defect/DefectModal.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const defects = ref([]);

  const repairInfo = ref();

  const activeKey = ref('prodBind');
  const prodBind = ref();

  const prodBindTable = reactive({
    loading: false,
    dataSource: [],
    columns: prodBindJVxeColumns,
  });

  const itemRefs = [] as any;

  function addRefs(form) {
    itemRefs.push(form);
  }

  watch(
    () => repairInfo.value,
    () => {
      if (unref(repairInfo)) {
        setFieldsValue({ ...unref(repairInfo) });
        queryMesLotRepairDetailByRepairId({ id: unref(repairInfo).id }).then((res) => {
          if (res && res.length > 0) {
            defects.value = res;
          }
        });
        itembindsListByLotSn({ lotId: unref(unref(repairInfo)).lotId }).then((res) => {
          if (res && res.length > 0) {
            prodBind.value.addRows(res);
          }
        });
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerRepairForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });

  //表单赋值
  const [registerRepairViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    defects.value = [];
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
    setFieldsValue({ ...data.record });
    repairInfo.value = data.record;
    setProps({ disabled: true });
  });
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
  .submit-div {
    text-align: right;
  }
</style>
