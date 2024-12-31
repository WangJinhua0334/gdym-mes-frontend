<template>
  <!--引用表格-->
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle>
      <a-button type="primary" v-auth="'bas:bas_prod_insp_schema:connect'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 关联产品</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="batchHandleDelete">
              <Icon icon="ant-design:delete-outlined" />
              删除
            </a-menu-item>
          </a-menu>
        </template>
        <a-button v-auth="'bas:bas_prod_schema:deleteBatch'"
          >批量操作
          <Icon icon="mdi:chevron-down" />
        </a-button>
      </a-dropdown>
    </template>
    <!--字段回显插槽-->
    <template v-slot:bodyCell="{ column, record, index, text }"> </template>
  </BasicTable>
  <!--物料选择弹窗-->
  <JPopupOnlReportCustomModal
    @register="registerModal"
    :title="'产品选择'"
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
</template>

<script lang="ts" name="product-basProdSchema" setup>
  import { computed, reactive, unref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { prodSchemaColumns, prodSchemaFormSchema } from '../BasProdInspSchema.data';
  import { listProduct, deleteBatchSchema, connect } from '../BasProdInspSchema.api';
  import { buildUUID } from '/@/utils/uuid';
  import { useModal } from '/@/components/Modal';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';

  /**注册物料选择弹窗 */
  const [registerModal, { openModal }] = useModal();

  const props = defineProps({
    schemaId: {
      type: String,
      default: '',
    },
    prodId: {
      type: String,
      default: '',
    },
  });
  const queryParam = reactive<any>({});
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '关联产品列表',
      api: (params) => {
        params.schemaId = props.schemaId;
        return listProduct(params);
      },
      columns: prodSchemaColumns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: prodSchemaFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
  });
  const prodSelectModalCode = computed(() => buildUUID());
  /**物料选择弹出配置 */
  const prodSelectModalProps = {
    code: unref(prodSelectModalCode),
    uniqGroupId: 'uniq_' + unref(prodSelectModalCode),
    multi: true,
    sorter: '',
    params: { status: 'enable' },
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

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 关联
   */
  function handleAdd() {
    openModal(true);
  }

  /**物料选择回调 */
  async function prodSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const prodIds: any[] = [];
      for (let row of rows) {
        prodIds.push(row.id);
      }

      try {
        await connect({ id: unref(props.schemaId), ids: prodIds.join(',') }, handleSuccess);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await deleteBatchSchema({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
