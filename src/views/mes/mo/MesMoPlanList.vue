<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="工序任务" key="mesMoPlanTask" forceRender>
            <MesMoPlanTaskSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls"> 导入 </j-upload-button>
        <a-button type="primary" preIcon="ant-design:download-outlined" @click="handleExportTemplateXls"> 下载模版</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="3" @click="batchHandleDelete">
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

    <!-- 生产任务新增/编辑表单区域 -->
    <MesMoPlanModal @register="registerMoPlanModal" @success="handleSuccess" />
    <!-- 生产任务新增/编辑表单区域 -->
    <MesMoPlanDetailModal @register="registerMoPlanDetailModal" />
    <!-- 生产任务分配流转卡表单区域-->
    <MesMoPlanCreateSnModal @register="registerMoPlanCreateSnModal" @success="handleSuccess" />
    <!-- 生产任务绑定流转卡表单区域-->
    <BasicModal
      @register="registerMoPlanBindSnModal"
      :defaultFullscreen="true"
      :title="'物料条码绑定'"
      :showOkBtn="false"
      :showCancelBtn="false"
      :footer="null"
      destroyOnClose
    >
      <MesMoPlanBindSn :moPlanId="currentId" @setModalProps="setMoPlanBindSnModalProps" @close="closeMoPlanBindSnModal" @success="handleSuccess" />
    </BasicModal>
    <!-- 生产任务流转卡列表区域 -->
    <BasicModal
      @register="registerMoPlanSnListModal"
      :defaultFullscreen="true"
      :title="'流转卡'"
      :showOkBtn="false"
      :showCancelBtn="true"
      :cancelText="'返回'"
      destroyOnClose
    >
      <MesMoSnList :moPlanId="currentId" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="mo-mesMoPlan" setup>
  import { ref, unref, computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { Tooltip, Progress } from 'ant-design-vue';

  import MesMoPlanModal from './components/MesMoPlanModal.vue';
  import MesMoPlanDetailModal from './components/MesMoPlanDetailModal.vue';
  import MesMoPlanCreateSnModal from './components/MesMoPlanCreateSnModal.vue';
  import MesMoPlanBindSn from './components/MesMoPlanBindSn.vue';
  import MesMoSnList from './MesMoSnList.vue';
  import MesMoPlanTaskSubTable from './subTables/MesMoPlanTaskSubTable.vue';

  import { columns, searchFormSchema } from './MesMoPlan.data';
  import { list, getExportUrl, deleteOne, batchDelete, getImportSnUrl, getExportTemplateXlsUrl, urgentWork } from './MesMoPlan.api';

  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useMethods } from '/@/hooks/system/useMethods';

  const props = defineProps({
    moId: {
      type: String,
      default: '',
    },
  });

  const $message = useMessage();

  const currentId = ref('');

  const [registerMoPlanModal, { openModal: openMoPlanModal }] = useModal();
  const [registerMoPlanDetailModal, { openModal: openMoPlanDetailModal }] = useModal();
  const [registerMoPlanCreateSnModal, { openModal: openMoPlanCreateSnModal }] = useModal();
  const [
    registerMoPlanBindSnModal,
    { setModalProps: setMoPlanBindSnModalProps, openModal: openMoPlanBindSnModal, closeModal: closeMoPlanBindSnModal },
  ] = useModal();
  const [registerMoPlanSnListModal, { openModal: openMoPlanSnListModal }] = useModal();
  const { handleExportXlsx } = useMethods();

  // 展开key
  const expandedRowKeys = ref<any[]>([]);

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '生产任务',
      api: (parameters) => {
        if (props.moId && props.moId != '') {
          parameters['moId'] = props.moId;
        }

        return list(parameters);
      },
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
        width: 250,
        align: 'left',
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '生产任务',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportSnUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload, setLoading }, { rowSelection, selectedRowKeys }] = tableContext;

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
   * 下载模板
   */
  async function handleExportTemplateXls() {
    setLoading(true);
    await handleExportXlsx('生产任务批量导入流转卡模板', getExportTemplateXlsUrl);
    setLoading(false);
  }
  /**
   * 新增事件
   */
  function handleAdd() {
    openMoPlanModal(true, { isUpdate: false, disabled: false });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openMoPlanModal(true, { record, isUpdate: true, disabled: false });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openMoPlanDetailModal(true, { record });
  }
  /**
   * 分配流转卡
   */
  function handleCreateSn(record: Recordable) {
    openMoPlanCreateSnModal(true, { record });
  }
  /**
   * 绑定流转卡
   */
  function handleBind(record: Recordable) {
    currentId.value = record.id;
    openMoPlanBindSnModal(true, {
      record,
    });
  }

  /**
   * 流转卡列表
   */
  function handleMoPlanSnList(record: Recordable) {
    currentId.value = record.id;
    openMoPlanSnListModal(true, {
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
      content: '是否删除当前生产任务',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteOne({ id: record.id }, handleSuccess);
      },
    });
  }
  /**
   * 催工事件
   */
  async function handleUrgentWork(record) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认发送催工消息',
      content: '是否确认对当前生产任务发送催工消息',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        urgentWork({ id: record.id });
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
    if (record.status === 'wait_product') {
      arr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'org.jeecg.modules:mes_mo_plan:edit',
      });
    }
    arr.push({
      label: '分配流转卡',
      onClick: handleCreateSn.bind(null, record),
      auth: 'org.jeecg.modules:mes_mo_plan:createSn',
    });
    return arr;
  }

  function getDropDownAction(record) {
    let arr: any[] = [];

    if (record.status == 'wait_product') {
      arr.push({
        label: '删除',
        onClick: handleDelete.bind(null, record),
        auth: 'org.jeecg.modules:mes_mo_plan:delete',
      });
      arr.push({
        label: '催工',
        onClick: handleUrgentWork.bind(null, record),
        auth: 'org.jeecg.modules:mes_mo_plan:urgentWork',
      });
    }

    arr.push(
      // {
      //   label: '物料条码绑定',
      //   onClick: handleBind.bind(null, record),
      //   auth: 'org.jeecg.modules:mes_mo_plan:bindSn',
      // },
      {
        label: '流转卡明细',
        onClick: handleMoPlanSnList.bind(null, record),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }
    );

    return arr;
  }
</script>
<style>
  .ant-table-content {
    overflow-x: auto !important;
  }
</style>
