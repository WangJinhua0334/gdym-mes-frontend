<template>
  <div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="异常呼叫" key="callingTab" :forceRender="true">
        <a-card v-for="item in recordList" :key="item.id" :class="item.status">
          <template #extra><a href="#" @click="handleDetail(item)">详情</a></template>
          <template #title>
            <span>{{ item.typeId_dictText }}</span>
          </template>
          <template #actions>
            <span @click="handleProgress(item)">进度</span>
            <span v-if="item.status === 'created' || item.status === 'processing'" @click="handleRevoke(item)">撤回</span>
            <span v-if="item.status === 'processed'" @click="handleComplete(item)">确认完成</span>
            <span v-if="item.status === 'processed'" @click="handleReSend(item)">未处理成功</span>

          </template>
          <a-card-meta>
            <template #description>
              <div>
                <span>异常描述：{{ item.content }}</span>
                <br />
              </div>
              <div>
                <span>责任人：{{ item.responsibleBy_dictText }}</span>
                <br />
              </div>
              <div>
                <span>责任部门：{{ item.responsibleDeptId_dictText }}</span>
                <br />
              </div>
              <div>
                <span>状态：{{ item.status_dictText }}</span>
                <br />
              </div>
              <div v-if="item.status === 'created'">
                <span>呼叫时长：{{ item.timeSpanStr }}</span>
                <br />
                <span>呼叫人：{{ item.createBy_dictText }}</span>
                <br />
                <span>呼叫时间：{{ item.createTime }}</span>
                <br />
              </div>
              <div v-if="item.status === 'processing'">
                <span>响应时长：{{ item.timeSpanStr }}</span>
                <br />
                <span>响应人：{{ item.responseBy_dictText }}</span>
                <br />
                <span>响应时间：{{ item.responseTime }}</span>
                <br />
              </div>
              <div v-if="item.status === 'processed'">
                <span>处理时长：{{ item.timeSpanStr }}</span>
                <br />
                <span>处理人：{{ item.processBy_dictText }}</span>
                <br />
                <span>处理时间：{{ item.processTime }}</span>
                <br />
              </div>
            </template>
          </a-card-meta>
        </a-card>

        <a-card v-for="item in typeList" :key="item.id" class="normal" @click="handleAdd(item)">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <template #actions>
            <span>&nbsp;</span>
          </template>
          <a-card-meta>
            <template #description>
              <span>异常描述：{{ item.description }}</span>
              <br />
              <span>责任人：{{ item.responsibleByName_dictText }}</span>
              <br />
              <span>责任部门：{{ item.responsibleDeptId_dictText }}</span>
              <br />
              <span>状态：</span>
              <br />
              <span>呼叫时长：</span>
              <br />
              <span>呼叫人：</span>
              <br />
              <span>呼叫时间：</span>
              <br />
            </template>
          </a-card-meta>
        </a-card>
      </a-tab-pane>

      <a-tab-pane tab="呼叫记录" key="recordListTab" :forceRender="true">
        <!-- <MesLotAbnormalList :wkpId="wkpId" ref="mesLotAbnormalListRef" /> -->
        <!--引用表格-->
        <BasicTable ref="refTable" @register="registerTable" :rowSelection="rowSelection">
          <!--插槽:table标题-->
          <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
          </template>
          <!--操作栏-->
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>
    </a-tabs>

    <MesAbnormalRejectModal @register="registerRejectModal" @success="loadData" />
    <MesAbnormalAddModal @register="registerAddModal" @success="loadData" />
    <MesAbnormalDetailModal @register="registerDetailModal" />
    <MesAbnormalProgressDrawer @register="registerProgressDrawer" />
  </div>
</template>

