<template>
  <!--引用表格-->
  <BasicTable @register="registerTable" :rowSelection="rowSelection">
    <!--插槽:table标题-->
    <template #tableTitle> </template>
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
      <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载 </a-button>
    </template>
  </BasicTable>
  <!--子表表格tab-->
  <a-tabs defaultActiveKey="1" style="padding: 10px 10px 0 10px">
    <a-tab-pane tab="工序动作" key="1">
      <BasWfsActionList />
    </a-tab-pane>
    <a-tab-pane tab="工序物料" key="2" forceRender>
      <BasWfsProductList />
    </a-tab-pane>
    <a-tab-pane tab="工位" key="3" forceRender>
      <BasWfsWorkPostList />
    </a-tab-pane>
    <a-tab-pane tab="工序SOP" key="4" forceRender>
      <BasWfsSopList />
    </a-tab-pane>
    <a-tab-pane tab="工序资源" key="5" forceRender>
      <BasWfsResourceList />
    </a-tab-pane>
    <a-tab-pane tab="工序调试项" key="6" forceRender>
      <BasWfsTestItemList />
    </a-tab-pane>
  </a-tabs>
  <BasWorkflowStationModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { ref, computed, unref, inject, watch, provide } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import BasWorkflowStationModal from './components/BasWorkflowStationModal.vue';
  import BasWfsActionList from './BasWfsActionList.vue';
  import BasWfsProductList from './BasWfsProductList.vue';
  import BasWfsWorkPostList from './BasWfsWorkPostList.vue';
  import BasWfsSopList from './BasWfsSopList.vue';
  import BasWfsResourceList from './BasWfsResourceList.vue';
  import BasWfsTestItemList from './BasWfsTestItemList.vue';
  import { basWorkflowStationList } from './BasWorkflowStation.api';
  import { basWorkflowStationColumns, basWorkflowStationSearchFormSchema, workflowId, prodId } from './BasWorkflowStation.data';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const props = defineProps({
    workflowId: {
      type: String,
      default: '',
    },
    prodId: {
      type: String,
      default: '',
    },
  });

  //弹窗model
  const [registerModal, { openModal }] = useModal();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.workflowId && props.workflowId != '') {
          parameters['workflowId'] = props.workflowId;
        }

        return basWorkflowStationList(parameters);
      },
      columns: basWorkflowStationColumns,
      canResize: true,
      size: 'small',
      rowSelection: { type: 'radio' },
      formConfig: {
        schemas: basWorkflowStationSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
        // labelWidth: '30%',
        // baseColProps: { xxl: 8 },
        // rowProps: { gutter: 8, justify: 'start', wrap: true, prefixCls: '' },
        // searchButtonFloatRight: false,
        // showResetButton: false,
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
      defSort: {
        column: 'sequence,isChild',
        order: 'asc',
      },
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      },
    },
    /*exportConfig: {
      name: '工艺工序',
      url: basWorkflowStationExportXlsUrl,
      params: {
        workflowId: mainId,
      },
    },
    importConfig: {
      url: () => {
        return basWorkflowStationImportUrl + '/' + unref(mainId);
      },
    },*/
  });

  //注册table数据
  const [registerTable, { reload }, { rowSelection, selectedRows, selectedRowKeys }] = tableContext;

  watch(
    () => props.workflowId,
    (newVal) => {
      if (newVal && newVal != '') {
        workflowId.value = newVal;
        provide('workflowId', newVal);
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    () => props.prodId,
    (newVal) => {
      if (newVal && newVal != '') {
        prodId.value = newVal;
        provide('prodId', newVal);
      }
    },
    {
      immediate: true,
    }
  );

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  provide('mainId', mainId);

  const stationId = computed(() => (unref(selectedRows).length > 0 ? unref(selectedRows)[0].stationId : ''));
  provide('stationId', stationId);

  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openModal(true, {
      workflowId: workflowId.value,
      prodId: prodId.value,
      record,
      showFooter: true,
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
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'bas:bas_workflow_station:edit',
        // }, {
        //   label: '删除',
        //   popConfirm: {
        //     title: '是否确认删除',
        //     confirm: handleDelete.bind(null, record),
        //   },
      },
    ];
  }
</script>
