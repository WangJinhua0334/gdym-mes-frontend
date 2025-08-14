<template>
  <div class="intelligencePage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 0.625 + 'rem' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"
          ><!-- 添加工位选择下拉框 -->
          <select v-model="selectedWkpId" @change="onWorkStationChange" class="workstation-selector">
            <option v-for="(ws, index) in workStations" :key="index" :value="ws.id">{{ ws.code }}</option>
          </select></p
        >
        <p class="title-info">产线看板</p>
      </div>
    </div>
    <div class="cont">
      <div class="cont-lt">
        <div class="lt-top">
          <div class="center-title">
            <h3>当前流转卡信息</h3>
          </div>
          <div class="info-grid">
            <div class="column">
              <p><strong>流转卡号:</strong> {{ currentWorkStation.flowCardNumber }}</p>
              <p><strong>工单号:</strong> {{ currentWorkStation.workOrderNumber }}</p>
              <p><strong>产品编码:</strong> {{ currentWorkStation.productCode }}</p>
              <p><strong>产品型号:</strong> {{ currentWorkStation.productModel }}</p>
              <p><strong>日期:</strong> {{ currentWorkStation.date }}</p>
              <p><strong>作业员:</strong> {{ currentWorkStation.operator }}</p>
            </div>
            <div class="column">
              <p><strong>生产批次:</strong> {{ currentWorkStation.productionBatch }}</p>
              <p><strong>材料信息:</strong> {{ currentWorkStation.materialInfo }}</p>
              <p><strong>每托数:</strong> {{ currentWorkStation.perPallet }}</p>
              <p><strong>每箱数:</strong> {{ currentWorkStation.perBox }}</p>
              <p><strong>箱/托:</strong> {{ currentWorkStation.boxPerPallet }}</p>
              <p><strong>检验员:</strong> {{ userStore.getUserInfo.username }}</p>
              <!-- <p><strong>班次:</strong> {{ currentWorkStation.shift }}</p> -->
            </div>
          </div>
        </div>
        <div class="lt-bot">
          <div class="center-title">
            <h3>重量折线图</h3>
          </div>
          <div class="sales-echart">
            <sales style="width: 100%; height: 100%" :data="weightEcharts" />
          </div>
        </div>
      </div>
      <div class="cont-center">
        <div class="center-top">
          <div class="inproduction">
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ currentWorkStation.snQty }}</span
                >件</p
              >
              <p class="inproduction-title">计划数</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.inputQty }}</span
                >件</p
              >
              <p class="inproduction-title">投入数</p>
            </div>
          </div>
          <div class="inproduction">
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.outQty }}</span
                >件</p
              >
              <p class="inproduction-title">实际产量</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ currentWorkStation.snQty - productProgress.outQty }}</span
                >件</p
              >
              <p class="inproduction-title">剩余数量</p>
            </div>
          </div>
        </div>
        <div class="center-bot">
          <div class="center-title">
            <h3>高度折线图</h3>
          </div>
          <div class="sales-echart">
            <qualified style="width: 100%; height: 100%" :data="heightEcharts" />
          </div>
        </div>
      </div>
      <div class="cont-rt">
        <div class="rt-top">
          <h3>工位历史流转卡</h3>
          <div class="table">
            <ul class="table-list">
              <li>流转卡号</li>
              <li>工单号</li>
              <li>产品</li>
              <li>数量</li>
              <li>产出数</li>
            </ul>
            <div class="race-lamp-card"
              ><!--:style="{ height: showNum * .4375+'rem' }"-->
              <div class="horseLamp_list" :class="{ marquee_top: animate }">
                <div class="order-list" v-for="(item, index) in horseLampList" :key="index">
                  <div class="list">
                    <p>{{ item.moSn }}</p>
                    <p>{{ item.code }}</p>
                    <p>{{ item.prodId_dictText }}</p>
                    <p>{{ item.totalQty }}</p>
                    <p>{{ item.completedQty }}</p>
                  </div>
                  <div class="list-progress">
                    <Progress
                      :percent="item.percentage"
                      style="width: 100%; height: 0.1rem; line-height: 0.3125rem"
                      :stroke-color="{ '0%': '#437FDB', '100%': '#33FFFF' }"
                      trailColor="rgba(67,127,219,0.26)"
                    >
                      <template #format="percent">
                        <span class="percent-num" style="color: #ffa070">{{ percent }}%</span>
                      </template>
                    </Progress>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rt-bot">
          <div class="center-title">
            <h3>包装信息</h3>
          </div>
          <div class="bot-sales">
            <div class="info-item">
              <div class="field">
                <span class="label">包装规则：</span>
                <input type="text" v-model="values.packRule" readonly disabled />
              </div>
              <div class="field">
                <span class="label">包装托号：</span>
                <input type="number" v-model="values.mesSnNum" readonly disabled />
              </div>
            </div>
            <div class="info-item">
              <div class="field">
                <span class="label">已包数量：</span>
                <input type="number" v-model="values.completeQty" readonly disabled />
              </div>
              <div class="field">
                <span class="label">未包数量：</span>

                <input type="number" v-model="values.itemQty" readonly disabled />
              </div>
            </div>
            <div class="info-item">
              <div class="field">
                <span class="label">托号：</span>
                <input type="number" v-model="values.snNum" />
              </div>
              <div class="field">
                <span class="label">箱号：</span>
                <input type="number" v-model="values.packNum" />
              </div>
            </div>
            <div class="info-item">
              <div class="field">
                <span class="label">包装数量：</span>
                <input type="number" v-model="values.packQty" />
              </div>
              <div class="field">
                <span class="label"></span>
                <button id="printLabelBtn" @click="doPack">打印标签</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="intelligencePage" setup>
  import { ref, computed, unref, onUnmounted } from 'vue';
  import { Progress } from 'ant-design-vue';
  import qualified from './components/qualified.vue';
  import sales from './components/sales.vue';
  import { getWkpList, getMesMoSnData, getScadaData, getScadaWeight, getScadaheight, productionList, scranPack, pack } from './prodBoard.api';
  // 引入看板rem适配
  import '/@/utils/flexible.js';
  // 看板特殊字体
  import '/@/assets/boardFont/font.css';

  // 实时监听窗口高度
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useUserStore } from '/@/store/modules/user';
  import { defHttp } from '/@/utils/http/axios';
  import { loopPrintJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { useMessage } from '/@/hooks/web/useMessage';

  const $message = useMessage();

  const userStore = useUserStore();
  const { getShowMenu } = useMenuSetting();
  const currentHeight = ref(0);
  const currentFullScreen = computed(() => {
    return unref(getShowMenu.value);
  });
  watchWindowSize();
  window.addEventListener('resize', watchWindowSize);
  function watchWindowSize() {
    var h = document.documentElement.clientHeight;
    currentHeight.value = h;
  }

  const selectedWkpId = ref(''); // 当前选中的工位
  const workStations = ref([]); //工位信息
  const times = 8000;
  // 示例数据
  const currentWorkStation = ref({
    flowCardNumber: '',
    workOrderNumber: '',
    productCode: '',
    productModel: '',
    operator: '',
    date: '',
    productionBatch: '',
    materialInfo: '',
    perPallet: 0,
    perBox: 0,
    boxPerPallet: 0,
    shift: '',
    snQty: 0,
  });
  const values = ref({
    packNum: 0,
    packQty: 0,
    packRule: '',
    snNum: 0,
    completeQty: 0,
    qty: 0,
    mesSnNum: 0,
    itemQty: 0,
    wkpId: '',
    isBatch: 'N',
    lotSn: '',
  });
  const productProgress = ref({
    inputQty: 0,
    outQty: 0,
    boxQty: 0,
  });
  const weightEcharts = ref({
    Xdata: [],
    weightData: [],
  });
  const heightEcharts = ref({
    Xdata: [],
    heightData: [],
  });
  weightEcharts.value.Xdata.push('1');
  weightEcharts.value.weightData.push('0');
  heightEcharts.value.Xdata.push('1');
  heightEcharts.value.heightData.push('0');

  // 在产列表
  const horseLampList = ref([]);
  const packList = ref([]);
  const animate = ref(false);

  getWkpList({}).then((res) => {
    workStations.value = res;
  });

  // 定义多个 timerId 变量
  let scadaTimerId = null;
  let heightTimerId = null;
  let weightTimerId = null;
  let productTimerId = null;
  let packTimerId = null;

  //值改变触发事件
  function onWorkStationChange() {
    // ✅ 先清除所有定时器
    if (scadaTimerId) clearTimeout(scadaTimerId);
    if (heightTimerId) clearTimeout(heightTimerId);
    if (weightTimerId) clearTimeout(weightTimerId);
    if (productTimerId) clearTimeout(productTimerId);
    if (packTimerId) clearTimeout(packTimerId);

    getMesMoSnDataTimer();
    productionListTimer();
    getScadaDataTimer();
    getScadaheightTimer();
    getScadaWeightTimer();
    getPackListTimer();
  }

  onUnmounted(() => {
    if (scadaTimerId) clearTimeout(scadaTimerId);
    if (heightTimerId) clearTimeout(heightTimerId);
    if (weightTimerId) clearTimeout(weightTimerId);
    if (productTimerId) clearTimeout(productTimerId);
    if (packTimerId) clearTimeout(packTimerId);
  });
  // 流转卡信息
  function getMesMoSnDataTimer() {
    getMesMoSnData({ wkpId: selectedWkpId.value }).then((res) => {
      currentWorkStation.value.flowCardNumber = res?.sn;
      currentWorkStation.value.workOrderNumber = res?.moCode;
      currentWorkStation.value.productCode = res?.prodCode;
      currentWorkStation.value.productModel = res?.prodSpec;
      currentWorkStation.value.operator = res?.wokers;
      currentWorkStation.value.date = res?.date;
      currentWorkStation.value.productionBatch = res?.batch;
      currentWorkStation.value.materialInfo = res?.material;
      currentWorkStation.value.perPallet = res?.torrNum;
      currentWorkStation.value.perBox = res?.boxNum;
      currentWorkStation.value.boxPerPallet = res?.torrBox;
      currentWorkStation.value.shift = res?.shift;
      currentWorkStation.value.snQty = res?.snQty;

      //setTimeout(getMesMoSnDataTimer, times);
    });
  }
  //包装信息
  function getPackListTimer() {
    if (currentWorkStation.value.flowCardNumber == null || currentWorkStation.value.flowCardNumber == '') {
      productTimerId = setTimeout(getPackListTimer, times);
      return;
    }
    scanSN(currentWorkStation.value.flowCardNumber);
    // getPackList({
    //   wkpId: selectedWkpId.value,
    // }).then((res) => {
    //   packList.value = res;
    //   packTimerId = setTimeout(getPackListTimer, times);
    // });
  }
  // 历史流转卡信息
  function productionListTimer() {
    if (productTimerId) clearTimeout(productTimerId);
    productionList({
      wkpId: selectedWkpId.value,
    }).then((res) => {
      horseLampList.value = res;
      productTimerId = setTimeout(productionListTimer, times);
    });
  }

  // 查询数据采集数据
  function getScadaDataTimer() {
    if (scadaTimerId) clearTimeout(scadaTimerId); // 清除旧定时器

    getScadaData({
      wkpId: selectedWkpId.value,
    }).then((res) => {
      productProgress.value.inputQty = res.inputQty;
      productProgress.value.outQty = res.outQty;
      productProgress.value.boxQty = res.boxQty;

      scadaTimerId = setTimeout(getScadaDataTimer, times);
    });
  }
  // 查询高度折线图
  function getScadaheightTimer() {
    if (heightTimerId) clearTimeout(heightTimerId); // 清除旧定时器

    getScadaheight({
      wkpId: selectedWkpId.value,
    }).then((res) => {
      heightEcharts.value.Xdata = [];
      heightEcharts.value.heightData = [];
      res.forEach((item) => {
        heightEcharts.value.Xdata.push(item.countNum);
        heightEcharts.value.heightData.push(item.value);
      });

      heightTimerId = setTimeout(getScadaheightTimer, times);
    });
  }
  // 查询重量折线图
  function getScadaWeightTimer() {
    if (weightTimerId) clearTimeout(weightTimerId); // 清除旧定时器
    getScadaWeight({
      wkpId: selectedWkpId.value,
    }).then((res) => {
      weightEcharts.value.Xdata = [];
      weightEcharts.value.weightData = [];
      res.forEach((item) => {
        weightEcharts.value.Xdata.push(item.countNum);
        weightEcharts.value.weightData.push(item.value);
      });

      weightTimerId = setTimeout(getScadaWeightTimer, times);
    });
  }
  async function scanSN(sn) {
    scranPack({
      sn: sn,
    })
      .then((res) => {
        if (res.lotSn) {
          console.log(res);
          values.value.completeQty = res.completeQty;
          values.value.mesSnNum = res.snNum;
          values.value.packNum = res.packNum;
          values.value.packQty = res.packQty;
          values.value.packRule = res.packRule;
          values.value.snNum = res.snNum;
          values.value.qty = res.qty;
          values.value.itemQty = res.qty - res.completeQty;
        }
        packTimerId = setTimeout(getPackListTimer, times);
      })
      .catch((err) => {});
  }
  // 包装
  async function doPack() {
    values.value.wkpId = selectedWkpId.value;
    values.value.lotSn = currentWorkStation.value.flowCardNumber;
    if (selectedWkpId.value == null || selectedWkpId.value == '') {
      $message.createMessage.warning('请选择工位信息!');
      return;
    }
    if (currentWorkStation.value.flowCardNumber == null || currentWorkStation.value.flowCardNumber == '') {
      $message.createMessage.warning('该工位没有绑定流转卡任务!');
      return;
    }
    //提交表单
    await pack(values.value).then((res) => {
      if (!unref(res)) {
        return;
      }
      console.log(res);
      const ids = Object.keys(res);
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: ids.join(','), type: 'pack_sn' },
        })
        .then(async (reportRs) => {
          // 打印数据集 { reportId, parameters }
          const printSet: any = {};
          const templateIds = Object.keys(reportRs);
          for (const templateId of templateIds) {
            const reportId = reportRs[templateId];
            printSet[reportId] = { id: `${res[templateId].join(',')}` };
          }
          loopPrintJimuReport(printSet, getToken, () => {});
        });
    });
  }
