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
            <!-- <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.averageProductionCycle }}</span
                >mm</p
              >
              <p class="inproduction-title">高度</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.numberProductsProduction }}</span
                >g</p
              >
              <p class="inproduction-title">重量</p>
            </div> -->
          </div>
          <!-- <div class="inproduction">
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.numberProcess }}</span
                >件</p
              >
              <p class="inproduction-title">高度不良品</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.averageProductionCycle }}</span
                >件</p
              >
              <p class="inproduction-title">重量不良品</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.numberProductsProduction }}</span
                >件</p
              >
              <p class="inproduction-title">手检不良品</p>
            </div>
          </div> -->
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
            <div class="table">
              <ul class="table-list">
                <li>流转卡号</li>
                <li>箱号</li>
                <li>产品</li>
                <li>批次</li>
                <li>包装数</li>
              </ul>
              <div class="race-lamp-card"
                ><!--:style="{ height: showNum * .4375+'rem' }"-->
                <div class="horseLamp_list" :class="{ marquee_top: animate }">
                  <div class="order-list" v-for="(item, index) in packList" :key="index">
                    <div class="list">
                      <p>{{ item.lotSn }}</p>
                      <p>{{ item.packNum }}</p>
                      <p>{{ item.prodId_dictText }}</p>
                      <p>{{ item.batch }}</p>
                      <p>{{ item.qty }}</p>
                    </div>
                    <div class="list-progress">
                      <Progress
                        :percent="(item.qty /item.packQty ) * 100"
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
  import { getWkpList, getMesMoSnData, getScadaData, getScadaWeight, getScadaheight, productionList, getPackList } from './prodBoard.api';
  // 引入看板rem适配
  import '/@/utils/flexible.js';
  // 看板特殊字体
  import '/@/assets/boardFont/font.css';

  // 实时监听窗口高度
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useUserStore } from '/@/store/modules/user';

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
    getPackList({
      wkpId: selectedWkpId.value,
    }).then((res) => {
      packList.value = res;

      packTimerId = setTimeout(getPackListTimer, times);
    });
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
</script>
<style scoped lang="less">
  @import url('prodBoard.less');
</style>