<script lang="ts" name="abnormal-mesAbnormalCall" setup>
  import { ref, unref, inject, watch, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { listCall, getExportUrl, listByWkpId, listAllType, revoke, complete,reSend } from './MesAbnormal.api';
  import { listColumns, searchFormSchema } from './MesAbnormal.data';
  import MesAbnormalAddModal from './components/MesAbnormalAddModal.vue';
  import MesAbnormalDetailModal from './components/MesAbnormalDetaillModal.vue';
  import MesAbnormalProgressDrawer from './components/MesAbnormalProgressDrawer.vue';
  import MesAbnormalRejectModal from './components/MesAbnormalRejectModal.vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);

  //注册驳回Modal
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  //注册新增Modal
  const [registerAddModal, { openModal: openAddModal }] = useModal();
  //注册详情Modal
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  //注册进度Drawer
  const [registerProgressDrawer, { openDrawer: openProgressDrawer }] = useDrawer();
  /**注册呼叫记录列表 */
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      api: (params) => {
        params['wkpId'] = unref(wkpId);
        return listCall(params);
      },
      columns: listColumns,
      canResize: true,
      rowSelection: { type: 'checkbox' },
      formConfig: {
        labelWidth: 70,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '呼叫记录',
      url: getExportUrl,
    },
  });

  const [registerTable, {}, { selectedRowKeys, rowSelection }] = tableContext;

  const activeKey = ref(); //当前激活Tab页
  const refTable = ref(); //响应Table

  const workInfoData: any = inject('workInfoData');
  const wksId = ref<string>();
  const wkcId = ref<string>();
  const wkpId = ref<string>();

  const recordList = ref<any[]>();
  const typeList = ref<any[]>();

  onMounted(() => {
    if (unref(workInfoData) && unref(workInfoData).wkpId) {
      activeKey.value = 'callingTab';
      wksId.value = unref(workInfoData).wksId;
      wkcId.value = unref(workInfoData).wkcId;
      wkpId.value = unref(workInfoData).wkpId;
    } else {
      $message.createMessage.warning('请先选择工位');
      emit('close');
      return;
    }
  });

  /**监听标签页切换 */
  watch(
    () => unref(activeKey),
    () => {
      if (unref(activeKey) && unref(activeKey) == 'callingTab') {
        loadData();
      }
    },
    { immediate: true, deep: true }
  );

  /**加载页面数据 */
  function loadData() {
    if (!unref(wkpId)) {
      $message.createMessage.warning('请先选择工位');
      emit('close');
      return;
    }

    listByWkpId({ wkpId: unref(wkpId) }).then((res) => {
      res.forEach((item) => {
        item.timeSpanStr = getTimeSpanStr(item.createTime, item.processTime ?? item.responseTime);
      });

      recordList.value = res;
    });

    listAllType({}).then((res) => {
      typeList.value = res;
    });
  }

  /**计算时长 */
  function getTimeSpanStr(createTime, responseTime) {
    let date1 = createTime; //开始时间
    let date2 = responseTime ? new Date(responseTime) : new Date(); //结束时间
    let date3 = date2.getTime() - new Date(date1).getTime(); //时间差的毫秒数

    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));

    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    return days + '天' + hours + '小时' + minutes + '分钟';
  }

  /**详情 */
  function handleDetail(item) {
    openDetailModal(true, {
      record: item,
    });
  }

  /**进度 */
  function handleProgress(item) {
    openProgressDrawer(true, {
      record: item,
    });
  }

  /**新增 */
  function handleAdd(item) {
    openAddModal(true, {
      isWorkBench: true,
      record: {
        typeCode:item.code,
        typeId: item.id,
        wksId: unref(wksId),
        wkcId: unref(wkcId),
        wkpId: unref(wkpId),
        responsibleDeptId: item.responsibleDeptId,
        responsibleBy: item.responsibleBy,
      },
    });
  }

  /**撤回 */
  function handleRevoke(item) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认撤回',
      content: '是否撤回当前异常',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        revoke({ id: item.id }).then(() => {
          loadData();
        });
      },
    });
  }
  /**未处理完成 */
  function handleReSend(item){
    openRejectModal(true,{record:item});
  }
  /**完成 */
  function handleComplete(item) {
    $message.createConfirm({
      iconType: 'warning',
      title: '确认完成',
      content: '是否完成当前异常',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        complete({ id: item.id }).then(() => {
          loadData();
        });
      },
    });
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '进度',
        onClick: handleProgress.bind(null, record),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
    ];
  }
</script>

<style lang="less" scoped>
  .normal {
    width: 300px;
    float: left;
    margin-right: 10px;
    margin-top: 0px;
    background-color: rgba(158, 158, 158, 1);
    cursor: pointer;
  }
  .created:extend(.normal) {
    background-color: #ff4646;
  }
  .processing:extend(.normal) {
    background-color: #f2f2a5;
  }
  .processed:extend(.normal) {
    background-color: #83cd83;
  }

  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
