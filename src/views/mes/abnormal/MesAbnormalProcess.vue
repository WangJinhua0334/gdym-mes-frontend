<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" type="card">
      <!--主表区域 -->
      <a-tab-pane tab="我的待处理" key="myProccessingList" :forceRender="true">
        <a-card class="card-background">
          <a-tabs v-model:activeKey="typeActiveKey" type="card">
            <!--主表区域 -->
            <a-tab-pane tab="所有类型" key="all" :forceRender="true" />
            <!--子表单区域 -->
            <a-tab-pane v-for="item in typeList" :key="item.id" :tab="item.name" :forceRender="true" />
          </a-tabs>

          <a-card
            :title="item.typeId_dictText"
            :class="item.status === 'created' ? 'wait_response' : 'processing'"
            v-for="item in processingList"
            :key="item.id"
          >
            <template #extra>
              <a href="#" @click="handleDetail(item)">详情</a>
            </template>
            <div>
              <span>异常描述：{{ item.content }}</span> <br />
            </div>
            <div>
              <span>异常设备：{{ item.equipmentId_dictTexst }}</span> <br />
            </div>
            <div>
              <span>呼叫人：{{ item.createBy_dictText }}</span> <br />
            </div>
            <div>
              <span>工位{{ item.wkpId_dictText }}</span> <br />
            </div>
            <div>
              <span>工作中心：{{ item.wkcId_dictText }}</span> <br />
            </div>
            <div>
              <span>车间：{{ item.wksId_dictText }}</span> <br />
            </div>
            <!-- <p>问题描述：{{ item.content }}</p>
            <p>问题设备：{{ item.equipmentId_dictTexst }}</p>
            <p>呼叫人：{{ item.createBy_dictText }}</p>
            <p>呼叫工位：{{ item.wkpId_dictText }}</p>
            <p>工作中心：{{ item.wkcId_dictText }}</p>
            <p>车间：{{ item.wksId_dictText }}</p> -->
            <template #actions>
              <a v-show="item.status === 'created'" href="#" @click="handleResponse(item)">响应</a>
              &nbsp;&nbsp;
              <a href="#" @click="handleProcess(item)">处置</a>
            </template>
          </a-card>
        </a-card>
      </a-tab-pane>
      <!--子表单区域 -->
      <a-tab-pane tab="所有待处理" key="allProcessingList" :forceRender="true">
        <a-card class="card-background">
          <a-tabs v-model:activeKey="typeActiveKey" type="card">
            <!--主表区域 -->
            <a-tab-pane tab="所有类型" key="all" :forceRender="true" />
            <!--子表单区域 -->
            <a-tab-pane v-for="item in typeList" :key="item.id" :tab="item.name" :forceRender="true" />
          </a-tabs>

          <a-card
            :title="item.typeId_dictText"
            :class="item.status === 'created' ? 'wait_response' : 'processing'"
            v-for="item in processingList"
            :key="item.id"
          >
            <template #extra>
              <a href="#" @click="handleDetail(item)">详情</a>
            </template>
            <div>
              <span>异常描述：{{ item.content }}</span> <br /><br />
            </div>
            <div>
              <span>异常设备：{{ item.equipmentId_dictTexst }}</span> <br /><br />
            </div>
            <div>
              <span>呼叫人：{{ item.createBy_dictText }}</span> <br /><br />
            </div>
            <div>
              <span>工位：{{ item.wkpId_dictText }}</span> <br /><br />
            </div>
            <div>
              <span>工作中心：{{ item.wkcId_dictText }}</span> <br /><br />
            </div>
            <div>
              <span>车间：{{ item.wksId_dictText }}</span> <br /><br />
            </div>
            <!-- <p>问题描述：{{ item.content }}</p>
            <p>问题设备：{{ item.equipmentId_dictTexst }}</p>
            <p>呼叫人：{{ item.createBy_dictText }}</p>
            <p>呼叫工位：{{ item.wkpId_dictText }}</p>
            <p>工作中心：{{ item.wkcId_dictText }}</p>
            <p>车间：{{ item.wksId_dictText }}</p> -->
            <!-- <template #actions>
              <a v-show="item.status === 'created'" href="#" @click="handleResponse(item)">响应</a>
              &nbsp;&nbsp;
              <a href="#" @click="handleProcess(item)">处置</a>
            </template> -->
          </a-card>
        </a-card>
      </a-tab-pane>

      <!--子表单区域 -->
      <a-tab-pane tab="响应记录" key="responsedList" :forceRender="true">
        <!--引用表格-->
        <BasicTable ref="responsedRefTable" @register="registerResponsedTable" :rowSelection="{ type: 'checkbox' }">
          <!--插槽:table标题-->
          <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="resopnsedOnExportXls"> 导出</a-button>
          </template>
          <!--操作栏-->
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>

      <!--子表单区域 -->
      <a-tab-pane tab="处置记录" key="processedList" :forceRender="true">
        <!--引用表格-->
        <BasicTable ref="processedRefTable" @register="registerProcessedTable" :rowSelection="{ type: 'checkbox' }">
          <!--插槽:table标题-->
          <template #tableTitle>
            <a-button type="primary" preIcon="ant-design:export-outlined" @click="processedOnExportXls"> 导出</a-button>
          </template>
          <!--操作栏-->
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </a-tab-pane>
    </a-tabs>
  </div>

  <!-- 进度抽屉区域 -->
  <MesAbnormalProgressDrawer @register="registerProgressDrawer" />

  <!-- 详情表单区域 -->
  <MesAbnormalDetailModal @register="registerDetailModal" />
  <!-- 处理表单区域 -->
  <MesAbnormalProcessModal @register="registerProcessModal" @success="loadData" />
