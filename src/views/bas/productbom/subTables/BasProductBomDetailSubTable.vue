<template>
  <!--引用表格-->
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" @click="handleCreate" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_product_bom_detail:add'"> 新增</a-button>
      <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button> -->
      <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_product_bom_detail:deleteBatch')">
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

  <BasProductBomDetailModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import BasProductBomDetailModal from '../components/BasProductBomDetailModal.vue';
  import { basProductBomDetailColumns, basProductBomDetailSearchFormSchema } from '../BasProductBom.data';
  import {
    basProductBomDetailList,
    basProductBomDetailDelete,
    basProductBomDetailDeleteBatch,
    //basProductBomDetailExportXlsUrl,
    //basProductBomDetailImportUrl,
  } from '../BasProductBom.api';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const props = defineProps({
    bomId: {
      type: String,
      default: '',
    },
  });

  //提示弹窗
  const $message = useMessage();

  //弹窗model
  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      isTreeTable: true,
      rowSelection: {
        type: 'checkbox',
        getCheckboxProps(record: Recordable) {
          // Demo: 第一行（id为0）的选择框禁用
          if (record.id === '0') {
            return { disabled: true };
          } else {
            return { disabled: false };
          }
        },
      },
      api: (parameters) => {
        if (props.bomId && props.bomId != '') {
          parameters['bomId'] = props.bomId;
        }
        return basProductBomDetailList(parameters);
      },
      columns: basProductBomDetailColumns,
      canResize: true,
      useSearchForm: true,
      formConfig: {
        schemas: basProductBomDetailSearchFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
      beforeFetch: function (params) {
        if (params['column'] === 'createTime') {
          return Object.assign(params, { column: 'sequence', order: 'asc' });
        } else {
          return params;
        }
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
    },
    /*
    exportConfig: {
      name: 'bom明细',
      url: basProductBomDetailExportXlsUrl,
      params: {
        bomId: mainId,
      },
    },
    importConfig: {
      url: () => {
        return basProductBomDetailImportUrl + '/' + unref(mainId);
      },
    },
    */
  });

  //注册table数据
  const [registerTable, { reload, getDataSource }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(
    () => props.bomId,
    () => {
      if (props.bomId && props.bomId != '') {
        reload();
      }
    }
  );
  /**
   * 新增事件
   */
  function handleCreate() {
    if (isEmpty(unref(props.bomId))) {
      $message.createMessage.warning('请选择一个主表信息');
      return;
    }
    openModal(true, {
      bomId: unref(props.bomId),
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 添加子级物料
   */
  async function handleAddSub(record: Recordable) {
    record.parentProdName = record.prodName;
    openModal(true, {
      record,
      bomId: unref(props.bomId),
      isAddSub: true,
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    if (record.parentId) {
      let itemRecord = findParentById(getDataSource(), record.parentId);
      record.parentProdName = itemRecord.prodName;
    }
    console.log(unref(getDataSource()));
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  function findParentById(products, parentId) {
    for (const product of products) {
      if (product.id === parentId) {
        return product;
      }
      if (product.children) {
        const parent = findParentById(product.children, parentId);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await basProductBomDetailDelete({ id: record.id }, handleSuccess);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await basProductBomDetailDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
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
        label: '添加子级',
        onClick: handleAddSub.bind(null, record),
        auth: 'bas:bas_product_bom_detail:addSub',
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_product_bom_detail:edit',
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'bas:bas_product_bom_detail:delete',
      },
    ];
  }
</script>
