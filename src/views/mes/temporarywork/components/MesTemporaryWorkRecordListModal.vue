<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'操作记录'" :width="1200">
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" name="MesTemporaryWorkRecordList" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { recordColumns } from '../MesTemporaryWork.data';
  import { recordList, getRecordExportUrl } from '../MesTemporaryWork.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  // 任务ID
  const temporaryWorkId = ref<string>();

  const checkedKeys = ref<Array<string | number>>([]);

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '操作记录',
      api: (params) => {
        params['temporaryWorkId'] = unref(temporaryWorkId);
        return recordList(params);
      },
      columns: recordColumns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      pagination: true,
      useSearchForm: false,
      showActionColumn: false,
    },
    exportConfig: {
      name: '临时任务操作记录',
      url: getRecordExportUrl,
      params: { temporaryWorkId: temporaryWorkId },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    if (!!data) {
      temporaryWorkId.value = data.id;

      setModalProps({ confirmLoading: false, destroyOnClose: true, showCancelBtn: true, showOkBtn: false, defaultFullscreen: true });
    }
  });
</script>
