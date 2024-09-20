<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
  </div>
  <!--文件在线预览-->
  <FilePreviewModal @register="registerFilePreviewModal" />
</template>

<script lang="ts" name="fileview-WkpFileViewList" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './SopFileViewList.data';
  import { list, getOnlinePreviewUrl } from './SopFileViewList.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import FilePreviewModal from '/@/views/bas/file/components/FilePreviewModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  // Emits声明
  const emit = defineEmits(['close']);

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal: openViewModal }] = useModal();
  /*注册文件预览弹窗*/
  const [registerFilePreviewModal, { openModal: openFilePreviewModal }] = useModal();

  const props = defineProps({
    wfsId: {
      type: String,
      default: '',
    },
  });
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
      api: (params) => {
        params['wfsId'] = props.wfsId;
        return list(params);
      },
      columns,
      canResize: false,
      useSearchForm: false,
      showTableSetting: false,
      immediate: false,
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  defineExpose({ reload });
  /**
   * 编辑事件
   */
  async function handOnlineView(record: Recordable) {
    let params = {};
    params['fileUrl'] = record.url;
    getOnlinePreviewUrl(params).then((res) => {
      if (res && res.success) {
        //window.open(res.result);
        //openFilePreviewModal(true, { data: res.result });
        sessionStorage.setItem('previewUrl', unref(res.result));
        go(`/file/Preview`);
        emit('close');
      }
    });
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '在线预览',
        onClick: handOnlineView.bind(null, record),
      },
    ];
  }
</script>

<style scoped></style>
