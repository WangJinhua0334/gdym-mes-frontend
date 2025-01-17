<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="变更单子表" key="mesMoChangeDetail" forceRender>
            <mesMoChangeDetailSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_mo_change:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'mes:mes_mo_change:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!-- 高级查询 -->
        <!-- <super-query :config="superQueryConfig" @search="handleSuperQuery" /> -->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesMoChangeModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="mes-mesMoChange" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import MesMoChangeModal from './components/MesMoChangeModal.vue';
  import MesMoChangeDetailSubTable from './subTables/MesMoChangeDetailSubTable.vue';
  import { columns, searchFormSchema, superQuerySchema } from './MesMoChange.data';
  import { list, deleteOne, getExportUrl, submit, audit } from './MesMoChange.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  const queryParam = reactive<any>({});
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const userStore = useUserStore();
  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '工单BOM变更单',
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
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
    exportConfig: {
      name: '工单BOM变更单',
      url: getExportUrl,
      params: queryParam,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // // 高级查询配置
  // const superQueryConfig = reactive(superQuerySchema);

  // /**
  //  * 高级查询事件
  //  */
  // function handleSuperQuery(params) {
  //   Object.keys(params).map((k) => {
  //     queryParam[k] = params[k];
  //   });
  //   reload();
  // }

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
   * 提交
   */
  async function handleSubmit(record) {
    await submit({ id: record.id }, handleSuccess);
  }
  /**
   * 同意
   */
  async function handleYes(record) {
    await audit({ id: record.id, isYes: 'Y' }, handleSuccess);
  }
  /**
   * 拒绝
   */
  async function handleNo(record) {
    await audit({ id: record.id, isYes: 'N'}, handleSuccess);
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
    let arr: any[] = [];
    if (record.status == 'create') {
      arr.push(
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          auth: 'mes:mes_mo_change:edit',
        },
        {
          label: '提交',
          popConfirm: {
            title: '是否确认提交',
            confirm: handleSubmit.bind(null, record),
            placement: 'topLeft',
            getPopupContainer: (node) => document.body,
          },
          auth: 'mes:mes_mo_change:submit',
        }
      );
    } else if (record.status == 'submit') {
      arr.push(
        {
          label: '同意',
          popConfirm: {
            title: '是否确认同意',
            confirm: handleYes.bind(null, record),
            placement: 'topLeft',
            getPopupContainer: (node) => document.body,
          },
          auth: 'mes:mes_mo_change:audit',
        },
        {
          label: '拒绝',
          popConfirm: {
            title: '是否确认拒绝',
            confirm: handleNo.bind(null, record),
            placement: 'topLeft',
            getPopupContainer: (node) => document.body,
          },
          auth: 'mes:mes_mo_change:audit',
        }
      );
    }
    return arr;
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    let arr: any[] = [];
    if (record.status == 'create') {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
          getPopupContainer: (node) => document.body,
        },
        auth: 'mes:mes_mo_change:delete',
      });
    }
    arr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    return arr;
  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
