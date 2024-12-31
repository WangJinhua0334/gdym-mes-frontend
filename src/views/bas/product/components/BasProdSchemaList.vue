<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
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
  </div>
</template>

<script lang="ts" name="product-basProdSchema" setup>
  import { reactive } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { prodSchemaColumns, prodSchemaFormSchema } from '../BasProduct.data';
  import { listProduct, deleteBatchSchema } from '../BasProduct.api';

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
      title: '关联检验方案列表',
      api: (params) => {
        params.prodId = props.prodId;
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
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
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
