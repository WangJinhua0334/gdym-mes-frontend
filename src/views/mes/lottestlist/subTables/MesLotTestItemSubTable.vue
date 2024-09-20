<template>
  <div>
    <!--引用表格-->
    <BasicTable
      bordered
      size="middle"
      :loading="loading"
      rowKey="id"
      :canResize="true"
      :columns="testItemColumns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #switchSlot="{ text }">
        <a-switch disabled="true" checkedValue="Y" checked-children="OK" unCheckedValue="N" un-checked-children="NG" :checked="text" />
      </template>
      <template #fileSlot="{ record, text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="handleDetail(record)"
          >查看</a-button
        >
      </template>
    </BasicTable>

    <AttachmentsDrawer @register="registerDrawer" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import AttachmentsDrawer from '../components/AttachmentsDrawer.vue';
  import { testItemColumns } from '../MesLotTest.data';
  import { listTestItemById } from '../MesLotTest.api';

  const [registerDrawer, { openDrawer }] = useDrawer();

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
    listTestItemById({ id })
      .then((res) => {
        dataSource.value = res;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record: record,
    });
  }
</script>
