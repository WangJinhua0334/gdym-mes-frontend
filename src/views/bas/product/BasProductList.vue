<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined" v-auth="'bas:bas_product:add'"> 新增</a-button>
        <a-button type="primary" @click="handleGetFromK3Cloud" preIcon="ant-design:import-outlined" v-auth="'bas:bas_customer:edit'">同步金蝶物料信息</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'bas:bas_product:exportXls'"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls" v-auth="'bas:bas_product:importExcel'">
          导入
        </j-upload-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete" v-if="hasPermission('bas:bas_product:deleteBatch')">
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
      <template #listSlot="{ record }">
        <a @click="handleSubList(record)">
          <span style="font-size: 12px; font-style: italic">{{ '[' + record.code + ']关联的检验方案' }}</span>
        </a>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <BasProductModal @register="registerModal" @success="handleSuccess" />
    <!-- 工序列表 -->
    <BasicModal
      @register="registerSubModal"
      :defaultFullscreen="true"
      :title="subTitle"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'关闭'"
      destroyOnClose
    >
      <BasProdSchemaList :prodId="prodId" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="product-basProduct" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import BasProductModal from './components/BasProductModal.vue';
  import BasProdSchemaList from './components/BasProdSchemaList.vue';
  import { columns, searchFormSchema } from './BasProduct.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './BasProduct.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  import { useUserStore } from "@/store/modules/user";
  import {defHttp} from "@/utils/http/axios";
  import { useMessage } from '/@/hooks/web/useMessage';


  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册model
  const [registerSubModal, { openModal: openSubModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '物料',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '物料',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  // 当前选中行
  const currentRow = ref<any>(null);
  // 当前行ID
  const prodId = computed(() => (unref(currentRow) ? unref(currentRow).id : ''));
  // 当前行工艺标题
  const subTitle = computed(() => {
    return '检验方案：' + (unref(currentRow) ? unref(currentRow).code + '  ' + unref(currentRow).version : '') + ' 的关联产品列表';
  });

  /**
   * 关联检验方案列表
   */
  function handleSubList(record: Recordable) {
    currentRow.value = record;
    openSubModal(true, {
      record,
    });
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
   * 同步金蝶信息
   */
  function handleGetFromK3Cloud() {
    const { createMessage } = useMessage();

    // 显示加载提示
    // const hide = createMessage.loading('正在同步金蝶客户信息...', 0);

    // 调用接口
    defHttp.get({
      url: '/etl/preDeliveryBill/importAllPreDeliveryBills',
      params: {
        tenantId: useUserStore().getTenant,
      }
      // hide();
    });
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
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_product:edit',
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
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'bas:bas_product:delete',
      },
    ];
  }
</script>

<style scoped></style>