</template>

<script lang="ts" name="abnormal-mesAbnormalProcess" setup>
  import { ref, unref, watch, onUnmounted, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { list, getExportUrl, listAllType, listByStatus, response } from './MesAbnormal.api';
  import { listColumns, processeSearchFormSchema } from './MesAbnormal.data';
  import MesAbnormalDetailModal from './components/MesAbnormalDetaillModal.vue';
  import MesAbnormalProcessModal from './components/MesAbnormalProcessModal.vue';
  import MesAbnormalProgressDrawer from './components/MesAbnormalProgressDrawer.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createConfirm } = useMessage();

  //注册详情Modal
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  //注册处理Modal
  const [registerProcessModal, { openModal: openProcessModal }] = useModal();
  //注册进度Drawer
  const [registerProgressDrawer, { openDrawer: openProgressDrawer }] = useDrawer();

  /**注册响应记录列表 */
  const { tableContext: resopnsedTableContext, onExportXls: resopnsedOnExportXls } = useListPage({
    tableProps: {
      api: (params) => {
        params['status'] = 'processing,processed,completed';
        return list(params);
      },
      columns: listColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: processeSearchFormSchema,
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
      name: '响应记录',
      url: getExportUrl,
    },
  });

  const [registerResponsedTable, {}, { selectedRowKeys: responsedSelectedRowKeys }] = resopnsedTableContext;

  /**注册处理记录列表 */
  const { tableContext: processedTableContext, onExportXls: processedOnExportXls } = useListPage({
    tableProps: {
      api: (params) => {
        params['status'] = 'processed,completed';
        return list(params);
      },
      columns: listColumns,
      canResize: true,
      formConfig: {
        //labelWidth: 120,
        schemas: processeSearchFormSchema,
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
      name: '处置记录',
      url: getExportUrl,
    },
  });

  const [registerProcessedTable, {}, { selectedRowKeys: processedSelectedRowKeys }] = processedTableContext;

  const activeKey = ref('myProccessingList');
  const typeActiveKey = ref('all');

  const typeList = ref([]); //异常类型
  const processingList = ref([]); //待响应/处理列表

  const flr = ref(true); // 是否需要背景切花
  const responsedRefTable = ref(); //响应Table
  const processedRefTable = ref(); //处理Table

  /**监听一级标签页 */
  watch(
    () => unref(activeKey),
    () => {
      if (unref(activeKey)) {
        if (unref(activeKey) == 'myProccessingList' || unref(activeKey) == 'allProcessingList') {
          listAllType({}).then((res) => {
            typeList.value = res;
          });

          loadData();
        } else if (unref(activeKey) == 'responsedList') {
          flr.value = false;
          unref(responsedRefTable).reload();
        } else if (unref(activeKey) == 'processedList') {
          flr.value = false;
          unref(processedRefTable).reload();
        }
      } else {
        processingList.value = [];
      }
    },
    { immediate: true, deep: true }
  );

  /**监听二级标签页 */
  watch(
    () => unref(typeActiveKey),
    () => {
      if (unref(typeActiveKey)) {
        loadData();
      } else {
        processingList.value = [];
      }
    },
    { immediate: false, deep: true }
  );

  onUnmounted(() => {
    flr.value = false;
  });
  onMounted(() => {
    flr.value = true;
  });

  function sleep(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  /**切换待响应块的背景颜色 */
  async function transColor() {
    let timernum = 0;
    while (unref(flr)) {
      await sleep(500).then(function () {
        timernum++;
        let waitResps = document.querySelectorAll('.wait_response');
        if (waitResps && waitResps.length > 0) {
          for (let w of waitResps) {
            if (unref(timernum) % 2 == 1) {
              w.style.backgroundColor = '#ff4646';
            } else {
              w.style.backgroundColor = 'white';
            }
          }
        }
      });
    }
  }

  watch(
    () => unref(processingList),
    () => {
      if (unref(processingList) && unref(processingList).length > 0) {
        flr.value = true;
        transColor();
      }
    },
    { immediate: false, deep: false }
  );

  /**加载待处理数据 */
  function loadData() {
    flr.value = false;

    processingList.value = [];

    let typeId = unref(typeActiveKey);
    let onlySelf = 'N';
    if (unref(activeKey) == 'myProccessingList') {
      onlySelf = 'Y';
    }

    listByStatus({ typeId: typeId, onlySelf: onlySelf, status: 'created,processing' }).then((res) => {
      processingList.value = res;
    });
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

  /**响应 */
  async function handleResponse(item) {
    flr.value = false;
    response({ id: item.id }).then(() => {
      loadData();
      flr.value = true;
    });
  }

  /**处理 */
  function handleProcess(item) {
    openProcessModal(true, {
      id: item.id,
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

<style scoped>
  .wait_response {
    width: 300px;
    float: left;
    margin-right: 10px;
    margin-top: 0px;
    background-color: #ff4646;
    cursor: pointer;
  }
  .processing {
    width: 300px;
    float: left;
    margin-right: 10px;
    margin-top: 0px;
    cursor: pointer;
    background-color: #f2f2a5;
  }
  .card-background {
    width: 100%;
    height: 100%;
  }
</style>
