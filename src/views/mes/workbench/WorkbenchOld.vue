<template>
  <div class="workbenchPage">
    <div style="height: 60%; margin-bottom: 5px" v-if="pathZoomFlag == 'out'">
      <div class="row" style="width: 100%">
        <div v-if="showTaskList" class="colLeft" style="width: 20%" :style="{ backgroundColor: themeColor == 'light' ? '#fff' : '#151515' }">
          <div class="title">
            <div>
              <a-input v-if="showSearch" v-model:value="seacrchInput" placeholder="请输入任务" style="width: 130px" @keyup.enter="searchText" />
              <SearchOutlined @click="clickSearch" style="margin-left: 10px; font-size: 16px" />
            </div>
            <div style="display: flex; align-items: center; cursor: pointer" @click="changeShowTaskList">
              <div>任务列表</div>
              <Icon icon="ant-design:double-left-outlined" size="18px" style="margin-left: 10px" />
            </div>
          </div>
          <div class="scroll-wrap">
            <ScrollContainer v-if="taskList" class="mt-4">
              <ul class="p-3" style="padding-top: 2px">
                <template v-for="(task, index) in taskList" :key="index">
                  <li class="p-2" :style="{ backgroundColor: TaskDetailIndex == index ? 'aliceblue' : '' }" @click="showflowCardList(index, task)">
                    <Icon
                      class="closeBtn"
                      v-if="showTaskDetailIndex != task.id"
                      icon="mdi:chevron-double-down"
                      size="20px"
                      @click.stop="changeShowTaskDetail(task.id, index)"
                    />
                    <Icon
                      class="closeBtn"
                      v-if="showTaskDetailIndex == task.id"
                      icon="mdi:chevron-double-up"
                      size="20px"
                      @click.stop="changeShowTaskDetail(task.id, index)"
                    />
                    <div style="padding-top: 5px; width: 10%; margin-right: 5px">
                      <Icon v-if="task.status == 'wait_product'" icon="mdi:clock-time-three-outline" size="24" color="#ccc" />
                      <Icon v-if="task.status == 'producting'" icon="material-symbols:not-started-outline" size="24" color="#f56027" />
                      <Icon v-if="task.status == 'completed'" icon="mdi:check-circle-outline" size="24" color="#08df08" />
                    </div>
                    <div style="width: 85%; margin-left: 2%">
                      <div class="taskTitleLine">
                        <div class="taskTitle ant-table-cell-ellipsis">{{ task.moPlanId_dictText }}</div>
                      </div>

                      <div>
                        <div v-if="showTaskDetailIndex != task.id">
                          <span>
                            {{ task.wfsId_dictText }}
                          </span>
                          <br />
                          <span>
                            {{ task.prodId_dictText }}/ {{ task.prodName_dictText }}/ {{ task.qty }}/
                            {{ task.completeQty ? task.completeQty : 0 }}
                          </span>
                        </div>
                        <div v-if="showTaskDetailIndex == task.id">
                          <span class="detailLine">工单号：{{ task.moId_dictText }}</span>
                          <span class="detailLine">产品编码：{{ task.moProdId_dictText }}</span>
                          <span class="detailLine">产品名称：{{ task.moProdName_dictText }}</span>
                          <span class="detailLine">工序：{{ task.wfsId_dictText }}</span>
                          <span class="detailLine">加工物料：{{ task.prodId_dictText }}</span>
                          <span class="detailLine">物料名称：{{ task.prodName_dictText }}</span>
                          <span class="detailLine">数量：{{ task.qty }}</span>
                          <span class="detailLine">完工数量：{{ task.completeQty ? task.completeQty : 0 }}</span>
                          <span class="detailLine">工位：{{ task.wkpIds_dictText }}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </ScrollContainer>
            <div v-else style="display: grid; justify-items: center; color: #ccc; margin-top: 50px">
              <Icon icon="ant-design:inbox-outlined" color="#ccc" size="70" style="display: flex" />暂无数据
            </div>
          </div>
        </div>
        <div class="colRight" :style="{ width: showTaskList ? '80%' : '100%', backgroundColor: themeColor == 'light' ? '#fff' : '#151515' }">
          <div class="rTop">
            <div v-if="!showTaskList" @click="changeShowTaskList" class="titleSmall">
              <div style="padding-right: 5px">任务列表</div>
              <Icon icon="ant-design:double-right-outlined" size="18px" />
            </div>
            <div style="position: relative">
              <span>流转卡：</span><input class="ant-input" v-model="inputFlowCard" @keyup.enter="flowCard" style="width: 400px" ref="searchSN" />
              <div @click="showDrop">
                <Icon v-if="snList.length > 0" class="flowCardClose" icon="material-symbols:expand-more" size="20px" color="rgb(0 0 0 / 45%)" />
              </div>
              <div v-if="showFlowCard" class="flowCardListDiv">
                <ul>
                  <li
                    v-for="(snListItem, index) in snList"
                    :key="index"
                    class="cardLi"
                    :style="{ color: flowCardIndex == snListItem ? '#1f94f5' : '' }"
                    @click="changeFlowCard(snListItem)"
                  >
                    {{ snListItem }}</li
                  >
                </ul>
              </div>
            </div>
          </div>
          <div style="padding: 30px 10px; height: 90%">
            <a-carousel arrows style="height: 100%; width: 100%" dot-position="bottom" effect="fade" :dots="false">
              <!--effect="fade" :dots="false"-->
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <left-circle-outlined />
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <right-circle-outlined />
                </div>
              </template>
              <div v-for="(item, index) in commandList" :key="index">
                <div class="centerDiv" v-if="item.length > 0">
                  <div
                    v-for="(val, num) in item"
                    :key="val.id"
                    class="commandBtn"
                    :class="!val.isEnable ? 'form-onlyread' : ''"
                    @click="clickCommand(val)"
                  >
                    <div class="commandIconDiv">
                      <Icon :icon="val.icon" size="100" class="icon" />
                    </div>
                    <div class="text">{{ val.name }}</div>
                  </div>
                </div>
              </div>
            </a-carousel>
          </div>
        </div>
      </div>
    </div>
    <div :class="'footer-' + pathZoomFlag" :style="{ backgroundColor: themeColor == 'light' ? '#fff' : '#151515' }">
      <div class="footer-topLine">
        <div class="footer-topLine-title">工艺路线</div>
        <div>
          <Icon class="flowCardClose" :icon="'ic:baseline-zoom-' + pathZoomFlag + '-map'" size="20px" @click="changePathZoom" />
        </div>
      </div>
      <div :class="'workPathDiv-' + pathZoomFlag">
        <WorkflowViewer ref="workflowViewer" />
      </div>

      <div class="footer-downLine" :style="{ backgroundColor: themeColor == 'light' ? '#b6d7f3' : '#151515' }">
        <div style="width: 40%"></div>
        <div style="width: 60%">
          <ul class="info-list">
            <li
              >车间: <span class="cutUserSpan1">{{ infoData.workShop }}</span></li
            >
            <li
              >工作中心: <span class="cutUserSpan1">{{ infoData.workCenter }}</span></li
            >
            <li
              >工位: <span class="cutUserSpan">{{ infoData.workPost }}</span>
              <SwapOutlined class="cutUserSpan" @click="switchWorkPost" />
            </li>
            <li>
              操作员：<span class="cutUserSpan">{{ userinfo.realname }}</span>
              <SwapOutlined class="cutUserSpan" @click="swithUser" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <WorkbenchModal @register="registerModal" @success="commandSuccess" @snfoucs="snfoucs" />
    <WorkbenchDrawer @register="registerDrawer" @success="commandSuccess" @snfoucs="snfoucs" />

    <!-- 切换用户弹窗 -->
    <SwichUserModal @register="registerUserModal" @callback="switchUserCallBack" />
    <!-- 切换工位 -->
    <SwichWorkPostModal @register="registerWorkPostModal" @callback="switchWorkPostCallBack" />

    <!-- 扫描之后childWorkflowStationList不为空弹出选择框 -->
    <a-modal v-model:visible="scanVisible" :height="200" :centered="true" title="工序选择" @ok="hideModal">
      <div class="divLine">
        <div>并行工序：</div>
        <div><a-select v-model:value="scanInput" style="width: 180px" :options="options" /></div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" name="workbenchPage" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { ScrollContainer } from '/@/components/Container';

  import { LeftCircleOutlined, RightCircleOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons-vue';
  import { getBasCommandList, getMoPlanTaskList, moPlanTaskSnList, getScan } from '/@/views/mes/workbench/Workbench.api';
  import WorkbenchModal from './components/WorkbenchModal.vue';
  import WorkbenchDrawer from './components/WorkbenchDrawer.vue';
  import SwichUserModal from './components/SwichUserModal.vue';
  import SwichWorkPostModal from './components/SwichWorkPostModal.vue';
  import WorkflowViewer from './components/WorkflowViewer.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserWorkbenchStore } from '/@/store/modules/userWorkbench';
  import { defHttp } from '/@/utils/http/axios';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  const { getDarkMode } = useRootSetting();
  const themeColor = computed(() => {
    return unref(getDarkMode.value);
  });

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
  const [registerUserModal, { openModal: openSwitchUserModal }] = useModal();
  const [registerWorkPostModal, { openModal: openSwitchWorkPostModal }] = useModal();

  const userStore = useUserStore();
  const userStoreWorkbench = useUserWorkbenchStore();
  const $message = useMessage();

  const showTaskList = ref(false); // 显示列表，默认 false
  const taskList = ref(); // 任务列表数据
  const showTaskDetailIndex = ref(); // 显示任务详情的下标
  const TaskDetailIndex = ref(-1); //选中当前项
  const inputFlowCard = ref(); // 输入的流转卡
  const snList = ref([]); // 流转卡集合，点击任务时，获取流转卡集合
  const flowCardIndex = ref('');
  const pathZoomFlag = ref('out');
  const workflowViewer = ref();
  const commandList = ref<any>([]);
  let commandListArr = [];
  const showFlowCard = ref(false); //控制流转卡下拉的显示隐藏
  const showSearch = ref(false); //控制任务列表的输入框显示隐藏
  const seacrchInput = ref(''); //任务列表查询
  let searchSN = ref<HTMLInputElement | null>(null); //扫描流传卡输入框
  // 车间工作中心信息
  const infoData = ref({
    workShop: '',
    wksId: '',
    workCenter: '',
    wkcId: '',
    workPost: '',
    wkpId: '',
    operator: '',
    operateBy: '',
  });

  //扫描之后存储的值
  const scanInfo = ref<any>({});
  //是否显示并行工序选择框
  const scanVisible = ref<boolean>(false);
  //并行工序列表
  const options = ref([{}]);
  //并行工序选中值
  const scanInput = ref('');

  // 下发 任务ID
  const moPlan = ref<any>({});
  provide('moPlan', moPlan);
  provide('inputFlowCard', inputFlowCard);
  provide('workInfoData', infoData);
  provide('workPostId', infoData.value.wkpId);

  // 获取用户信息，工作台用户不存在时，set为当前登录用户，工作台统一从 userStoreWorkbench 取用户信息
  const userinfo = computed(() => {
    if (!userStoreWorkbench.getUserInfo) {
      userStoreWorkbench.setUserInfo(userStore.getUserInfo);
    }

    return userStoreWorkbench.getUserInfo || {};
  });

  //根据IP查询车间,工作中心,工位信息，找不到时打开工位选择框
  function getInfoData(ip) {
    if (ip != null) {
      defHttp
        .get({
          url: '/workpost/basWorkPost/getByIpAddress',
          params: {
            ipAddress: ip,
          },
        })
        .then((res) => {
          if (res) {
            infoData.value.workCenter = res.wkcId_dictText;
            infoData.value.wkcId = res.wkcId;
            infoData.value.workPost = res.name;
            infoData.value.wkpId = res.id;
            infoData.value.operator = userinfo.value.realname;
            infoData.value.operateBy = userinfo.value.username;
            defHttp
              .get({
                url: '/workcenter/basWorkCenter/list',
                params: {
                  id: infoData.value.wkcId,
                },
              })
              .then((res) => {
                if (res && res.records.length > 0) {
                  infoData.value.workShop = res.records[0].workShopId_dictText;
                  infoData.value.wksId = res.records[0].workShopId;
                }
              });
            getMoTaskList();

            /**增加工位自动选择之后，焦点自动获取到扫描流转卡输入框 */
            searchSN.value && searchSN.value.focus();
          } else {
            openSwitchWorkPostModal(true, {});
          }
        });
    } else {
      openSwitchWorkPostModal(true, {});
    }
  }

  //获取用户本地IP的方法
  const getUserIP = (onNewIP) => {
    let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    let pc = new MyPeerConnection({
      iceServers: [],
    });
    let noop = () => {};
    let localIPs = {};
    let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
    let iterateIP = (ip) => {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    };
    pc.createDataChannel('');
    pc.createOffer()
      .then((sdp) => {
        sdp.sdp.split('\n').forEach(function (line) {
          if (line.indexOf('candidate') < 0) return;
          line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
      })
      .catch((reason) => {});
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  };

  //根据IP查询车间,工作中心,工位信息，找不到时打开工位选择框
  getUserIP((ip) => getInfoData(ip));

  // 获取任务列表
  function getMoTaskList() {
    if (!unref(infoData).wkpId || unref(infoData).wkpId === '') {
      $message.createMessage.warn('请先选择工位！');
      return;
    }

    const parameters = { wkpId: unref(infoData).wkpId, moPlanId: moPlan.value?.moPlanId, text: seacrchInput.value };

    getMoPlanTaskList(parameters).then((data) => {
      if (!unref(taskList)) {
        // 初始化工作路线
        setTimeout(workflowViewer.value.initLgicflow, 200);
      }

      taskList.value = data;
    });
  }

  /**刷新工作命令 */
  async function refreshCommandList() {
    await getBasCommandList({ userId: unref(userinfo).id }).then((data) => {
      if (data.length > 0) {
        commandListArr = data;

        refreshCommandEnable();
      }
      /**增加成功回调之后，焦点自动获取到扫描流转卡输入框 */
      searchSN.value && searchSN.value.focus();
    });
  }

  /**刷新工作命令状态 */
  function refreshCommandEnable() {
    commandListArr.map((item: any) => {
      if (!unref(infoData).wkpId) {
        item.isEnable = false;
      } else if (item.isAuth != 'Y') {
        item.isEnable = false;
      } else if (item.actionId == '' || item.actionId == null) {
        item.isEnable = true;
      } else if (unref(scanInfo) && item.actionId == unref(scanInfo).actionId) {
        item.isEnable = true;
      } else {
        item.isEnable = false;
      }
    });

    commandList.value = sortArr(commandListArr, 'pageNumber');
  }

  /**将命令列表按页码组装成二维数组 */
  function sortArr(arr, str) {
    //组装按钮二维数组
    var _arr = [],
      _t = [],
      _tmp;

    arr = arr.sort(function (a, b) {
      var s = a[str],
        t = b[str];
      return s < t ? -1 : 1;
    });

    if (arr.length) {
      _tmp = arr[0][str];
    }

    for (var i in arr) {
      if (arr[i][str] === _tmp) {
        _t.push(arr[i]);
      } else {
        _tmp = arr[i][str];
        _arr.push(_t);
        _t = [arr[i]];
      }
    }

    _arr.push(_t);
    return _arr;
  }

  /**刷新工作命令 */
  refreshCommandList();

  /**
   * 隐藏显示任务列表
   */
  function changeShowTaskList() {
    showTaskList.value = !showTaskList.value;
  }

  /**
   * 点击展示任务详情
   * @param event
   */
  function changeShowTaskDetail(id, index) {
    if (showTaskDetailIndex.value == id) {
      showTaskDetailIndex.value = -1;
    } else {
      showTaskDetailIndex.value = id;
      // TaskDetailIndex.value = index
    }
  }

  // 选择任务之后加载工序
  async function showflowCardList(index, task) {
    if (TaskDetailIndex.value != index) {
      TaskDetailIndex.value = index;
      inputFlowCard.value = '';
      flowCardIndex.value = '';
      showFlowCard.value = false;
      moPlan.value = task;
      snList.value = [];
      scanInfo.value = {};

      refreshCommandEnable();
      moPlanTaskSnList({ moPlanTaskId: task.id }).then((res) => {
        if (res && res.length > 0) {
          snList.value = res;
        }
      });
    }
  }

  // 显示流转卡下拉
  function showDrop() {
    if (showFlowCard.value) {
      showFlowCard.value = false;
    } else {
      showFlowCard.value = true;
    }
  }

  /**
   * 选择流转卡
   */
  function changeFlowCard(sn) {
    if (sn) {
      inputFlowCard.value = sn;
      flowCardIndex.value = sn;
    }

    if (inputFlowCard.value == undefined) {
      $message.createMessage.warn('请输入流转卡');
      return;
    }
    let str = /^[A-Za-z0-9]+$/;
    if (!str.test(inputFlowCard.value)) {
      $message.createMessage.warn('请输入正确的流转卡');
      return;
    }

    showFlowCard.value = false;
    if (options.value.length != 0) {
      options.value = [];
    }

    getScanData('');
  }

  /**
   * 扫描流转卡
   */
  function flowCard() {
    flowCardIndex.value = inputFlowCard.value;
    TaskDetailIndex.value = -1;
    showTaskDetailIndex.value = -1;

    let str = /^[A-Za-z0-9]+$/;
    if (!inputFlowCard.value || !str.test(inputFlowCard.value)) {
      $message.createMessage.warn('请输入正确的流转卡');
      getScanData(2);
      getMoTaskList();
    } else {
      getScanData(1);
    }
  }

  /**
   * 查询流转卡信息
   * @param type 操作类型，默认: 选择，1: 扫描，2: 工位切换、清空已扫描条码记录
   */
  function getScanData(type) {
    if (!unref(infoData).wkpId || unref(infoData).wkpId === '') {
      $message.createMessage.warn('请先选择工位！');
      return;
    }

    if (options.value.length != 0) {
      options.value = [];
    }

    // 工位切换，清空已扫描信息
    if (type == 2) {
      inputFlowCard.value = null;
      scanInfo.value = null;
      moPlan.value = null;
      mateTaskList(null);

      refreshCommandEnable();
      return;
    }

    // 查询流转卡信息
    getScan({ sn: unref(inputFlowCard) }).then(async (res) => {
      if (res) {
        scanInfo.value = res;
        refreshCommandEnable();

        // 初始化工作路线
        workflowViewer.value.initLgicflow;

        if (res.childWorkflowStationList != null) {
          scanInput.value = '';
          scanVisible.value = true;
          res.childWorkflowStationList.forEach((item) => {
            options.value.push({
              label: item.title,
              value: item.id,
            });
          });
        } else {
          moPlan.value = {
            moPlanId: res.moPlanId,
            wfsId: res.wfsId,
            sn: res.sn,
          };
          // 扫描时，自动选中工序任务
          if (type == 1) {
            await getMoPlanTaskList({ wkpId: unref(infoData).wkpId, moPlanId: res.moPlanId, text: seacrchInput.value }).then((data) => {
              taskList.value = data;
              mateTaskList(scanInfo.value);
            });
          }
        }
      }
    });
  }

  /**
   * 并行工序选择回调
   */
  function hideModal() {
    defHttp
      .get({
        url: '/workbench/getParallelStationById',
        params: {
          id: scanInput.value,
        },
      })
      .then((res) => {
        scanVisible.value = false;

        scanInfo.value.wfsId = res.WorkflowStation.id;
        scanInfo.value.basWorkflowStation = res.WorkflowStation;
        scanInfo.value.stationId = res.Station.id;
        scanInfo.value.basStation = res.Station;
        scanInfo.value.actionId = res.FirstAction.id;
        scanInfo.value.basAction = res.FirstAction;

        moPlan.value = {
          moPlanId: scanInfo.value.moPlanId,
          sn: scanInfo.value.sn,
          wfsId: res.WorkflowStation.id,
        };

        refreshCommandEnable();

        mateTaskList(scanInfo.value);
      });
  }

  /**
   * 扫描流转卡自动选择生产任务
   * @param scanInfo 扫描流转卡信息
   */
  function mateTaskList(scanInfo) {
    if (!scanInfo) {
      TaskDetailIndex.value = -1;
      showTaskDetailIndex.value = -1;
      moPlan.value = null;
      snList.value = [];
      return;
    }

    taskList.value.forEach((item, index) => {
      if (scanInfo.wfsId == item.wfsId && scanInfo.moPlanId == item.moPlanId && item.status != 'closed') {
        TaskDetailIndex.value = index;
        showTaskDetailIndex.value = item.id;
        snList.value = [];
        moPlanTaskSnList({ moPlanTaskId: item.id }).then((res) => {
          if (res && res.length > 0) {
            snList.value = res;
          }
        });
      }
    });
  }

  /**
   * 点击放大/缩小工艺路径
   * @param zoom
   */
  function changePathZoom() {
    if (pathZoomFlag.value == 'out') {
      pathZoomFlag.value = 'in';
    } else {
      pathZoomFlag.value = 'out';
    }
  }

  // 工作命令弹窗
  const clickCommand = (record) => {
    record.scanInfo = scanInfo.value;
    record.workPostId = infoData.value.wkpId;
    record.operateBy = userinfo.value.username;
    if (record.location == 'right') {
      openDrawer(true, {
        record,
      });
    } else {
      openModal(true, {
        record,
      });
    }
  };

  // 命令成功回调
  function commandSuccess() {
    getMoTaskList();

    if (unref(inputFlowCard)) {
      flowCard();
    }
    /**增加页面成功回调之后，焦点自动获取到扫描流转卡输入框 */
    searchSN.value && searchSN.value.focus();
  }
  /**
   * 聚焦扫描流转卡
   */
  function snfoucs() {
    /**增加页面关闭之后，焦点自动获取到扫描流转卡输入框 */
    searchSN.value && searchSN.value.focus();
  }
  /**
   * 切换用户
   */
  function swithUser() {
    openSwitchUserModal(true, {});
  }

  /**
   * 用户切换回调
   */
  function switchUserCallBack() {
    refreshCommandList();
  }

  /**
   * 切换工位
   */
  function switchWorkPost() {
    openSwitchWorkPostModal(true, {});
  }

  /**
   * 工位切换回调
   * @param val 工位信息
   */
  function switchWorkPostCallBack(val) {
    infoData.value.wkpId = val;
    defHttp
      .get({
        url: '/workpost/basWorkPost/list',
        params: {
          id: val,
        },
      })
      .then((res) => {
        if (res && res.records.length > 0) {
          infoData.value.workCenter = res.records[0].wkcId_dictText;
          infoData.value.workPost = res.records[0].name;
          infoData.value.wkcId = res.records[0].wkcId;
          infoData.value.wkpId = res.records[0].id;
          defHttp
            .get({
              url: '/workcenter/basWorkCenter/list',
              params: {
                id: infoData.value.wkcId,
              },
            })
            .then((res) => {
              if (res && res.records.length > 0) {
                infoData.value.workShop = res.records[0].workShopId_dictText;
                infoData.value.wksId = res.records[0].workShopId;
              }
            });
        }
        /**增加选择工位之后，焦点自动获取到扫描流转卡输入框 */
        searchSN.value && searchSN.value.focus();
      });

    getMoTaskList();

    /**删除已扫描数据 */
    getScanData(2);
  }

  // 切换任务列表输入框
  const clickSearch = () => {
    showSearch.value = !showSearch.value;
  };

  // 任务列表查询框查询事件
  function searchText() {
    getMoTaskList();
  }
</script>

<style lang="less" scoped>
.workbenchPage{
  height: calc(100vh - 110px); 
  padding: 0 10px; 
  box-sizing: border-box; 
  margin-top: 5px;
}
  .row {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
  }

  .closeBtn {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .colLeft {
    margin-right: 5px;
    border-radius: 10px;
    padding: 0 5px;
    //display: flex;
    //flex-wrap: nowrap;
  }

  .flowCardListDiv {
    position: absolute;
    top: 32px;
    left: 56px;
    background: #f0f8ff;
    width: 400px;
    padding: 5px;
    border: 1px solid #abcdeb;
    z-index: 99;
    max-height: 400px;
    overflow: auto;
  }

  .flowCardListDiv li {
    font-size: 16px;
    cursor: pointer;
    padding: 2px;
  }

  .rTop .flowCardClose {
    position: absolute;
    top: 8px;
    right: 5px;
  }

  .colRight {
    background: #fff;
    border-radius: 10px;
    padding: 0 5px;
    box-sizing: border-box;
  }

  .colRight .rTop {
    height: 50px;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
  }

  .title {
    color: #1890ff;
    text-shadow: 0 0 0.25px currentcolor;
    padding: 10px 15px 7px;
    font-size: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid #ccc;
  }

  .container {
    width: 100%;
    height: 100%;
    margin-left: 0;
  }

  .footer-out {
    height: 39%;
    width: 100%;
    // background: #fff;
    border-radius: 10px;
  }

  .footer-in {
    height: calc(100% - 50px);
    width: 100%;
    // background: #fff;
    border-radius: 10px;
  }

  .footer-topLine {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px 0 10px;
    border-bottom: 1px solid #ccc;
    height: 50px;
  }

  .footer-topLine-title {
    font-size: 16px;
    font-weight: 700;
    padding-left: 15px;
  }

  .workPathDiv-out {
    height: calc(100% - 100px);
    margin: 5px;
    position: relative;
  }

  .workPathDiv-in {
    height: 92%;
    margin: 5px;
  }

  .footer-downLine {
    display: flex;
    align-items: center;
    // justify-content: space-around;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 50px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 14px;
  }

  .info-list {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    margin-bottom: 0;
  }

  .info-list li {
    font-size: 14px;
    line-height: 50px;
  }

  .ant-carousel .slick-dots li.slick-active button {
    background: #1890ff !important;
  }

  .footer-downLine div {
  }

  .titleSmall {
    position: relative;
    z-index: 999;
    display: flex;
    color: #1890ff;
    text-shadow: 0 0 0.25px currentcolor;
    border-radius: 5px;
    height: 38px;
    align-items: center;
    padding: 0 10px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 15px;
  }

  .scroll-wrap {
    height: calc(100% - 60px);
    overflow: hidden;
  }

  .scroll-wrap li {
    background: #f0f0f0;
    border-radius: 5px;
    margin: 5px 0;
    display: flex;
    cursor: pointer;
    position: relative;
  }

  .scroll-wrap li .taskTitleLine {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 760;
  }

  .scroll-wrap li .taskTitle {
    width: 80%;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 760;
    height: 30px;
  }

  .scroll-wrap li .detailLine {
    display: flex;
    font-size: 12px;
  }

  .cutUserSpan {
    margin-left: 10px;
    color: #1890ff;
    // cursor: pointer;
  }

  .cutUserSpan1 {
    margin-left: 10px;
  }

  .iconDiv {
    height: 100%;
    padding: 0 5px;
    background: #f0f0f0;
    cursor: pointer;
  }

  .iconDivDisable {
    height: 100%;
    padding: 0 5px;
    background: #f0f0f0;
    opacity: 0.4;
    cursor: no-drop;
  }

  .pageIcon {
    color: deepskyblue;
    display: inline-flex;
    height: 100%;
    align-items: center;
  }

  .centerDiv {
    display: flex;
    width: 100%;
    // height: 375px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 40px;
    box-sizing: border-box;
  }

  .commandBtn {
    height: 150px;
    background-color: aliceblue;
    border: 1px solid #1f94f5;
    border-radius: 7px;
    margin: 15px;
    display: grid;
    align-items: center;
    cursor: pointer;
  }

  .commandBtn .text {
    width: 150px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .commandIconDiv {
    display: flex;
    justify-content: center;
    color: #1f94f5;
  }

  .form-onlyread {
    pointer-events: none;
    background-color: #dfdfdf;
    border: 1px solid #ccc;
    // cursor: ;
  }

  .form-onlyread .commandIconDiv {
    color: #999;
  }

  .form-onlyread .text {
    color: #666;
  }

  .ant-carousel {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 100%;
    // background: #ffffff;
  }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #1f94f5;
    // background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.5;
    z-index: 1;
  }

  .ant-carousel :deep(.custom-slick-arrow:before) {
    display: none;
  }

  .ant-carousel :deep(.custom-slick-arrow:hover) {
    opacity: 1;
  }

  .divLine {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 5px;
  }
</style>
