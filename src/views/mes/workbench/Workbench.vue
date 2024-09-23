<template>
  <div class="workbenchPage" :class="'workPathDiv-' + pathZoomFlag" :style="{ height: currentFullScreen ? '100%' : currentHeightscreen - 50 + 'px' }">
    <div class="cont-lt" v-if="visible">
      <div class="lt-top">
        <div class="footer-downLine">
          <div class="footer-downLine-lt">
            <div class="footer-downLine-title">工位: {{ infoData.workPost }}</div>
            <ul class="info-list">
              <li class="text">
                车间： <span class="cutUserSpan1">{{ infoData.workShop }}</span>
              </li>
              <li class="line">|</li>
              <li class="text">
                工作中心： <span class="cutUserSpan1">{{ infoData.workCenter }}</span>
              </li>
              <li class="line">|</li>
              <li class="text" @click="swithUser">
                操作员：<span class="cutUserSpan">{{ userinfo.realname }}</span>
                <p class="change-icon" style="margin-top: 15px"></p>
              </li>
            </ul>
          </div>
          <div class="footer-downLine-rt">
            <div @click="switchWorkPost">
              切换工位
              <p class="change-icon"></p>
            </div>
          </div>
          <p class="sanjiao1"></p>
          <p class="sanjiao2"></p>
        </div>
        <div class="text-list">
          <div class="text-list-info" @click="changeShowTaskList">
            <div>任务列表</div>
            <div class="test-icon">
              <p v-if="!showTaskList">展开<span class="span1"></span></p>
              <p v-else>收起<span class="span2"></span></p>
            </div>
          </div>
          <div class="flowCard">
            <div class="flowCard-search">
              <p style="flex: 1">
                <span>流转卡</span> &nbsp;&nbsp;&nbsp;&nbsp;|
                <input
                  class="ant-input"
                  v-model.trim="inputFlowCard"
                  @keyup.enter="flowCard"
                  style="width: calc(100% - 70px)"
                  ref="searchSN"
                  placeholder="请输入流转卡号"
                />
              </p>
              <p class="clear-button" @click="clearFlowCard">清空</p>
              <p class="search-button" @click="flowCard">查询</p>
            </div>
            <div @click="clearFlowCard">
              <Icon
                v-if="inputFlowCard && inputFlowCard != ''"
                class="flowCardClose"
                style="right: 35%"
                icon="ant-design:close-outlined"
                size="20px"
                color="#fff"
              />
            </div>
            <div @click="showDrop">
              <Icon v-if="snList.length > 0" class="flowCardClose" icon="material-symbols:expand-more" size="20px" color="#fff" />
            </div>
            <ul v-if="showFlowCard" class="flowCardListDiv">
              <li
                v-for="(snListItem, index) in snList"
                :key="index"
                class="cardLi"
                :style="{ color: flowCardIndex == snListItem ? '#1f94f5' : '' }"
                @click="changeFlowCard(snListItem)"
              >
                {{ snListItem }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="lt-bot">
        <div class="scroll-wrap" v-if="showTaskList" :style="{ height: currentHeight - 60 + 'px' }">
          <div style="width: 100%; height: 30px">
            <a-input
              class="ant-input"
              v-model:value="seacrchInput"
              placeholder="请输入任务"
              style="width: 90%; background-color: transparent; border: none; color: #fff"
              @keyup.enter="searchText"
            />
            <SearchOutlined @click="clickSearch" style="margin-left: 10px; font-size: 16px; color: #fff" />
          </div>
          <div class="warp-status-box">
            <ul class="warp-status">
              <li :class="taskStatus == 'all' ? 'active' : ''" @click="shatusChange('all')">全部</li>
              <li :class="taskStatus == 'producting' ? 'active' : ''" @click="shatusChange('producting')">进行中</li>
              <li :class="taskStatus == 'completed' ? 'active' : ''" @click="shatusChange('completed')">完工</li>
              <li :class="taskStatus == 'wait_start' ? 'active' : ''" @click="shatusChange('wait_start')">待开工</li>
              <li :class="taskStatus == 'wait_product' ? 'active' : ''" @click="shatusChange('wait_product')">排队中</li>
              <!-- <li :class="taskStatus == 'all' ? 'active' : ''" @click="shatusChange('all')">待维修</li>
              <li :class="taskStatus == 'all' ? 'active' : ''" @click="shatusChange('all')">待处理</li> -->
            </ul>
          </div>

          <div v-if="taskList" style="height: 100%; overflow: hidden">
            <ul class="task-list" id="myElement">
              <li
                v-for="(task, index) in taskList"
                :key="index"
                :class="TaskDetailIndex == index ? 'active' : ''"
                @click="showflowCardList(index, task)"
              >
                <div class="task-title">
                  <p class="status-icon status-icon2" v-if="task.status == 'wait_product'"></p>
                  <p class="status-icon status-icon3" v-else-if="task.status == 'completed'"></p>
                  <p class="status-icon status-icon1" v-else-if="task.status == 'producting'"></p>
                  <p class="status-icon status-icon4" v-else></p>
                  <div class="taskTitleLine">{{ task.moPlanId_dictText }}</div>
                </div>
                <div style="width: 100%; padding: 0 10px; box-sizing: border-box">
                  <div>
                    <div v-if="showTaskDetailIndex != task.id">
                      <span style="font-size: 12px">
                        {{ task.wfsId_dictText }}
                      </span>
                      <br />
                      <span style="font-size: 12px"> {{ task.prodId_dictText }}/ {{ task.prodName_dictText }} </span>
                      <div class="complate-num">
                        <p
                          >数量 <span>{{ task.qty }}</span> | 完工数量<span>{{ task.completeQty ? task.completeQty : 0 }}</span>
                        </p>
                        <Icon
                          class="closeBtn"
                          v-if="showTaskDetailIndex != task.id"
                          icon="mdi:chevron-double-down"
                          size="20px"
                          @click.stop="changeShowTaskDetail(task.id, index)"
                          color="#1890FF"
                        />
                        <Icon
                          class="closeBtn"
                          v-if="showTaskDetailIndex == task.id"
                          icon="mdi:chevron-double-up"
                          size="20px"
                          @click.stop="changeShowTaskDetail(task.id, index)"
                          color="#1890FF"
                        />
                      </div>
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
            </ul>
          </div>
          <div v-else style="display: grid; justify-items: center; color: #ccc; margin-top: 50px">
            <Icon icon="ant-design:inbox-outlined" color="#ccc" size="70" style="display: flex" />暂无数据
          </div>
        </div>
        <div class="operateion-button" :style="{ height: currentHeight - 60 + 'px' }">
          <h3 class="operate-title">操作模块</h3>
          <div class="centerDiv">
            <div v-for="val in operateData" :key="val.id" class="commandBtn" :class="!val.isEnable ? 'form-onlyread' : ''" @click="clickCommand(val)">
              <div class="commandIconDiv">
                <Icon v-if="val.isEnable" :icon="val.icon" class="icon" />
                <Icon v-if="!val.isEnable" :icon="val.iconEx" class="icon" />
              </div>
              <div class="text">{{ val.name }}</div>
            </div>
          </div>
          <h3 class="operate-title">记录模块</h3>
          <div class="centerDiv">
            <div v-for="val in recordData" :key="val.id" class="commandBtn" :class="!val.isEnable ? 'form-onlyread' : ''" @click="clickCommand(val)">
              <div class="commandIconDiv">
                <Icon v-if="val.isEnable" :icon="val.icon" class="icon" />
                <Icon v-if="!val.isEnable" :icon="val.iconEx" class="icon" />
              </div>
              <div class="text">{{ val.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="cont-mask" v-if="showMask"></div>
    </div>
    <div class="cont-rt">
      <div style="width: 100%; height: 100%" v-show="showWorkFlow">
        <div class="footer-topLine">
          <div class="footer-topLine-title">工艺路线:</div>
          <div>
            <Icon class="flowCardClose" :icon="'ic:baseline-zoom-' + pathZoomFlag + '-map'" size="20px" @click="changePathZoom" />
          </div>
        </div>
        <div class="workPathDiv">
          <WorkflowViewer ref="workflowViewer" />
        </div>
      </div>
      <!-- 切换工位 -->
      <div class="workPost" v-if="showWorkPost">
        <div class="workPost-title">请先选择工位</div>
        <SwichWorkPostModal @register="registerWorkPostModal" style="width: 80%; margin: 60px auto 0" @callback="switchWorkPostCallBack" />
      </div>
      <!-- 切换用户弹窗 -->
      <div class="workPost" v-if="showSwithUser">
        <div class="workPost-title">切换用户</div>
        <SwichUserModal @register="registerUserModal" @callback="switchUserCallBack" style="width: 80%; margin: 60px auto 0" />
      </div>
    </div>

    <WorkbenchModal @register="registerModal" @success="commandSuccess" @snfoucs="snfoucs" />
    <WorkbenchDrawer @register="registerDrawer" @success="commandSuccess" @snfoucs="snfoucs" />

    <!-- 扫描之后childWorkflowStationList不为空弹出选择框 -->
    <a-modal v-model:visible="scanVisible" :height="200" :centered="true" title="工序选择" @ok="hideModal">
      <div class="divLine">
        <div>并行工序：</div>
        <div><a-select v-model:value="scanInput" style="width: 180px" :options="options" /></div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" name="Workbench" setup>
  import { ref, computed, unref, provide, onMounted, nextTick, watch } from 'vue';
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
  import { formSchema } from './Workbench.data';
  // 引入自定义字体
  import '/@/assets/boardFont/font.css';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserWorkbenchStore } from '/@/store/modules/userWorkbench';
  import { defHttp } from '/@/utils/http/axios';

  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  const { getShowMenu } = useMenuSetting();
  const currentHeightscreen = ref(0);
  const currentFullScreen = computed(() => {
    console.log(unref(getShowMenu.value));
    return unref(getShowMenu.value);
  });
  watchWindowSize();
  window.addEventListener('resize', watchWindowSize);
  function watchWindowSize() {
    var h = document.documentElement.clientHeight;
    currentHeightscreen.value = h;
  }

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
  const [registerUserModal, { openModal: openSwitchUserModal }] = useModal();
  const [registerWorkPostModal, { openModal: openSwitchWorkPostModal }] = useModal();

  const userStore = useUserStore();
  const userStoreWorkbench = useUserWorkbenchStore();
  const $message = useMessage();

  const showTaskList = ref(false); // 显示列表，默认 true
  const taskList = ref(); // 任务列表数据
  const showTaskDetailIndex = ref(); // 显示任务详情的下标
  const TaskDetailIndex = ref(-1); //选中当前项
  const inputFlowCard = ref(); // 输入的流转卡
  const snList = ref([]); // 流转卡集合，点击任务时，获取流转卡集合
  const flowCardIndex = ref('');
  const pathZoomFlag = ref('out');
  const workflowViewer = ref();
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
    //if (!userStoreWorkbench.getUserInfo) {
    userStoreWorkbench.setUserInfo(userStore.getUserInfo);
    // }

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
            /**关闭选择工位弹出层 */
            switchWorkPostCallBack(infoData.value.wkpId);
            /**增加工位自动选择之后，焦点自动获取到扫描流转卡输入框 */
            searchSN.value && searchSN.value.focus();
          } else {
            // openSwitchWorkPostModal(true, {});
          }
        });
    } else {
      // openSwitchWorkPostModal(true, {});
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
  function getMoTaskList(type = 0) {
    if (!unref(infoData).wkpId || unref(infoData).wkpId === '') {
      $message.createMessage.warn('请先选择工位！');
      return;
    }

    //const parameters = { wkpId: unref(infoData).wkpId, moPlanId: moPlan.value?.moPlanId, text: seacrchInput.value };
    const parameters = { wkpId: unref(infoData).wkpId, text: seacrchInput.value, type: taskStatus.value };
    if (type == 0) {
      parameters['moPlanId'] = moPlan.value?.moPlanId;
    }
    getMoPlanTaskList(parameters).then((data) => {
      if (!unref(taskList)) {
        // 初始化工作路线
        setTimeout(workflowViewer.value.initLgicflow, 200);
        //默认展开任务列表
        showTaskList.value = false;
        //changeShowTaskList();
      }

      taskList.value = data;
    });
  }
  /**清空输入流转卡内容 */
  function clearFlowCard() {
    inputFlowCard.value = '';
    getScanData(2);
    searchSN.value && searchSN.value.focus();
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

  // 任务列表切换选择状态
  const taskStatus = ref('all');
  function shatusChange(type) {
    taskStatus.value = type;
    getMoTaskList(1);
  }

  const operateData = ref([]);
  const recordData = ref([]);
  /**刷新工作命令状态 */
  function refreshCommandEnable() {
    if (operateData.value.length != 0) {
      operateData.value = [];
      recordData.value = [];
    }
    commandListArr.map((item: any) => {
      //增加如果没有权限的话，直接不显示
      if (item.isAuth != 'Y') {
        return;
      }
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
      item.iconEx = item.icon.split('|')[0] + '-1|' + item.icon.split('|')[1];
      if (item.pageNumber == 1) {
        operateData.value.push(item);
      } else {
        recordData.value.push(item);
      }
    });
  }

  /**刷新工作命令 */
  refreshCommandList();

  /**
   * 隐藏显示任务列表
   */

  const currentHeight = ref(0);
  function changeShowTaskList() {
    showTaskList.value = !showTaskList.value;
    watchWindowSize();
    window.addEventListener('resize', watchWindowSize);
    function watchWindowSize() {
      nextTick(() => {
        currentHeight.value = window.innerHeight - document.getElementById('myElement')?.offsetTop;
      });
    }
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
    let str = /^[A-Za-z0-9-]+$/;
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

    let str = /^[A-Za-z0-9-]+$/;
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
  const visible = ref(true);
  function changePathZoom() {
    if (pathZoomFlag.value == 'out') {
      pathZoomFlag.value = 'in';
    } else {
      pathZoomFlag.value = 'out';
    }
    visible.value = !visible.value;
  }

  // 工作命令弹窗
  const clickCommand = (record) => {
    record.scanInfo = scanInfo.value;
    record.workPostId = infoData.value.wkpId;
    record.operateBy = userinfo.value.username;
    record.moPlan = moPlan.value;
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
  const showMask = ref(true);
  const showSwithUser = ref(false);
  function swithUser() {
    showSwithUser.value = true;
    showWorkFlow.value = false;
    showWorkPost.value = false;
    showMask.value = true;
  }

  /**
   * 用户切换回调
   */
  function switchUserCallBack() {
    showSwithUser.value = false;
    showWorkFlow.value = true;
    showWorkPost.value = false;
    showMask.value = false;
    refreshCommandList();
  }

  const showWorkFlow = ref(false);
  /**
   * 点击切换工位按钮
   */
  function switchWorkPost() {
    showSwithUser.value = false;
    showWorkFlow.value = false;
    showWorkPost.value = true;
    showMask.value = true;
    refreshCommandEnable();
  }

  /**
   * 工位切换回调
   * @param val 工位信息
   */
  const showWorkPost = ref(true);
  // 切换工位确认
  function switchWorkPostCallBack(val) {
    if (val) {
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
                  showSwithUser.value = false;
                  showWorkFlow.value = true;
                  showWorkPost.value = false;
                  showMask.value = false;
                }
              });
          }
          // 隐藏工位选择显示工艺线路
          showWorkFlow.value = true;
          /**增加选择工位之后，焦点自动获取到扫描流转卡输入框 */
          searchSN.value && searchSN.value.focus();
        });

      getMoTaskList();
      /**删除已扫描数据 */
      getScanData(2);
    } else {
      showSwithUser.value = false;
      showWorkFlow.value = true;
      showWorkPost.value = false;
      showMask.value = false;
    }
  }

  // 切换任务列表输入框
  const clickSearch = () => {
    console.log('clickSearch');
  };

  // 任务列表查询框查询事件
  function searchText() {
    getMoTaskList(1);
  }

  // const getfullScreen=()=>{
  //   let docelement = document.documentElement;
  //      if (docelement.requestFullscreen) {
  //       docelement.requestFullscreen();
  //       } else if (docelement.mozRequestFullScreen) {
  //         docelement.mozRequestFullScreen();
  //       } else if (docelement.msRequestFullscreen) {
  //         docelement.msRequestFullscreen();
  //       } else if (docelement.webkitRequestFullScreen) {
  //         docelement.webkitRequestFullScreen();
  //       }
  // }

  // onMounted(()=>{
  //   getfullScreen();
  // })
</script>

<style lang="less" scoped>
  @import url('Workbench.less');

  /*覆盖ant-design-vue 样式**/
  :deep(.ant-select-selector) {
    height: 40px !important;
    border-radius: 8px !important;
    line-height: 40px !important;
  }

  :deep(.ant-select-selection-search-input) {
    height: 40px !important;
    line-height: 40px !important;
  }

  :deep(.ant-select-selection-placeholder) {
    line-height: 40px !important;
  }

  :deep(.ant-col label) {
    color: #fff !important;
  }

  :deep(.ant-select-selection-item) {
    line-height: 40px !important;
  }
</style>
