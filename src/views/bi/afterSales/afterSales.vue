<template>
  <div class="afterSalesPage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 50 + 'px' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"><img src="./image/logo.png" alt="" /></p>
        <p class="title-info">物探数字化车间-售后看板</p>
      </div>
    </div>
    <div class="cont">
      <div class="map-charts">
        <div class="accumulate">
          <div class="decoration"><p>累计售后品</p></div>
          <div class="num-box">
            <div class="afterSales-num" v-for="(item, index) in afterSaleProTotal" :key="index">
              <p>{{ item }}</p>
            </div>
          </div>
        </div>
        <div style="width: 100%; height: calc(100% - 1.2rem)">
          <VisitSource style="width: 100%; height: 100%" />
        </div>
      </div>
      <div class="cont-lt">
        <div class="lt-top">
          <h3>年度售后故障现象统计</h3>
          <div class="fault-echarts">
            <fault style="width: 100%; height: 100%" :data="faultData" />
          </div>
        </div>
        <div class="lt-top">
          <h3>年度售后产品排行</h3>
          <div class="fault-echarts">
            <ranking style="width: 100%; height: 100%" :data="yearSalseRanking" />
          </div>
        </div>
      </div>
      <div class="cont-rt">
        <div class="rt-top">
          <h3>维修数量统计</h3>
          <div class="statistics-echarts">
            <div class="statistics-top">
              <div class="statistics-lt">
                <p class="jindu" style="margin-top: 0.25rem">24年进度</p>
                <p class="num">{{ repairData.annualSchedule }}%</p>
              </div>
              <div class="statistics-rt">
                <div class="echarts">
                  <statistics style="width: 100%; height: 100%" :data="statisticsData1" />
                </div>
                <div class="info">
                  <p><span class="color1">已修量</span>/维修量</p>
                  <p class="color1">{{ repairData.annualCompleted }}</p>
                  <p>{{ repairData.annualTotal }}</p>
                </div>
              </div>
            </div>
            <div class="statistics-top">
              <div class="statistics-lt">
                <p class="jindu" style="margin-top: 0.25rem">3月份进度</p>
                <p class="num">{{ repairData.monthlySchedule }}%</p>
              </div>
              <div class="statistics-rt">
                <div class="echarts">
                  <statistics style="width: 100%; height: 100%" :data="statisticsData2" />
                </div>
                <div class="info">
                  <p><span class="color2">已修量</span>/维修量</p>
                  <p class="color2">{{ repairData.monthlyCompleted }}</p>
                  <p>{{ repairData.monthlyTotal }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rt-top">
          <div class="center-title">
            <h3>年度售后信息</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>维修</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>体检</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon3"></p>
                <p>保养</p>
              </div>
            </div>
          </div>
          <div class="fault-echarts">
            <info style="width: 100%; height: 100%" :data="yearSalesInfo" />
          </div>
        </div>
        <div class="rt-top">
          <h3>年度售后维修计划</h3>
          <div class="fault-echarts">
            <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="afterSalesPage" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import VisitSource from './components/VisitSource.vue';
  import fault from './components/fault.vue';
  import ranking from './components/ranking.vue';
  import info from './components/info.vue';
  import statistics from './components/statistics.vue';
  import {
    afterSalesProducts,
    annualAfterSalesInfo,
    annualAfterSalesMaintenancePlan,
    faultPhenomenon,
    repairQuantity,
    cumulativeAfterSales,
  } from './afterSales.api';

  // 引入看板rem适配
  import '/@/utils/flexible.js';
  // 看板特殊字体
  import '/@/assets/boardFont/font.css';

  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
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

  // 年度售后排行
  const yearSalseRanking = ref([
    {
      name: 'YSDC(A)矿用电磁波随钻测量仪',
      value: 39,
    },
    {
      name: 'YZG3.7矿用钻孔轨迹测量仪',
      value: 22,
    },
    {
      name: 'YHZ90/360矿用本安型钻机开孔定向仪',
      value: 11,
    },
    {
      name: 'YTG37矿用推送式轨迹仪',
      value: 7,
    },
    {
      name: 'YCS2000A矿用瞬变电磁仪',
      value: 3,
    },
    {
      name: 'YTZ3-Z(B)矿用本安型地震仪',
      value: 1,
    },
    {
      name: 'YT120(B)矿用本安型音频电穿透仪',
      value: 1,
    },
  ]);
  // afterSalesProducts({}).then(res => {
  //     yearSalseRanking.value = res
  // })

  // 年度售后信息
  const yearSalesInfo = ref({
    xData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    inspectOrder: [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    maintainOrder: [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    repairOrder: [20, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });
  // annualAfterSalesInfo({}).then(res => {
  //     res.inspectOrder.forEach(item => {
  //         yearSalesInfo.value.xData.push(item.time)
  //         yearSalesInfo.value.inspectOrder.push(item.value)
  //     });
  //     res.maintainOrder.forEach(item => {
  //         yearSalesInfo.value.maintainOrder.push(item.value)
  //     });
  //     res.repairOrder.forEach(item => {
  //         yearSalesInfo.value.repairOrder.push(item.value)
  //     });
  // })

  // 售后维修计划
  const config = ref({
    header: [
      '<span style="color:#33FFFF;font-size:0.2rem;">仪器名称</span>',
      '<span style="color:#33FFFF;font-size:0.2rem;">售后订单</span>',
      '<span style="color:#33FFFF;font-size:0.2rem;">故障现象</span>',
      '<span style="color:#33FFFF;font-size:0.2rem;">设备返厂时间</span>',
    ],
    headerHeight: 30 * localStorage.remScale,
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
    columnWidth: [localStorage.remScale * 250, localStorage.remScale * 150, localStorage.remScale * 150, localStorage.remScale * 150],
    align: ['center', 'center', 'center', 'center'],
  });
  let afterSalesMaintenancePlanData = [
    {
      instrumentName: 'YSDC(A)矿用电磁波随钻测量仪',
      orderCode: 'SH20231114001',
      faultPhenomenon: '按键不灵',
      returnDate: '24.1.14',
    },
    {
      instrumentName: 'YSDC(A)矿用电磁波随钻测量仪',
      orderCode: 'SH20231114002',
      faultPhenomenon: '无法开机',
      returnDate: '24.1.14',
    },
    {
      instrumentName: 'YTG3.7推送式轨迹仪',
      orderCode: 'SH20231115001',
      faultPhenomenon: '探管断了',
      returnDate: '24.1.15',
    },
  ];
  annualAfterSalesMaintenancePlan({}).then((res) => {
    afterSalesMaintenancePlanData.forEach((item) => {
      config.value.data.push([
        '<span style="color:#fff;font-size:0.15rem;">' + item.instrumentName + '</span>',
        '<span style="color:#fff;font-size:0.15rem;">' + item.orderCode + '</span>',
        '<span style="color:#fff;font-size:0.15rem;">' + item.faultPhenomenon + '</span>',
        '<span style="color:#fff;font-size:0.15rem;">' + item.returnDate + '</span>',
      ]);
    });
    config.value = { ...config.value };
  });

  // 故障现象
  let testData = [
    {
      name: '开机故障',
      value: 31,
    },
    {
      name: '电源故障',
      value: 11,
    },
    {
      name: '通信故障',
      value: 9,
    },
    {
      name: '开关、按键故障',
      value: 3,
    },
    {
      name: '壳体损坏',
      value: 9,
    },
    {
      name: '显示故障',
      value: 0,
    },
    {
      name: '系统故障',
      value: 0,
    },
    {
      name: '电路板故障',
      value: 0,
    },
    {
      name: '防水故障',
      value: 2,
    },
    {
      name: '线、插故障',
      value: 18,
    },
    {
      name: '其他故障',
      value: 1,
    },
  ];
  const faultData = ref<any>({
    xData: [],
    yData: [],
  });
  testData.forEach((item) => {
    faultData.value.xData.push(item.name);
  });
  faultData.value.yData = testData;
  // faultPhenomenon({}).then(res => {
  //     res.forEach(item => {
  //         faultData.value.xData.push(item.name)
  //     });
  //     faultData.value.yData = res
  // })

  // 维修数量统计
  const repairData = ref({
    annualCompleted: 84,
    annualSchedule: 94,
    annualTotal: 79,
    monthlyCompleted: 28,
    monthlySchedule: 93.4,
    monthlyTotal: 30,
  });
  const statisticsData1 = ref({
    value: 94,
    color: ['#437FDB', '#33FFFF'],
    url: new URL(`./image/4.png`, import.meta.url).href,
  });
  const statisticsData2 = ref({
    value: 93.4,
    color: ['#FF7E3D', '#FAE087'],
    url: new URL(`./image/5.png`, import.meta.url).href,
  });
  // repairQuantity({}).then(res => {
  //     repairData.value = res
  //     statisticsData1.value.value = res.annualSchedule
  //     statisticsData2.value.value = res.monthlySchedule
  // })

  // 中间地图
  const mapData = ref([]);
  const afterSaleProTotal = ref('');
  cumulativeAfterSales({}).then((res) => {
    mapData.value = res.afterSaleProMapList;
    //afterSaleProTotal.value = res.afterSaleProTotal
    afterSaleProTotal.value = '84';
  });
</script>
<style scoped lang="less">
  @import url('afterSales.less');
</style>
