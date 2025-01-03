<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="工单BOM" key="mesMoBom" forceRender>
            <MesMoBomSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>

      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'mes:mes_mo:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" @click="batchHandleAudit" v-auth="'mes:mes_mo:audit'" preIcon="ant-design:check-circle-outlined"> 审核</a-button>
        <j-upload-button type="primary" v-auth="'mes:mes_mo:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls">
          导入</j-upload-button
        >
        <a-button type="primary" v-auth="'mes:mes_mo:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <!-- <a-menu-item key="1" @click="batchHandleAudit">
                <Icon icon="ant-design:check-circle-outlined" />
                审核
              </a-menu-item> -->
              <a-menu-item v-if="hasPermission('mes:mes_mo:stop')" key="2" @click="batchHandleStop">
                <Icon icon="ant-design:stop-outlined" />
                暂停
              </a-menu-item>
              <a-menu-item v-if="hasPermission('mes:mes_mo:close')" key="2" @click="batchHandleClose">
                <Icon icon="ant-design:close-circle-outlined" />
                关闭
              </a-menu-item>
              <a-menu-item v-if="hasPermission('mes:mes_mo:deleteBatch')" key="3" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            批量操作
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
      <template #progressSlot="{ record }">
        <Tooltip :title="'投入 ' + (record.inputedQty ?? 0) + ' / 产出 ' + (record.completedQty ?? 0) + ' / 报废 ' + (record.scrapedQty ?? 0)">
          <Progress
            :percent="Math.floor((Number(record.inputedQty ?? 0) / Number(record.qty)) * 100)"
            :success="{ percent: Math.floor((Number(record.completedQty ?? 0) / Number(record.qty)) * 100), strokeColor: '#52c41a' }"
            :strokeColor="'orange'"
            :showInfo="false"
            :size="'small'"
          />
        </Tooltip>
      </template>
    </BasicTable>

    <!-- 工单新增/编辑表单区域 -->
    <MesMoModal @register="registerMoModal" @success="handleSuccess" />
    <!-- 工单详情表单区域 -->
    <MesMoDetailModal @register="registerMoDetailModal" />
    <!-- 工单关闭-->
    <MesMoCloseModal @register="registerMoCloseModal" @success="handleSuccess" />
    <!-- 工单分配流转卡表单区域-->
    <MesMoCreateSnModal @register="registerMoCreateSnModal" @success="handleSuccess" />
    <!-- 工单物料齐套表单区域-->
    <MesMoCompleteKitModal @register="registerCompleteKitModal" @success="handleSuccess" />
    <!-- 工单下发任务表单区域-->
    <MesMoPlanModal @register="registerMoPlanModal" :moId="currentId" @success="handleSuccess" />

    <!-- 工单流转卡列表区域 -->
    <BasicModal
      @register="registerMoSnListModal"
      :defaultFullscreen="true"
      :title="'工单流转卡'"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'返回'"
      destroyOnClose
      ><MesMoSnList :moId="currentId" />
    </BasicModal>
    <!-- <BasicModal @register="registerMoBomListModal"><MesMoBomList /></BasicModal> -->
    <BasicModal
      @register="registerMoPlanListModal"
      :defaultFullscreen="true"
      :title="'工单生产任务'"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'返回'"
      destroyOnClose
      ><MesMoPlanList :moId="currentId"
    /></BasicModal>
  </div>
</template>

