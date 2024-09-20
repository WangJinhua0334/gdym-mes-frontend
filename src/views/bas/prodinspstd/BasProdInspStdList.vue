<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_prod_insp_std:add'"> 新增</a-button>
        <a-button type="primary" @click="handleInspStdSelect" v-auth="'bas:bas_prod_insp_std:importOther'">检验标准导入</a-button>
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_prod_insp_std:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="handleImport" v-auth="'bas:bas_prod_insp_std:importExcel'"
          >导入</j-upload-button
        > -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_prod_insp_std:deleteBatch')">
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
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>

      <!--检验项目列表插槽-->
      <template #stdListSlot="{ record }">
        <a @click="handleViewSub(record)">查看</a>
      </template>

      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>

    <!-- 选择通用检验标准区域-->
    <BasInspStdSelectModal @register="registerStdSelectModal" />

    <!-- 表单区域 -->
    <BasProdInspStdModal @register="registerModal" @success="handleSuccess" />

    <!-- 检验项目列表区域 -->
    <BasProdInspStdItemListModal @register="registerStdItemListModal" />
    <!-- 检验项目表单区域 -->
    <BasProdInspStdItemModal @register="registerStdItemModal" />
  </div>
</template>

<script lang="ts" name="prodinspstd-basProdInspStd" setup>
  import { ref, unref, watch, inject } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import BasProdInspStdModal from './components/BasProdInspStdModal.vue';
  import BasProdInspStdItemModal from './components/BasProdInspStdItemModal.vue';
  import BasProdInspStdItemListModal from './components/BasProdInspStdItemListModal.vue';
  import BasInspStdSelectModal from './components/BasInspStdSelectModal.vue';
  import { columns, searchFormSchema } from './BasProdInspStd.data';
  import { list, deleteOne, batchDelete, importFromInspStd, getImportUrl, getExportUrl } from './BasProdInspStd.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });
  //提示弹窗
  const $message = useMessage();

  //注册model
  const [registerModal, { openModal }] = useModal();

  const [registerStdItemModal, { openModal: openStdItemModal }] = useModal();

  const [registerStdItemListModal, { openModal: openStdItemListModal }] = useModal();

  const [registerStdSelectModal, { openModal: openInspStdSelectModal }] = useModal();

  //接收主表id
  // const schemaId = inject('schemaId') || ref();

  // watch(schemaId, () => {
  //   if (unref(schemaId)) {
  //     reload();
  //   } else {
  //     setTableData([]);
  //   }
  // });
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '料号检验标准',
      api: (params) => {
        if (props.id && props.id != '') {
          params['schemaId'] = props.id;
        }
        //params['schemaId'] = unref(schemaId);
        return list(params);
      },
      columns,
      canResize: true,
      useSearchForm: true,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: true,
      actionColumn: {
        width: 160,
        fixed: 'right',
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    exportConfig: {
      name: '料号检验标准',
      url: getExportUrl,
      params: {
        schemaId: props.id,
      },
    },
    importConfig: {
      url: getImportUrl + '/' + unref(props.id),
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(
    () => props.id,
    () => {
      console.log('props.id', props.id);
      if (props.id && props.id != '') {
        reload();
      }
    }
  );
  /**导入 */
  function handleImport(v) {
    if (!unref(props.id)) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }
    onImportXls(v);
  }

  /**检验标准导入 */
  function handleInspStdSelect() {
    if (unref(props.id)) {
      openInspStdSelectModal(true, {
        callBack: function (values) {
          importFromInspStd({ schemaId: unref(props.id), stdIds: values }, handleSuccess);
        },
      });
    } else {
      $message.createMessage.warning('请选择检验方案');
    }
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    if (unref(props.id)) {
      openModal(true, {
        isUpdate: false,
        schemaId: unref(props.id),
        showFooter: true,
      });
    } else {
      $message.createMessage.warning('请选择检验方案');
    }
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }

  /**添加检验项目 */
  function handleAddSub(record: Recordable) {
    openStdItemModal(true, {
      record,
      isUpdate: false,
      showFooter: true,
      inspStdId: record.id,
    });
  }

  /**查看检验项目 */
  function handleViewSub(record: Recordable) {
    openStdItemListModal(true, { record });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
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
        label: '添加检验项目',
        onClick: handleAddSub.bind(null, record),
        auth: 'bas:bas_prod_insp_std_item:add',
      },
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_prod_insp_std:edit',
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'bas:bas_prod_insp_std:delete',
      },
    ];
  }
</script>

<style scoped></style>
