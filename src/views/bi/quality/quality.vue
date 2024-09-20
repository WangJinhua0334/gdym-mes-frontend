<template>
  <div class="qualityPage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 50 + 'px' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"><img src="./image/logo.png" alt="" /></p>
        <p class="title-info" @click="toggleBoard">物探数字化车间-质量看板</p>
      </div>
    </div>
    <div class="cont">
      <div class="cont-lt">
        <div class="lt-top">
          <h3>产线一次合格率</h3>
          <a-carousel style="width: 100%; height: 80%">
            <div>
              <div class="statistics-echarts">
                <div style="padding: 0.25rem 0">
                  <p class="parameter" style="font-size: 0.15rem">YJSY(DW)水文遥测仪</p>
                  <p class="parameter-num"
                    ><span style="font-size: 0.305rem">{{ passRate.csclyQualifiedRate }}</span
                    >%</p
                  >
                </div>
                <div style="padding: 0.25rem 0">
                  <p class="parameter" style="font-size: 0.15rem">YHZ90/360矿用本安型钻机开孔定向仪</p>
                  <p class="parameter-num"
                    ><span style="font-size: 0.305rem">{{ passRate.kjdzyQualifiedRate }}</span
                    >%</p
                  >
                </div>
                <div style="padding: 0.25rem 0">
                  <p class="parameter" style="font-size: 0.15rem">YTG3.7矿用推送式轨迹仪</p>
                  <p class="parameter-num"
                    ><span style="font-size: 0.305rem">{{ passRate.qkgjyQualifiedRate }}</span
                    >%</p
                  >
                </div>
                <div style="padding: 0.25rem 0">
                  <p class="parameter" style="font-size: 0.15rem">YSDC(A)矿用电磁波随钻测量仪(D89气动)</p>
                  <p class="parameter-num"
                    ><span style="font-size: 0.305rem">{{ passRate.ypdctyQualifiedRate }}</span
                    >%</p
                  >
                </div>
                <div style="padding: 0.25rem 0">
                  <p class="parameter" style="font-size: 0.15rem">KJ117-F(A)矿用本安型水文监测分站</p>
                  <p class="parameter-num"
                    ><span style="font-size: 0.305rem">{{ passRate.zkcxyQualifiedRate }}</span
                    >%</p
                  >
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
        <div class="lt-center">
          <div class="center-title">
            <h3>月产量合格率</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>合格率</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>月产量</p>
              </div>
            </div>
          </div>
          <div class="statistics-echarts">
            <VisitSource style="width: 100%; height: 100%" :data="qualified" />
          </div>
        </div>
        <div class="lt-bot">
          <div class="center-title">
            <h3>年度产品类别合格数</h3>
            <div class="statistics-status">
              <div class="status-item">
                <p class="status-icon status-icon1"></p>
                <p>不合格</p>
              </div>
              <div class="status-item">
                <p class="status-icon status-icon2"></p>
                <p>合格数</p>
              </div>
            </div>
          </div>
          <div class="table">
            <div class="table-list" v-for="(product, index) in productCategory" :key="index">
              <p class="qualified-progress qualified-progress1">
                <Progress
                  :percent="product.ngQty"
                  style="width: 100%; height: 0.1rem"
                  :stroke-color="{ '0%': '#FF7E3D', '100%': '#FAE087' }"
                  trailColor="rgba(67,127,219,0.26)"
                  :show-info="false"
                />
                <span class="percent-num" style="transform: rotateY(180deg)">{{ product.ngQty }}</span>
              </p>
              <p class="qualified-title">{{ product.productCate }}</p>
              <p class="qualified-progress">
                <Progress
                  :percent="product.okQty"
                  style="width: 100%; height: 0.1rem"
                  :stroke-color="{ '0%': '#437FDB', '100%': '#33FFFF' }"
                  trailColor="rgba(67,127,219,0.26)"
                  :show-info="false"
                />
                <span class="percent-num">{{ product.okQty }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="cont-center">
        <div class="center-top">
          <div class="top-item" :class="'top-item' + (index + 1)" v-for="(qualified, index) in qualifiedInfo" :key="index">
            <p class="item-value">{{ qualified.value }}</p>
            <p class="item-title">{{ qualified.title }}</p>
          </div>
          <div class="hegelv">
            <p class="hegelv1">本月合格率</p>
            <p class="hegelv2"
              ><span>{{ monthParess }}</span
              >%</p
            >
          </div>
        </div>
        <div class="center-bot">
          <div class="center-title">
            <h3>不良产品列表</h3>
          </div>
          <div class="statistics-echart">
            <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
          </div>
        </div>
      </div>
      <div class="cont-rt">
        <div class="rt-top">
          <h3>待检任务</h3>
          <div class="table">
            <div class="race-lamp-card"
              ><!--:style="{ height: showNum1 * 0.625 + 'rem' }"-->
              <div class="horseLamp_list" :class="{ marquee_top: animate }">
                <div class="order-list" v-for="(item, index) in horseLampList" :key="index">
                  <div class="list">
                    <div class="list-lt">
                      <p class="time">{{ item.time }}</p>
                      <p class="num">{{ item.num }}</p>
                    </div>
                    <div class="list-rt">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rt-center">
          <h3>缺陷分布图</h3>
          <div class="center-echarts">
            <defect style="width: 100%; height: 100%" :data="defectData" />
          </div>
        </div>
        <div class="rt-bot">
          <div class="center-title">
            <h3>不良原因TOP10</h3>
          </div>
          <div class="marquee">
            <div class="marquee_box" ref="marquee_box" :style="{ height: showNum * 0.625 + 'rem' }">
              <ul class="marquee_list" :class="{ marquee_top: animate }">
                <li v-for="(item, index) in listData" :key="index">
                  <p class="marquee-icon" v-if="item.imgurl"><img :src="item.imgurl" alt="" /></p>
                  <p class="marquee-icon1" v-if="!item.imgurl"> {{ index + 1 }}</p>
                  <p class="marquee-title">{{ item.title }}</p>
                  <div class="marquee-progress">
                    <Progress
                      :percent="item.rantValue"
                      class="progress"
                      style="width: 100%; height: 0.375rem"
                      :stroke-color="{ '0%': '#437FDB', '100%': '#33FFFF' }"
                      :show-info="false"
                      trailColor="rgba(0,0,0,0)"
                      strokeLinecap="square"
                    />
                  </div>
                  <p class="marquee-num">{{ item.value }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="qualityPage" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { Progress } from 'ant-design-vue';
  import VisitSource from './components/VisitSource.vue';
  import defect from './components/defect.vue';
  import {
    getDefectDistributionMaps,
    getNgProducts,
    getNgReasons,
    getOnceQualifiedRate,
    getPlanMonthQualifiedRate,
    getProducedMonthQualifiedRates,
    getProductCateYearQualifiedQtys,
    getWaitInspTasks,
  } from './quality.api';

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
  //切换看板事件
  function toggleBoard() {
    window.location.href = 'http://218.17.142.200:10020/bi/productionLine';
  }
  // 缺陷分布
  const defectData = ref([]);
  getDefectDistributionMaps({}).then((res) => {
    //defectData.value = res;
    defectData.value.push({ defectName: '设计缺陷', defectQty: 0 });
    defectData.value.push({ defectName: '原材料缺陷', defectQty: 1 });
    defectData.value.push({ defectName: '生产缺陷', defectQty: 1 });
    defectData.value.push({ defectName: '其他缺陷', defectQty: 0 });
  });

  // 不良产品列表
  const config = ref({
    header: [
      '<span style="color:#33FFFF;font-size: 0.15rem;">工单号</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">产品名称</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">问题情况</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">问题原因</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">检查人</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">检查时间</span>',
    ],
    headerHeight: 30 * localStorage.remScale,
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
    columnWidth: [100 * localStorage.remScale, 200 * localStorage.remScale, 100 * localStorage.remScale],
    align: ['center', 'center', 'center'],
  });
  getNgProducts({}).then((res) => {
    // res.forEach((item) => {
    //   config.value.data.push([item.mocode, item.productName, item.defectName, item.defectType, item.inspBy, item.inspTime]);
    // });
    config.value.data = [
      [
        '<span style="color:#fff;font-size: 0.15rem;">1000021376</span>',
        '<span style="color:#fff;font-size: 0.15rem;">YCSZ矿用钻孔瞬变电磁仪</span>',
        '<span style="color:#fff;font-size: 0.15rem;">充电板损坏</span>',
        '<span style="color:#fff;font-size: 0.15rem;">电压过大</span>',
        '<span style="color:#fff;font-size: 0.15rem;">潘照方</span>',
        '<span style="color:#ffff;font-size: 0.15rem;">2024/1/14</span>',
      ],
      [
        '<span style="color:#fff;font-size: 0.15rem;">1000022987</span>',
        '<span style="color:#fff;font-size: 0.15rem;">KJ17-F(A广用本安型水文测分站</span>',
        '<span style="color:#fff;font-size: 0.15rem;">主板故障</span>',
        '<span style="color:#fff;font-size: 0.15rem;">芯片问题</span>',
        '<span style="color:#fff;font-size: 0.15rem;">韩昱</span>',
        '<span style="color:#fff;font-size: 0.15rem;">2024/1/13</span>',
      ],
    ];
    config.value = { ...config.value };
  });

  // 不良原因
  const listData = ref([]);
  getNgReasons({}).then((res) => {
    res = [];
    res.push({ defectName: '充电板损坏', defectQty: 1 });
    res.push({ defectName: '主板故障', defectQty: 1 });
    //res.push({ defectName: '装配不良', defectQty: 2 });
    res.forEach((item, index) => {
      if (index < 2) {
        listData.value.push({
          title: item.defectName,
          value: Number(item.defectQty),
          rantValue: Number(item.defectQty * 10),
          imgurl: new URL(`./image/no${index + 1}.png`, import.meta.url).href,
        });
      } else {
        listData.value.push({
          title: item.defectName,
          value: Number(item.defectQty),
          rantValue: Number(item.defectQty * 10),
          imgurl: '',
        });
      }
    });
  });
  const animate = ref(false);
  const showNum = ref(4);

  setInterval(() => {
    // showMarquee()
    showMarquee1();
  }, 2000);

  function showMarquee() {
    if (listData.value.length > 4) {
      animate.value = true;
      listData.value.push(listData.value[0]);
      setTimeout(() => {
        listData.value.shift();
        animate.value = false;
      }, 1000);
    }
  }

  // 一次合格率
  const passRate = ref({});
  getOnceQualifiedRate({}).then((res) => {
    // console.log(res);
    // passRate.value = res;
    passRate.value['csclyQualifiedRate'] = 97;
    passRate.value['kjdzyQualifiedRate'] = 98;
    passRate.value['qkgjyQualifiedRate'] = 100;
    passRate.value['ypdctyQualifiedRate'] = 100;
    passRate.value['zkcxyQualifiedRate'] = 96;
  });

  // 本月计划合格率
  const qualifiedInfo = ref([
    {
      title: '计划量',
      value: '58',
    },
    {
      title: '已产量',
      value: '47',
    },
    {
      title: '良品量',
      value: '55',
    },
    {
      title: '不良品',
      value: '2',
    },
  ]);
  const monthParess = ref(0);
  getPlanMonthQualifiedRate({}).then((res) => {
    // qualifiedInfo.value[0].value = res.planQty;
    // qualifiedInfo.value[1].value = res.producedQty;
    // qualifiedInfo.value[2].value = res.okQty;
    // qualifiedInfo.value[3].value = res.ngQty;
    // monthParess.value = res.monthOkRate;
    qualifiedInfo.value[0].value = 58;
    qualifiedInfo.value[1].value = 47;
    qualifiedInfo.value[2].value = 55;
    qualifiedInfo.value[3].value = 2;
    monthParess.value = 96;
  });

  // 月产量合格率
  const qualified = ref({
    xData: [],
    okQty: [],
    monthOkRate: [],
  });
  getProducedMonthQualifiedRates({}).then((res) => {
    // res.forEach((item) => {
    //   qualified.value.xData.push(item.monthNum);
    //   qualified.value.okQty.push(item.okQty);
    //   qualified.value.monthOkRate.push(item.monthOkRate);
    // });
    qualified.value.xData.push('1月');
    qualified.value.okQty.push(50);
    qualified.value.monthOkRate.push(100);
    qualified.value.xData.push('2月');
    qualified.value.okQty.push(5);
    qualified.value.monthOkRate.push(99);
    qualified.value.xData.push('3月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('4月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('5月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('6月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('7月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('8月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('9月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('10月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
    qualified.value.xData.push('11月');
    qualified.value.okQty.push(0);
    qualified.value.monthOkRate.push(0);
  });

  // 年度产品类别合格数
  const productCategory = ref([]);
  getProductCateYearQualifiedQtys({}).then((res) => {
    // productCategory.value = res;
    productCategory.value.push({ productCate: '水文物探类', okQty: 8, ngQty: 0 });
    productCategory.value.push({ productCate: '地质构造类', okQty: 5, ngQty: 0 });
    productCategory.value.push({ productCate: '钻孔测量类', okQty: 16, ngQty: 1 });
    productCategory.value.push({ productCate: '监测监控类', okQty: 71, ngQty: 2 });
    productCategory.value.forEach((item) => {
      item.okQty = Number(item.okQty);
      item.ngQty = Number(item.ngQty);
    });
  });

  // 待检任务
  const horseLampList = ref([]);
  const showNum1 = ref(3);
  function showMarquee1() {
    if (horseLampList.value.length > 4) {
      animate.value = true;
      horseLampList.value.push(horseLampList.value[0]);
      setTimeout(() => {
        horseLampList.value.shift();
        animate.value = false;
      }, 1000);
    }
  }
  getWaitInspTasks({}).then((res) => {
    // res.forEach((item, index) => {
    //   horseLampList.value.push({
    //     num: index + 1,
    //     content: item.mocode + '.' + item.productName,
    //   });
    // });
    horseLampList.value.push({
      time: '01-20',
      num: '01',
      content: '1000024221 KDY127/24(B)|矿用隔爆兼本安型直流电源',
    });
    horseLampList.value.push({
      time: '01-20',
      num: '02',
      content: '1000024088 YJSY(DW)水文遥测仪',
    });
    horseLampList.value.push({
      time: '01-20',
      num: '03',
      content: '1000023375 YTG3.7矿用推送式轨迹仪',
    });
  });
</script>
<style scoped lang="less">
  @import url('quality.less');
</style>