<script lang="ts" name="mo-mesMo" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { Tooltip, Progress } from 'ant-design-vue';

  import MesMoModal from './components/MesMoModal.vue';
  import MesMoDetailModal from './components/MesMoDetailModal.vue';
  import MesMoCloseModal from './components/MesMoCloseModal.vue';
  import MesMoCreateSnModal from './components/MesMoCreateSnModal.vue';
  import MesMoCompleteKitModal from '../mocompletekit/components/DistributeModal.vue';
  import MesMoPlanModal from './components/MesMoPlanModal.vue';

  import MesMoSnList from './MesMoSnList.vue';
  import MesMoPlanList from './MesMoPlanList.vue';
  import MesMoBomSubTable from './subTables/MesMoBomSubTable.vue';

  import { getColumns, searchFormSchema } from './MesMo.data';
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    audit,
    cancelAudit,
    stop,
    resume,
    open,
    moCompleteKitCheck,
    editIsRequired,
  } from './MesMo.api';

  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const $message = useMessage();

  /**是否开启齐套检查 */
  const completeKitCheck = ref(false);

  const currentId = ref('');

  //注册model
  const [registerMoModal, { openModal: openMoModal }] = useModal();
  const [registerMoDetailModal, { openModal: openMoDetailModal }] = useModal();
  const [registerMoCloseModal, { openModal: openMoCloseModal }] = useModal();
  const [registerMoCreateSnModal, { openModal: openMoCreateSnModal }] = useModal();
  const [registerCompleteKitModal, { openModal: openCompleteKitModal }] = useModal();
  const [registerMoPlanModal, { openModal: openMoPlanModal }] = useModal();

  const [registerMoSnListModal, { openModal: openMoSnListModal }] = useModal();
  const [registerMoPlanListModal, { openModal: openMoPlanListModal }] = useModal();

  /**是否开启工单齐套检查 */
  setTimeout(() => {
    moCompleteKitCheck({}).then((res) => {
      completeKitCheck.value = res;
    });
  }, 50);

  /**列表显示列 */
  const columns = computed(() => getColumns(unref(completeKitCheck)));

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '生产工单',
      api: list,
      columns: columns,
      canResize: true,
      formConfig: {
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 200,
        align: 'center',
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '生产工单',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

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
    openMoModal(true, {
      isUpdate: false,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openMoModal(true, {
      record,
      isUpdate: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openMoDetailModal(true, {
      record,
    });
  }

  /**
   * 审核事件
   */
  /*async function handleAudit(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认审核',
      content: '是否审核当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        audit({ id: record.id }, handleSuccess);
      },
    });
  }*/

  /**
   * 批量审核事件
   */
  async function batchHandleAudit() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待审核工单！');
      return;
    }

    $message.createConfirm({
      iconType: 'warning',
      title: '确认审核',
      content: '是否审核当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        audit({ id: unref(selectedRowKeys).join(',') }, handleSuccess);
      },
    });
  }

  /**
   * 弃审事件
   */
  async function handleCancelAudit(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认弃审',
      content: '是否弃审当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        cancelAudit({ id: record.id }, handleSuccess);
      },
    });
  }

  /**
   * 暂停事件
   */
  /*async function handleStop(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认暂停',
      content: '是否暂停当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        stop({ id: record.id }, handleSuccess);
      },
    });
  }*/

  /**
   * 批量暂停事件
   */
  async function batchHandleStop() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待暂停工单！');
      return;
    }

    $message.createConfirm({
      iconType: 'warning',
      title: '确认暂停',
      content: '是否暂停当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        stop({ id: unref(selectedRowKeys).join(',') }, handleSuccess);
      },
    });
  }
  /**
   * 恢复事件
   */
  async function handleResume(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认恢复',
      content: '是否恢复当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        resume({ id: record.id }, handleSuccess);
      },
    });
  }

  /**
   * 批量关闭事件
   */
  function batchHandleClose() {
    if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
      $message.createMessage.warning('请选择待关闭工单！');
      return;
    }

    openMoCloseModal(true, {
      id: unref(selectedRowKeys),
    });
  }
  /**
   * 打开事件
   */
  async function handleOpen(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认打开',
      content: '是否打开当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        open({ id: record.id }, handleSuccess);
      },
    });
  }

  /**
   * 分配工单流转卡
   */
  function handleCreateSn(record: Recordable) {
    openMoCreateSnModal(true, {
      record,
    });
  }
  /**
   * 工单流转卡明细
   */
  function handleMoSnList(record: Recordable) {
    currentId.value = record.id;
    openMoSnListModal(true, {
      record,
    });
  }
  /**
   * 齐套检查
   */
  function handleCompleteKitCheck(record: Recordable) {
    currentId.value = record.id;
    openCompleteKitModal(true, {
      moId: record.id,
    });
  }
  /**
   * 下发生产任务
   */
  function handleDispatch(record: Recordable) {
    currentId.value = record.id;
    openMoPlanModal(true, {
      record,
    });
  }
  /**
   * 下发明细
   */
  function handleMoPlanList(record: Recordable) {
    currentId.value = record.id;
    openMoPlanListModal(true, {
      record,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认删除',
      content: '是否删除当前工单',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteOne({ id: record.id }, handleSuccess);
      },
    });
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
    let arr: any[] = [];
    if (record.status == 'WaitAudit') {
      arr.push(
        {
          label: '编辑',
          onClick: handleEdit.bind(null, record),
          auth: 'mes:mes_mo:edit',
        },
        {
          label: '删除',
          onClick: handleDelete.bind(null, record),
          auth: 'mes:mes_mo:delete',
        }
      );
    } else if (
      record.status != 'WaitAudit' &&
      record.status != 'Stopped' &&
      record.status != 'ClosedInAdvance' &&
      record.status != 'Closed' &&
      record.qty > record.dispatchedQty
    ) {
      if (unref(completeKitCheck) && record.qty > record.completeKitQty) {
        arr.push({
          label: '齐套',
          onClick: handleCompleteKitCheck.bind(null, record),
          auth: 'mes:mes_mo:completeKitCheck',
        });
      }

      arr.push({
        label: '下发',
        onClick: handleDispatch.bind(null, record),
        auth: 'mes:mes_mo:dispatch',
      });
    }

    if (record.status == 'Stopped') {
      arr.push({
        label: '恢复',
        onClick: handleResume.bind(null, record),
        auth: 'mes:mes_mo:resume',
      });
    } else if (record.status == 'ClosedInAdvance' || record.status == 'Closed') {
      arr.push({
        label: '开启',
        onClick: handleOpen.bind(null, record),
        auth: 'mes:mes_mo:open',
      });
    }

    return arr;
  }

  function getDropDownAction(record) {
    let arr: any[] = [];

    if (record.status == 'WaitProduct') {
      if (record.moSnQty < record.qty) {
        arr.push({
          label: '分配流转卡',
          onClick: handleCreateSn.bind(null, record),
          auth: 'mes:mes_mo:createSn',
        });
      }

      arr.push({
        label: '弃审',
        onClick: handleCancelAudit.bind(null, record),
        auth: 'mes:mes_mo:cancelAudit',
      });
    } else if (record.status == 'Producting') {
      if (record.moSnQty < record.qty) {
        arr.push({
          label: '分配流转卡',
          onClick: handleCreateSn.bind(null, record),
          auth: 'mes:mes_mo:createSn',
        });
      }
    }

    arr.push({
      label: '详情',
      onClick: handleDetail.bind(null, record),
    });
    arr.push({
      label: '下发明细',
      onClick: handleMoPlanList.bind(null, record),
    });

    arr.push({
      label: '流转卡明细',
      onClick: handleMoSnList.bind(null, record),
    });

    return arr;
  }
</script>

<style>
  .ant-table-content {
    overflow-x: auto !important;
  }
</style>
