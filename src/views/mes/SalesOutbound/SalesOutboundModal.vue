<script setup lang="ts" name="mo-SalesOutboundModel">
import { computed, reactive, ref } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, useForm } from '@/components/Form';
import { JVxeTable } from '@/components/jeecg/JVxeTable';
import { useMessage } from '@/hooks/web/useMessage';
import { getTenantId } from '/@/utils/auth';
import { getBillByBillNo, getBillDetailList } from './SalesOutbound.api';
import { getFormSchema, mesSalesOutboundTaskJVxeColumns } from './SalesOutbound.data';

const title = computed(() => '销售发货详情');
const tenantId = getTenantId();
const { createMessage } = useMessage();

const [registerForm, { resetFields, setFieldsValue }] = useForm({
  labelWidth: 160,
  schemas: getFormSchema(),
  showActionButtonGroup: false,
  baseColProps: { span: 8 },
  disabled: true,
});

const activeKey = ref('mesSalesOutboundTask');
const mesSalesOutboundTaskTable = reactive({
  loading: false,
  dataSource: [],
  columns: mesSalesOutboundTaskJVxeColumns,
});

const [registerModalInner, { setModalProps, closeModal }] = useModalInner(async (data) => {
  await resetFields();
  activeKey.value = 'mesSalesOutboundTask';
  mesSalesOutboundTaskTable.dataSource = [];

  setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: false, defaultFullscreen: true });

  const billNo = data?.record?.billNo;
  if (!billNo) {
    createMessage.warning('未获取到发货通知单号');
    closeModal();
    return;
  }

  try {
    setModalProps({ confirmLoading: true });
    const header = await getBillByBillNo({ billNo, tenantId, pageNo: 1, pageSize: 1 });
    const headRecord = header?.records?.[0];
    if (!headRecord) {
      createMessage.warning('未查询到发货通知单主数据');
      return;
    }

    setFieldsValue(headRecord);

    const detailParams: Record<string, any> = {
      billId: headRecord.id,
      billNo,
      tenantId,
      pageNo: 1,
      pageSize: 999,
    };

    mesSalesOutboundTaskTable.loading = true;
    const detail = await getBillDetailList(detailParams);
    const detailRecords = Array.isArray(detail?.records) ? detail.records : detail;
    mesSalesOutboundTaskTable.dataSource = detailRecords ?? [];
  } catch (error) {
    console.error('加载发货通知单明细失败', error);
    createMessage.error('加载发货通知单明细失败');
  } finally {
    mesSalesOutboundTaskTable.loading = false;
    setModalProps({ confirmLoading: false });
  }
});

function handleCancel() {
  closeModal();
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModalInner"
    :title="title"
    destroyOnClose
    :width="960"
    :showFullScreen="true"
    @cancel="handleCancel"
  >
    <BasicForm @register="registerForm" />
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="发货物料明细" key="mesSalesOutboundTask" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          :loading="mesSalesOutboundTaskTable.loading"
          :columns="mesSalesOutboundTaskTable.columns"
          :dataSource="mesSalesOutboundTaskTable.dataSource"
          :max-height="450"
          :rowNumber="true"
          :sortKey="''"
          :rowSelection="false"
          :disabled="true"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<style scoped lang="less"></style>
