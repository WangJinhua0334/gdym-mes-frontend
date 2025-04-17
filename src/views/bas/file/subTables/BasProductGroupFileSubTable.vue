<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_file:addBasProductGroupFile'">
          分配产品组
        </a-button>
        <!--<a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
           <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_file:deleteBasProductGroupFile')">
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
      @register="registerProdGrSelectModal"
      :title="'物料组选择'"
      :code="prodGrSelectModalProps.code"
      :groupId="prodGrSelectModalProps.uniqGroupId"
      :multi="prodGrSelectModalProps.multi"
      :sorter="prodGrSelectModalProps.sorter"
      :param="prodGrSelectModalProps.params"
      :columns="prodGrSelectModalProps.columns"
      :queryInfo="prodGrSelectModalProps.queryInfo"
      :method="prodGrSelectModalProps.method"
      :url="prodGrSelectModalProps.url"
      :options="prodGrSelectModalProps.options"
      destroyOnClose
      @ok="prodGrSelectCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { basProductGroupFileColumns } from '../BasFile.data';
  import {
    basProductGroupFileList,
    basProductGroupFileDelete,
    basProductGroupFileDeleteBatch,
    basProductGroupFileExportXlsUrl,
    basProductGroupFileImportUrl,
    basProductGroupFileSaveOrUpdate,
    checkFileRecord,
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

  const prodGrSelectModalCode = computed(() => buildUUID());
  /**物料组选择弹出配置 */
  const prodGrSelectModalProps = {
    code: unref(prodGrSelectModalCode),
    uniqGroupId: 'uniq_' + unref(prodGrSelectModalCode),
    multi: true,
    sorter: '',
    params: { column: 'code', order: 'asc' },
    columns: [
      {
        title: '编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '描述',
        align: 'center',
        dataIndex: 'description',
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
    url: '/productgroup/basProductGroup/list',
    options: [],
  };

  /**注册物料组选择弹窗 */
  const [registerProdGrSelectModal, { openModal: openProdGrSelectModal }] = useModal();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.fileId && props.fileId != '') {
          parameters['fileId'] = props.fileId;
        }

        return basProductGroupFileList(parameters);
      },
      columns: basProductGroupFileColumns,
      showIndexColumn: true,
      canResize: true,
      useSearchForm: false,
      actionColumn: {
        title: '操作',
        width: 180,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '产品组文件',
      url: basProductGroupFileExportXlsUrl,
      params: {
        fileId: props.fileId,
      },
    },
    importConfig: {
      url: () => {
        return basProductGroupFileImportUrl + '/' + unref(props.fileId);
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
      $message.createMessage.warning('请选择需要操作的文件');
      return;
    }

    openProdGrSelectModal(true);
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await basProductGroupFileDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await basProductGroupFileDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**物料组选择回调 */
  async function prodGrSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const prodGrIds: any[] = [];
      for (let row of rows) {
        prodGrIds.push(row.id);
      }
      try {
        await checkFileRecord({ id: unref(mainId), category: 'prodGroup', prodGroupIds: prodGrIds.join(',') }).then((data) => {
          if (data == true) {
            //存在其他文件
            $message.createConfirm({
              iconType: 'warning',
              title: '新版本文件关联确认',
              content: '该文件存在其他版本的文件已经关联产品组信息，是否替换？',
              okText: '是',
              cancelText: '否',
              onOk: () => {
                basProductGroupFileSaveOrUpdate({ fileId: unref(mainId), prodGrId: prodGrIds.join(','), isDeleteOldStr: 'Y' }, false).then(() => {
                  handleSuccess();
                });
              },
              onCancel: () => {
                basProductGroupFileSaveOrUpdate({ fileId: unref(mainId), prodGrId: prodGrIds.join(','), isDeleteOldStr: 'N' }, false).then(() => {
                  handleSuccess();
                });
              },
            });
          } else {
            basProductGroupFileSaveOrUpdate({ fileId: unref(mainId), prodGrId: prodGrIds.join(','), isDeleteOldStr: 'N' }, false).then(() => {
              handleSuccess();
            });
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
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
        },
      },
    ];
  }
</script>
