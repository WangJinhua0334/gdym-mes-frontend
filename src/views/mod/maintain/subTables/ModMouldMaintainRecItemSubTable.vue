<template>
  <div>
    <!--引用表格-->
    <BasicTable
      bordered
      size="middle"
      :loading="loading"
      rowKey="id"
      :canResize="false"
      :columns="modMouldMaintainRecItemColumns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { modMouldMaintainRecItemColumns } from '../ModMouldMaintainPlan.data';
  import { modMouldMaintainRecItemList } from '../ModMouldMaintainPlan.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const loading = ref(false);
  const dataSource = ref([]);

  watchEffect(() => {
    props.id && loadData(props.id);
  });

  function loadData(id) {
    dataSource.value = [];
    loading.value = true;
    modMouldMaintainRecItemList({ id })
      .then((res) => {
        if (res.success) {
          dataSource.value = res.result.records;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
</script>
