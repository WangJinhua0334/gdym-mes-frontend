<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
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

    <!-- 抽屉 -->
    <!-- 进度区域 -->
    <MesAbnormalProgressDrawer @register="registerProgressDrawer" />

    <!-- 表单 -->
    <!-- 详情区域 -->
    <MesAbnormalDetailModal @register="registerDetailModal" />
    <!-- 新增区域 -->
    <MesAbnormalAddModal @register="registerAddModal" @close="closeAddModal" @success="handleSuccess" />

    <MesAbnormalRejectModal @register="registerRejectModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="abnormal-mesAbnormal" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesAbnormalProgressDrawer from './components/MesAbnormalProgressDrawer.vue';
  import MesAbnormalDetailModal from './components/MesAbnormalDetaillModal.vue';
  import MesAbnormalAddModal from './components/MesAbnormalAddModal.vue';
  import { listColumns, searchFormSchema } from './MesAbnormal.data';
  import { list, getExportUrl, complete } from './MesAbnormal.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import MesAbnormalRejectModal from './components/MesAbnormalRejectModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const $message = useMessage();

  //注册drawer
  const [registerProgressDrawer, { openDrawer: openProgressDrawer }] = useDrawer();
  //注册model
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerAddModal, { openModal: openAddModal, closeModal: closeAddModal }] = useModal();
  //注册驳回Modal
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const abnormalCallRef = ref();
  const viewData: any = ref({});

  //注册table数据
  const { prefixCls, tableContext, onExportXls } = useListPage({
    tableProps: {
      api: list,
      columns: listColumns,
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
        width: 200,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '异常记录',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增
   */
  function handleAdd() {
    openAddModal(true, {
      isWorkBench: false,
    });
  }

  /**
   * 进度
   */
  function handleProgress(record: Recordable) {
    openProgressDrawer(true, {
      record: record,
    });
  }

  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDetailModal(true, {
      record,
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

  /**未处理完成 */
  function handleReSend(record: Recordable) {
    openRejectModal(true, { record });
  }
  /**完成 */
  function handleComplete(record: Recordable) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认完成',
      content: '是否完成当前异常',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        complete({ id: record.id }).then(() => {
          handleSuccess();
        });
      },
    });
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    const arr: ActionItem[] = [];
    if (record.status == 'processed' && userStore.getUserInfo.username == record.createBy) {
      arr.push(
        {
          label: '确认',
          onClick: handleComplete.bind(null, record),
        },
        {
          label: '驳回',
          onClick: handleReSend.bind(null, record),
        }
      );
    }
    arr.push(
      {
        label: '进度',
        onClick: handleProgress.bind(null, record),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }
    );
    return arr;
  }
</script>

<style scoped></style>
