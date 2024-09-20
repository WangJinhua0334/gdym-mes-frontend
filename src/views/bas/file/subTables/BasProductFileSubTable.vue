<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_file:addBasProductFile'">
          分配产品
        </a-button>
        <!--<a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
           <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_file:deleteBatchBasProductFile')">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>

    <!--物料选择弹窗-->
    <JPopupOnlReportCustomModal
      @register="registerProdSelectModal"
      :title="'物料选择'"
      :code="prodSelectModalProps.code"
      :groupId="prodSelectModalProps.uniqGroupId"
      :multi="prodSelectModalProps.multi"
      :sorter="prodSelectModalProps.sorter"
      :param="prodSelectModalProps.params"
      :columns="prodSelectModalProps.columns"
      :queryInfo="prodSelectModalProps.queryInfo"
      :method="prodSelectModalProps.method"
      :url="prodSelectModalProps.url"
      :options="prodSelectModalProps.options"
      destroyOnClose
      @ok="prodSelectCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { basProductFileColumns } from '../BasFile.data';
  import {
    basProductFileList,
    basProductFileDelete,
    basProductFileDeleteBatch,
    basProductFileExportXlsUrl,
    basProductFileImportUrl,
    basProductFileSaveOrUpdate,
  } from '../BasFile.api';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { buildUUID } from '/@/utils/uuid';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const props = defineProps({
    fileId: {
      type: String,
      default: '',
    },
  });

  //接收主表id
  const mainId = computed(() => props.fileId);

  //提示弹窗
  const $message = useMessage();

  const prodSelectModalCode = computed(() => buildUUID());
  /**物料选择弹出配置 */
  const prodSelectModalProps = {
    code: unref(prodSelectModalCode),
    uniqGroupId: 'uniq_' + unref(prodSelectModalCode),
    multi: true,
    sorter: '',
    params: { status: 'enable', isKey: 'Y' },
    columns: [
      {
        title: '编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '版本',
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '规格',
        align: 'center',
        dataIndex: 'specification',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '名称',
        mode: 'single',
        view: 'string',
      },
    ],
    method: 'get',
    url: '/product/basProduct/list',
    options: [],
  };

  /**注册物料选择弹窗 */
  const [registerProdSelectModal, { openModal: openProdSelectModal }] = useModal();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.fileId && props.fileId != '') {
          parameters['fileId'] = props.fileId;
        }

        return basProductFileList(parameters);
      },
      columns: basProductFileColumns,
      showIndexColumn: true,
      canResize: true,
      useSearchForm: false,
      actionColumn: {
        width: 180,
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '产品文件',
      url: basProductFileExportXlsUrl,
      params: {
        fileId: props.fileId,
      },
    },
    importConfig: {
      url: () => {
        return basProductFileImportUrl + '/' + unref(props.fileId);
      },
    },
  });

  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /*watch(mainId, () => {
    searchInfo['fileId'] = unref(mainId);
    reload();
  });*/
  watch(
    () => props.fileId,
    () => {
      if (props.fileId && props.fileId != '') {
        reload();
      }
    }
  );

  /**
   * 新增事件
   */
  function handleCreate() {
    if (isEmpty(unref(mainId))) {
      $message.createMessage.warning('请选择一个需要操作的文件');
      return;
    }

    openProdSelectModal(true);
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await basProductFileDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await basProductFileDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**物料选择回调 */
  async function prodSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const prodIds: any[] = [];
      for (let row of rows) {
        prodIds.push(row.id);
      }

      try {
        await basProductFileSaveOrUpdate({ fileId: unref(mainId), prodId: prodIds.join(',') }, false).then(() => {
          handleSuccess();
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          auth: 'bas:bas_file:deleteBasProductFile',
        },
      },
    ];
  }
</script>
