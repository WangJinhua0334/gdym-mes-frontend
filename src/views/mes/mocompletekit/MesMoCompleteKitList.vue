<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleDistribute" preIcon="ant-design:plus-outlined" v-auth="'mes:mes_mo_complete_kit:distribute'">
          齐套检查
        </a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_mo_complete_kit:exportXls'">
          导出
        </a-button>
        <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item v-if="hasPermission('mes:mes_mo_complete_kit:deleteBatch')" key="2" @click="batchHandleDelete">
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
    </BasicTable>
    <!-- 齐套检查表单区域 -->
    <DistributeModal @register="registerDistributeModal" @success="handleSuccess" />
    <!-- 编辑/详情表单区域 -->
    <MesMoCompleteKitModal @register="registerEditModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="mocompletekit-mesMoCompleteKit" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import DistributeModal from './components/DistributeModal.vue';
  import MesMoCompleteKitModal from './components/MesMoCompleteKitModal.vue';
  import { columns, getSearchFormSchema } from './MesMoCompleteKit.data';
  import { list, deleteOne, batchDelete, getExportUrl } from './MesMoCompleteKit.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();

  const $message = useMessage();

  //注册model
  const [registerDistributeModal, { openModal: openDistributeModal }] = useModal();
  const [registerEditModal, { openModal: openEditModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工单物料齐套',
      api: list,
      columns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: getSearchFormSchema(true),
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 160,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '工单物料齐套',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleDistribute() {
    openDistributeModal(true, { showFooter: true });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record) {
    openEditModal(true, {
      record,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record) {
    openEditModal(true, {
      record,
      showFooter: false,
    });
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
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待删除的记录!');
      return;
    }

    await batchDelete({ ids: unref(selectedRowKeys) }, handleSuccess);
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
    const arr: any[] = [];

    if (record.issuedQty <= 0 || record.qty > record.issuedQty) {
      arr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes:mes_mo_complete_kit:edit',
      });
    }

    if (record.issuedQty <= 0) {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          auth: 'mes:mes_mo_complete_kit:delete',
        },
      });
    }

    arr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    return arr;
  }
</script>

<style scoped></style>
