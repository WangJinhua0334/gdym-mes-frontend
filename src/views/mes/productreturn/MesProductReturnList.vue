<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="生产退料明细" key="mesProductReturnDetail" forceRender>
            <MesProductReturnDetailSubTable :id="expandedRowKeys[0]" @success="handleSuccess" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'mes:mes_product_return:add'"> 新增</a-button>
        <a-button type="primary" @click="handleSubmit" preIcon="ant-design:check-outlined" v-auth="'mes:mes_product_return:submitMain'">
          提交
        </a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'mes:mes_product_return:exportXls'">
          导出
        </a-button>
        <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item v-if="hasPermission('mes:mes_product_return:deleteBatch')" key="1" @click="batchHandleDelete">
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
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesProductReturnModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="productreturn-mesProductReturn" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import MesProductReturnModal from './components/MesProductReturnModal.vue';
  import MesProductReturnDetailSubTable from './subTables/MesProductReturnDetailSubTable.vue';
  import { columns, searchFormSchema } from './MesProductReturn.data';
  import { list, deleteOne, batchDelete, submitMain, cancelMain, returnMain, revokeMain, getImportUrl, getExportUrl } from './MesProductReturn.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  const $message = useMessage();

  const { hasPermission } = usePermission();

  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '生产退料单',
      api: list,
      columns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
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
      name: '生产退料单',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }
  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record) {
    openModal(true, {
      record,
      isUpdate: true,
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

    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }

  /**
   * 提交事件
   */
  async function handleSubmit() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待提交的记录!');
      return;
    }

    await submitMain({ id: unref(selectedRowKeys).join(',') }).then(() => {
      handleSuccess();
    });
  }

  /**
   * 取消事件
   */
  async function handleCancel(record) {
    await cancelMain({ id: record.id }).then(() => {
      handleSuccess();
    });
  }

  /**
   * 退料
   */
  async function handleReturn(record) {
    await returnMain({ id: record.id }).then(() => {
      handleSuccess();
    });
  }

  /**
   * 撤回
   */
  async function handleRevoke(record) {
    await revokeMain({ id: record.id }).then(() => {
      handleSuccess();
    });
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

    if (record.status == 'wait_submit') {
      arr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes:mes_product_return:edit',
      });
    }

    if (record.status === 'wait_return' || record.status === 'returning') {
      arr.push({
        label: '退料',
        popConfirm: {
          title: '是否确认退料',
          confirm: handleReturn.bind(null, record),
          auth: 'mes:mes_product_return:returnMain',
        },
      });
    }

    if (record.status === 'wait_return') {
      arr.push({
        label: '取消',
        popConfirm: {
          title: '是否确认取消',
          confirm: handleCancel.bind(null, record),
          auth: 'mes:mes_product_return:cancelMain',
        },
      });
    }

    return arr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    const arr: any[] = [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];

    if (record.status === 'wait_submit') {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          auth: 'mes:mes_product_return:delete',
        },
      });
    } else if (record.status === 'returning' || record.status === 'returned') {
      arr.push({
        label: '撤回',
        popConfirm: {
          title: '是否确认撤回',
          confirm: handleRevoke.bind(null, record),
          auth: 'mes:mes_product_return:revokeMain',
        },
      });
    }

    return arr;
  }
</script>

<style scoped></style>
