<template>
  <div class="intelligencePage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 0.625 + 'rem' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"><img src="./image/logo.png" alt="" /></p>
        <p class="title-info">物探数字化车间智能管控平台</p>
      </div>
    </div>
    <div class="cont">
      <div class="cont-lt">
        <div class="lt-top">
          <h3>本月数据统计</h3>
          <div class="statistics-echarts">
            <VisitSource style="flex: 1; height: 100%" :data="echarts1" />
            <VisitSource style="flex: 1; height: 100%" :data="echarts2" />
            <VisitSource style="flex: 1; height: 100%" :data="echarts3" />
          </div>
        </div>
        <div class="lt-center">
          <div class="center-title">
            <h3>一次出厂检验合格率</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>95%以上</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>0-95%</p>
              </div>
            </div>
          </div>
          <div class="statistics-echarts">
            <qualified style="width: 100%; height: 90%" :data="qualifiedData" />
            <p class="echarts-title">一次出厂检验合格率</p>
          </div>
        </div>
        <div class="lt-bot">
          <h3>本月在产列表</h3>
          <div class="table">
            <ul class="table-list">
              <li>序列号/SN</li>
              <li>订单号</li>
              <li>生产状态</li>
              <li>产品名称</li>
              <li>计划起止时间</li>
            </ul>
            <div class="race-lamp-card"><!--:style="{ height: showNum * .4375+'rem' }"-->
              <div class="horseLamp_list" :class="{ marquee_top: animate }">
                <div class="order-list" v-for="(item, index) in horseLampList" :key="index">
                  <div class="list">
                    <p>{{ item.moSn }}</p>
                    <p>{{ item.code }}</p>
                    <p>{{ item.status_dictText }}</p>
                    <p>{{ item.prodId_dictText }}</p>
                    <p>{{ item.startTime }}</p>
                  </div>
                  <div class="list-progress">
                    <Progress
                      :percent="item.percentage"
                      style="width: 100%; height: 0.1rem;line-height: .3125rem;"
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
      <div class="cont-center">
        <div class="center-top">
          <div class="top-progress">
            <div class="progress-item-lt">
              <p class="item-time time-lt">年</p>
              <p class="year-progress">本年生产进度</p>
              <div class="numerical-value">
                <div class="value-box" v-if="productProgress.currentYearProgressRate != 0">
                  <div class="value-border" v-for="(item, index) in productProgress.currentYearProgressRateStr" :key="index">
                    <p>{{ item }}</p>
                  </div>
                </div>
                <div class="value-border1" v-if="productProgress.currentYearProgressRate == 0">
                  <p>0</p>
                </div>
                <div class="value-border1">
                  <p>%</p>
                </div>
              </div>
              <div class="finish-progress">
                <Progress
                  :percent="productProgress.currentYearProgressRate"
                  style="width: 100%; height: 100%"
                  :show-info="false"
                  :stroke-color="{ '0%': '#437FDB', '100%': '#33FFFF' }"
                  trailColor="rgba(67,127,219,0.26)"
                />
                <div class="finish-num">
                  <p
                    >完成数量 <span class="color1">{{ productProgress.currentYeaCompletedCount }}</span></p
                  >
                  <p
                    >计划数量 <span class="color2">{{ productProgress.currentYeaCount }}</span></p
                  >
                </div>
              </div>
            </div>
            <div class="progress-item-rt">
              <p class="item-time time-rt">月</p>
              <p class="year-progress">本月生产进度</p>
              <div class="numerical-value">
                <div class="value-box" v-if="productProgress.currentMonthProgressRate != 0">
                  <div class="value-border" v-for="(item, index) in productProgress.currentMonthProgressRateStr" :key="index">
                    <p>{{ item }}</p>
                  </div>
                </div>
                <div class="value-border1" v-if="productProgress.currentMonthProgressRate == 0">
                  <p>0</p>
                </div>
                <div class="value-border1">
                  <p>%</p>
                </div>
              </div>
              <div class="finish-progress">
                <Progress
                  :percent="productProgress.currentMonthProgressRate"
                  style="width: 100%; height: 100%"
                  :show-info="false"
                  :stroke-color="{ '0%': '#437FDB', '100%': '#33FFFF' }"
                  trailColor="rgba(67,127,219,0.26)"
                />
                <div class="finish-num">
                  <p
                    >完成数量 <span class="color1">{{ productProgress.currentMonthCompletedCount }}</span></p
                  >
                  <p
                    >计划数量 <span class="color2">{{ productProgress.currentMonthCount }}</span></p
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="inproduction">
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.numberProcess }}</span
                >套</p
              >
              <p class="inproduction-title">在制产品数</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.averageProductionCycle }}</span
                >天</p
              >
              <p class="inproduction-title">最长工单生产时间</p>
            </div>
            <div class="inproduction-item">
              <p class="inproduction-num"
                ><span>{{ productProgress.numberProductsProduction }}</span
                >张</p
              >
              <p class="inproduction-title">在产工单数</p>
            </div>
          </div>
        </div>
        <div class="center-bot">
          <div class="center-title">
            <h3>本月生产统计图</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>计划完成数量</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>实际完成数量</p>
              </div>
            </div>
          </div>
          <div class="statistics-echart">
            <statistics style="width: 100%; height: 100%" :data="productData" />
          </div>
        </div>
      </div>
      <div class="cont-rt">
        <div class="rt-top">
          <h3>本周设备运行情况</h3>
          <div class="runing-situation">
            <P class="run-mark" />
            <div class="runing">
              <div class="run run1">
                <p>25%</p>
              </div>
              <div class="run run2">
                <p>5%</p>
              </div>
              <div class="run run3">
                <p>2.5%</p>
              </div>
              <div class="run run4">
                <p>67%</p>
              </div>
              <div class="run run5">
                <p>0.5%</p>
              </div>
            </div>
            <div class="runing-info">
              <div class="line-info color1">
                <p class="line"></p>
                <p class="dian"></p>
                <p class="time">运行时间</p>
                <p class="time">{{ equiment.operationTime }}h</p>
              </div>
              <div class="line-info color2">
                <p class="line"></p>
                <p class="dian"></p>
                <p class="time">调试时间</p>
                <p class="time">{{ equiment.debuggingTime }}h</p>
              </div>
              <div class="line-info color3">
                <p class="line"></p>
                <p class="dian"></p>
                <p class="time">待机时间</p>
                <p class="time">{{ equiment.standbyTime }}h</p>
              </div>
              <div class="line-info color5">
                <p class="line"></p>
                <p class="dian"></p>
                <p class="time">报警时间</p>
                <p class="time">{{ equiment.alarmTime }}h</p>
              </div>
              <div class="line-info color4">
                <p class="line"></p>
                <p class="dian"></p>
                <p class="time">离线时间</p>
                <p class="time">{{ equiment.offlineTime }}h</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rt-bot">
          <div class="center-title">
            <h3>全年售后统计</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>计划维修数量</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>实际维修数量</p>
              </div>
            </div>
          </div>
          <div class="bot-sales">
            <div class="sales-box">
              <div class="sales-item">
                <div class="sales-icon">
                  <p class="p1"></p>
                </div>
                <div class="sales-info">
                  <p class="sales-finsh">本年完成</p>
                  <p class="sales-num">{{ annualList.thisYear }}<span>台</span></p>
                </div>
              </div>
              <div class="sales-item">
                <div class="sales-icon">
                  <p class="p2"></p>
                </div>
                <div class="sales-info">
                  <p class="sales-finsh">本月已修</p>
                  <p class="sales-num">{{ annualList.thisMonth }}<span>台</span></p>
                </div>
              </div>
              <div class="sales-item">
                <div class="sales-icon">
                  <p class="p3"></p>
                </div>
                <div class="sales-info">
                  <p class="sales-finsh">维修最长时间</p>
                  <p class="sales-num">{{ annualList.avgAging }}<span>天</span></p>
                </div>
              </div>
            </div>
            <div class="sales-echart">
              <sales style="width: 100%; height: 100%" :data="annualEcharts" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="intelligencePage" setup>
  import { ref, computed, unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { Progress } from 'ant-design-vue';
  import VisitSource from './components/VisitSource.vue';
  import qualified from './components/qualified.vue';
  import statistics from './components/statistics.vue';
  import sales from './components/sales.vue';
  import {
    annualAfterSalesService,
    monthMoStats,
    monthProductionList,
    monthProductionStatistics,
    productPercentPass,
    productionSchedule,
    weekEquipmentRunTime,
  } from './intelligence.api';
  // 引入看板rem适配
  import '/@/utils/flexible.js';
  // 看板特殊字体
  import '/@/assets/boardFont/font.css';

  // 实时监听窗口高度
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

  // 全年售后
  const annualList = ref({
    avgAging: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const annualEcharts = ref({
    Xdata: [],
    actual: [],
    plan: [],
  });
  annualAfterSalesService({}).then((res) => {
    // annualList.value.avgAging = res.avgAging ? res.avgAging : 0;
    // annualList.value.thisMonth = res.thisMonth ? res.thisMonth : 0;
    // annualList.value.thisYear = res.thisYear ? res.thisYear : 0;
    annualList.value.avgAging = 1;
    annualList.value.thisMonth = 28;
    annualList.value.thisYear = 82;
    // res.items.forEach((val) => {
    //   annualEcharts.value.Xdata.push(val.month);
    //   annualEcharts.value.actual.push(val.actual);
    //   annualEcharts.value.plan.push(val.plan);
    // });
    annualEcharts.value.Xdata.push('1');
    annualEcharts.value.actual.push('31');
    annualEcharts.value.plan.push('31');
    annualEcharts.value.Xdata.push('2');
    annualEcharts.value.actual.push('5');
    annualEcharts.value.plan.push('8');
    annualEcharts.value.Xdata.push('3');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('4');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('5');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('6');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('7');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('8');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('9');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('10');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('11');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
    annualEcharts.value.Xdata.push('12');
    annualEcharts.value.actual.push('0');
    annualEcharts.value.plan.push('0');
  });

  // 本月数据统计
  const echarts1 = ref({
    name: '开工率',
    color: '#33FFFF',
    data: '92',
  });
  const echarts2 = ref({
    name: '计划准时入库率',
    color: '#FF8F57',
    data: '95',
  });
  const echarts3 = ref({
    name: '完工率',
    color: '#57FF84',
    data: '95',
  });
  monthMoStats({}).then((res) => {
    // echarts1.value.data = res.operatingRate;
    // echarts2.value.data = res.plannedStorageRate;
    // echarts3.value.data = res.completionRate;
    echarts1.value.data = '92';
    echarts2.value.data = '95';
    echarts3.value.data = '95';
  });

  // 本月在产列表
  const horseLampList = ref([]);
  const pageNo = ref(1);
  const animate = ref(false);
  const showNum = ref(4);
  monthProductionList({
    pageNo: pageNo.value,
    pageSize: 10,
  }).then((res) => {
    //horseLampList.value = res.records;
    const arr = [];
    arr.push({
      moSn: 'CD20244700102',
      code: '1000019752',
      startTime: '2024.01.17',
      prodId_dictText: 'YZG3.7矿用钻孔轨迹测量仪(Ф73)',
      status_dictText: '生产中',
      percentage: 95,
    });
    arr.push({
      moSn: 'CD20244700103',
      code: '1000021357',
      startTime: '2024.02.01',
      prodId_dictText: 'YZG3.7矿用钻孔轨迹测量仪(Ф50)',
      status_dictText: '生产中',
      percentage: 98,
    });
    arr.push({
      moSn: 'CD20244700104',
      code: '1000021376',
      startTime: '2024.01.12',
      prodId_dictText: 'YCSZ矿用钻孔瞬变电磁仪',
      status_dictText: '生产中',
      percentage: 72,
    });
    arr.push({
      moSn: 'CD20244700105',
      code: '1000022987',
      startTime: '2024.01.07',
      prodId_dictText: 'KJ117-F(A)矿用本安型水文监测分站',
      status_dictText: '生产中',
      percentage: 13,
    });
    arr.push({
      moSn: 'CD20244700106',
      code: '1000020517',
      startTime: '2024.01.24',
      prodId_dictText: 'YT120(B)矿用本安型音频电穿透仪',
      status_dictText: '生产中',
      percentage: 89,
    });

    horseLampList.value = arr;
  });
  setInterval(() => {
    showMarquee();
  }, 5000);

  function showMarquee() {
    if (horseLampList.value.length > 4) {
      animate.value = true;
      horseLampList.value.push(horseLampList.value[0]);
      setTimeout(() => {
        horseLampList.value.shift();
        animate.value = false;
      }, 5000);
    }
  }

  // 本月生产统计
  const productData = ref({
    Xdata: [],
    actualCount: [],
    planCount: [],
  });
  monthProductionStatistics({}).then((res) => {
    // res.forEach((item) => {
    //   productData.value.Xdata.push(item.name);
    //   productData.value.actualCount.push(item.actualCount);
    //   productData.value.planCount.push(item.planCount);
    // });
    productData.value.Xdata.push('YZG3.7矿用钻孔轨迹测量仪');
    productData.value.actualCount.push('100');
    productData.value.planCount.push('100');
    productData.value.Xdata.push('YZG3.7(50)矿用钻孔轨迹测量仪');
    productData.value.actualCount.push('100');
    productData.value.planCount.push('100');
    productData.value.Xdata.push('YCSZ矿用钻孔瞬变电磁仪');
    productData.value.actualCount.push('5');
    productData.value.planCount.push('9');
    productData.value.Xdata.push('KJ117-F(A)矿用本安型水文监测分站');
    productData.value.actualCount.push('59');
    productData.value.planCount.push('71');
    productData.value.Xdata.push('YT120(B)矿用本安型音频电穿透仪');
    productData.value.actualCount.push('1');
    productData.value.planCount.push('5');
  });

  // 一次出厂检验合格率
  const qualifiedData = ref([]);
  productPercentPass({}).then((res) => {
    //qualifiedData.value = res;
    const arr = [];
    arr.push({ name: 'KJ117-F(A)矿用本安型水文监测分站', value: '95' });
    arr.push({ name: 'YHZ90/360矿用本安型钻机开孔定向仪', value: '100' });
    arr.push({ name: 'YTG3.7矿用推送式轨迹仪', value: '98' });
    arr.push({ name: 'YCSZ矿用钻孔瞬变电磁仪', value: '96' });
    arr.push({ name: 'ZDJ11-Z(A)矿用本安型电法监测装置主机', value: '100' });
    qualifiedData.value = arr;
  });

  // 生产进度
  const productProgress = ref({});
  productionSchedule({}).then((res) => {
    // console.log(res);
    // productProgress.value = res;
    // productProgress.value.currentYearProgressRateStr = res.currentYearProgressRate.toString();
    // productProgress.value.currentMonthProgressRateStr = res.currentMonthProgressRate.toString();
    productProgress.value['currentYearProgressRate'] = 97.64;
    productProgress.value['currentYearProgressRateStr'] = '97.64';
    productProgress.value['currentYeaCompletedCount'] = 953;
    productProgress.value['currentYeaCount'] = 976;
    productProgress.value['currentMonthProgressRate'] = 81.03;
    productProgress.value['currentMonthProgressRateStr'] = '81.03';
    productProgress.value['currentMonthCompletedCount'] = 47;
    productProgress.value['currentMonthCount'] = 58;
    productProgress.value['numberProcess'] = 81;
    productProgress.value['averageProductionCycle'] = 20;
    productProgress.value['numberProductsProduction'] = 13;
  });

  // 本周设备运行情况
  const equiment = ref({});
  weekEquipmentRunTime({}).then((res) => {
    //console.log(res);
    //equiment.value = res;
    equiment.value['operationTime'] = 8;
    equiment.value['debuggingTime'] = 1.4;
    equiment.value['standbyTime'] = 0.7;
    equiment.value['alarmTime'] = 0.1;
    equiment.value['offlineTime'] = 20.8;
  });
</script>
<style scoped lang="less">
  @import url('intelligence.less');
</style>