</script>
<style scoped lang="less">
  @import url('prodBoard.less');
  .intelligencePage .cont .cont-rt .rt-bot .bot-sales {
    width: 100%;
    height: calc(90% - 0.425rem);
  }
  .bot-sales {
    width: 100%;
    height: 100%;
    color: white; /* 白色字体 */
    font-size: 20px; /* 字体放大 */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
  }

  /* 信息项容器：每行显示两个 */
  .info-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* 项目间距 */
  }

  /* 每个 info-item 占一行，但内部元素并排 */
  .info-item {
    display: flex;
    flex-direction: row; /* 改为水平排列 */
    gap: 10px; /* 两个 field 之间的间距 */
  }

  /* 每个 field 占一半宽度 */
  .field {
    flex: 1; /* 平分宽度 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 6px;
  }

  /* label 右对齐 */
  .label {
    text-align: right;
    flex: 1; /* 占据剩余空间 */
  }

  /* value 左对齐 */
  .value {
    width: 140px;
    text-align: left;
    flex: 1;
    margin-left: 10px;
  }

  /* 输入框样式保持不变 */
  input {
    width: 140px;
    padding: 5px;
    border: none;
    border-radius: 4px;
    background-color: white;
    color: black;
  }

  /* 按钮样式保持不变 */
  button {
    width: 140px;
    padding: 10px 20px;
    font-size: 18px;
    background-color: #0056b3;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #004080;
  }
</style>
