<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>

      <template #progressData="{ record }">
        <Progress :percent="Math.floor((Number(record.completedQty ? record.completedQty : 0) / Number(record.qty)) * 100)" :width="80" />
      </template>
    </BasicTable>

    <!-- 甘特图区域-->
    <MesMoPlanGanttList @register="registerPlanGanttModal" />

    <!-- 查看区域-->
    <!-- <MesMoView @register="registerMesMoViewModal"></MesMoView> -->
    <!-- 下发明细区域-->
    <!-- <MesMoPlanListView @register="registerMesMoPlanListModal"></MesMoPlanListView> -->
    <!-- bom明细区域-->
    <!-- <MesMoPlanBomView @register="registerMesMoBomListModal"></MesMoPlanBomView> -->
  </div>
</template>

<script lang="ts" name="mo-mesMoProgressList" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  // import MesMoPlanListView from '../view/plan/MesMoPlanListView.vue';
  // import MesMoPlanBomView from '../view/bom/MesMoPlanBomView.vue';
  import MesMoPlanGanttList from './gantt/MesMoPlanGanttList.vue';

  import { Progress } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { columns, searchFormSchema } from './MesMoProgressList.data';
  import { list } from './MesMoProgressList.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const $message = useMessage();

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

  const [registerMesMoViewModal, { openModal: openViewModal }] = useModal();

  const [registerMesMoPlanListModal, { openModal: openPlanListViewModal }] = useModal();

  const [registerMesMoBomListModal, { openModal: openBomListViewModal }] = useModal();

  const [registerPlanGanttModal, { openModal: openGanttModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '生产工单',
      api: list,
      columns,
      canResize: true,
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        align: 'center',
        fixed: 'right',
      },
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
   * 详情
   */
  function handleDetail(record: Recordable) {
    openViewModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 下发明细
   */
  function handlePlanDetail(record: Recordable) {
    openPlanListViewModal(true, {
      moRecord: record,
      isUpdate: true,
      showFooter: false,
    });
  }
  function handlePlanGantt(record: Recordable) {
    openGanttModal(true, {
      moId: record.id,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * bom明细
   */
  function handleBomDetail(record: Recordable) {
    openBomListViewModal(true, {
      moRecord: record,
      isUpdate: true,
      showFooter: false,
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
    let arr = getActionArray(record);
    return arr.slice(0, 1);

    return arr;
  }

  function getDropDownAction(record) {
    let arr = getActionArray(record);

    return arr.slice(1);
  }

  /**
   * 下拉操作栏
   */
  function getActionArray(record) {
    let actionArr: any[] = [];
    if (record.status != 'wait_approveing' && record.status != 'MO_STATUS_APPROVING') {
      actionArr.push({
        label: '甘特图',
        onClick: handlePlanGantt.bind(null, record),
      });
      /*actionArr.push({
        label: '下发明细',
        onClick: handlePlanDetail.bind(null, record),
      });*/
    }

    /*actionArr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });*/

    return actionArr;
  }
</script>

<style scoped></style>
