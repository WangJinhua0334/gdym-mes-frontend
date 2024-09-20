<template>
  <div class="abnormalPage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 50 + 'px' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"><img src="./image/logo.png" alt="" /></p>
        <p class="title-info">物探数字化车间-异常看板</p>
      </div>
    </div>
    <div class="cont">
      <div class="cont-top">
        <div class="cont-lt">
          <div class="lt-top">
            <h3>异常类型排行榜</h3>
            <div class="abnormal-top">
              <div class="marquee_box" ref="marquee_box" :style="{ height: showNum * 40 + 'px' }">
                <ul class="marquee_list" :class="{ marquee_top: animate }">
                  <li v-for="(item, index) in listData" :key="index">
                    <p class="marquee-icon"> {{ item.num }}</p>
                    <div>
                      <p class="marquee-title"><span></span>{{ item.name }}</p>
                      <div class="marquee-line"></div>
                      <p class="marquee-num">{{ item.valueNum }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="lt-top">
            <h3>异常次数占比</h3>
            <div class="abnormal-echarts">
              <VisitSource style="width: 100%; height: 100%" :data="listData1" />
            </div>
          </div>
        </div>
        <div class="cont-center">
          <div class="center-item center-item2">
            <div class="item-turn"></div>
            <p class="item-num">{{ abnormalTotal.completedNum }}</p>
            <p class="item-info">已处理数量</p>
          </div>
          <div class="center-item center-item1">
            <div class="item-turn"></div>
            <p class="item-num">{{ abnormalTotal.notProcessNum }}</p>
            <p class="item-info">待处理数量</p>
          </div>
          <div class="center-item-big center-item3">
            <div class="item-turn"></div>
            <p class="item-num">{{ abnormalTotal.abnormalNum }}</p>
            <p class="item-info">异常数量</p>
          </div>
        </div>
        <div class="cont-lt">
          <div class="lt-top">
            <h3>年度工位异常统计</h3>
            <div class="abnormal-top">
              <station style="width: 100%; height: 100%" :data="workShop" />
            </div>
          </div>
          <div class="lt-top">
            <h3>异常时长占比</h3>
            <div class="abnormal-echarts">
              <duration style="width: 100%; height: 100%" :data="abnormalData" />
            </div>
          </div>
        </div>
      </div>
      <div class="cont-bot">
        <div class="bot-lt bot-lt1">
          <h3>历史异常信息</h3>
          <div class="info-board">
            <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
          </div>
        </div>
        <div class="bot-lt bot-lt2">
          <h3>实时异常信息</h3>
          <div class="abnormal-top">
            <div class="marquee_box" ref="marquee_box" :style="{ height: showNum1 * 0.4125 + 'rem' }">
              <ul class="marquee_list" :class="{ marquee_top: animate }">
                <li v-for="(item, index) in abnormalList" :key="index">
                  <div>
                    <p class="marquee-title">{{ item.equipmentName }}</p>
                    <div class="marquee-line">{{ item.abnormalContent }}</div>
                    <p class="marquee-num">{{ item.createTime }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="abnormalPage" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { Progress } from 'ant-design-vue';
  import VisitSource from './components/VisitSource.vue';
  import station from './components/station.vue';
  import duration from './components/duration.vue';
  import {
    getAbnormalEvents,
    getAbnormalHours,
    getAbnormalInfos,
    getAbnormalTotal,
    getAbnormalTypes,
    getAbnormalWorkStationStatistics,
  } from './abnormal.api';

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

  setInterval(() => {
    showMarquee();
    showMarquee1();
  }, 2000);

  // 异常事件
  const showNum1 = ref(5);
  const abnormalList = ref([]);
  function showMarquee() {
    if (listData.value.length > 5) {
      animate.value = true;
      listData.value.push(listData.value[0]);
      setTimeout(() => {
        listData.value.shift();
        animate.value = false;
      }, 1000);
    }
  }
  function showMarquee1() {
    if (abnormalList.value.length > 5) {
      animate.value = true;
      abnormalList.value.push(abnormalList.value[0]);
      setTimeout(() => {
        abnormalList.value.shift();
        animate.value = false;
      }, 1000);
    }
  }
  getAbnormalEvents({}).then((res) => {
    // abnormalList.value = res;
    abnormalList.value.push({
      equipmentName: '缺少电路板',
      abnormalContent: '',
      createTime: '2023/11/1 10:37:13',
    });
  });

  // 异常时长占比
  const abnormalData = ref([]);
  const colors = ref(['#33FFFF', '#1BBFE0', '#0099E6', '#1F78FF', '#0037EB', '#000DC2']);
  getAbnormalHours({}).then((res) => {
    // res.forEach((element, index) => {
    //   abnormalData.value.push({
    //     name: element.abnormalTypeName,
    //     value: element.processHours,
    //     itemStyle: {
    //       color: colors.value[index],
    //     },
    //   });
    // });
    abnormalData.value.push({
      name: '外购件质量问题',
      value: 3,
      itemStyle: {
        color: colors.value[0],
      },
    });
    abnormalData.value.push({
      name: '物料短缺',
      value: 7,
      itemStyle: {
        color: colors.value[1],
      },
    });
  });

  // 异常信息
  const config = ref({
    header: [
      '<span style="color:#33FFFF;font-size: 0.15rem;">类型</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">标题</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">状态</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">工位</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">描述</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">紧急程度</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">发起人</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">发起时间</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">处理人</span>',
      '<span style="color:#33FFFF;font-size: 0.15rem;">处理时间</span>',
    ],
    headerHeight: 30 * localStorage.remScale,
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
    columnWidth: [
      120 * localStorage.remScale,
      80 * localStorage.remScale,
      80 * localStorage.remScale,
      120 * localStorage.remScale,
      150 * localStorage.remScale,
    ],
    align: [],
  });
  getAbnormalInfos({}).then((res) => {
    let newData = [],
      alignArr = [];
    // res.forEach((item) => {
    //   newData.push([
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalTypeName + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalTitle + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalStatusName + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalPost + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalDes + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.abnormalLevel + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.createBy + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.createTime + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.processBy + '</span>',
    //     '<span style="color:#fff;font-size: 12px;">' + item.processTime + '</span>',
    //   ]);
    //   alignArr.push('center');
    // });
    newData.push([
      '<span style="color:#fff;font-size: 0.15rem;">物料短缺</span>',
      '<span style="color:#fff;font-size: 0.15rem;">缺少电路板</span>',
      '<span style="color:#fff;font-size: 0.15rem;">待响应</span>',
      '<span style="color:#fff;font-size: 0.15rem;">装配产线</span>',
      '<span style="color:#fff;font-size: 0.15rem;">电路板漏焊</span>',
      '<span style="color:#fff;font-size: 0.15rem;">一级</span>',
      '<span style="color:#fff;font-size: 0.15rem;">刘小娟</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/1</span>',
      '<span style="color:#fff;font-size: 0.15rem;"></span>',
      '<span style="color:#fff;font-size: 0.15rem;"></span>',
    ]);
    alignArr.push('center');
    newData.push([
      '<span style="color:#fff;font-size: 0.15rem;">外购件质量问题</span>',
      '<span style="color:#fff;font-size: 0.15rem;">尺寸不匹配</span>',
      '<span style="color:#fff;font-size: 0.15rem;">已确认</span>',
      '<span style="color:#fff;font-size: 0.15rem;">生产准备工位01</span>',
      '<span style="color:#fff;font-size: 0.15rem;">更换外壳</span>',
      '<span style="color:#fff;font-size: 0.15rem;">一级</span>',
      '<span style="color:#fff;font-size: 0.15rem;">王洋</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/3</span>',
      '<span style="color:#fff;font-size: 0.15rem;">吕琦</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/4</span>',
    ]);
    alignArr.push('center');
    newData.push([
      '<span style="color:#fff;font-size: 0.15rem;">物料短缺</span>',
      '<span style="color:#fff;font-size: 0.15rem;">缺少采集板</span>',
      '<span style="color:#fff;font-size: 0.15rem;">已确认</span>',
      '<span style="color:#fff;font-size: 0.15rem;">装配产线</span>',
      '<span style="color:#fff;font-size: 0.15rem;">电路板漏焊</span>',
      '<span style="color:#fff;font-size: 0.15rem;">一级</span>',
      '<span style="color:#fff;font-size: 0.15rem;">何小雪</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/9</span>',
      '<span style="color:#fff;font-size: 0.15rem;">刘勇</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/13</span>',
    ]);
    alignArr.push('center');
    newData.push([
      '<span style="color:#fff;font-size: 0.15rem;">外购件质量问题</span>',
      '<span style="color:#fff;font-size: 0.15rem;">参数不正确</span>',
      '<span style="color:#fff;font-size: 0.15rem;">已确认</span>',
      '<span style="color:#fff;font-size: 0.15rem;">调试工位03</span>',
      '<span style="color:#fff;font-size: 0.15rem;">更换芯片</span>',
      '<span style="color:#fff;font-size: 0.15rem;">一级</span>',
      '<span style="color:#fff;font-size: 0.15rem;">张佳</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/10</span>',
      '<span style="color:#fff;font-size: 0.15rem;">韩昱</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/11</span>',
    ]);
    alignArr.push('center');
    newData.push([
      '<span style="color:#fff;font-size: 0.15rem;">外购件质量问题</span>',
      '<span style="color:#fff;font-size: 0.15rem;">参数不正确</span>',
      '<span style="color:#fff;font-size: 0.15rem;">已确认</span>',
      '<span style="color:#fff;font-size: 0.15rem;">调试工位02</span>',
      '<span style="color:#fff;font-size: 0.15rem;">更换芯片</span>',
      '<span style="color:#fff;font-size: 0.15rem;">一级</span>',
      '<span style="color:#fff;font-size: 0.15rem;">吕琦</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/13</span>',
      '<span style="color:#fff;font-size: 0.15rem;">潘照方</span>',
      '<span style="color:#fff;font-size: 0.15rem;">2023/11/14</span>',
    ]);
    config.value.data = newData;
    config.value.align = alignArr;
    config.value = { ...config.value };
  });

  // 异常总汇数
  const abnormalTotal = ref({});
  getAbnormalTotal({}).then((res) => {
    // abnormalTotal.value = res;
    abnormalTotal.value['completedNum'] = 4;
    abnormalTotal.value['abnormalNum'] = 5;
    abnormalTotal.value['notProcessNum'] = 1;
  });

  // 异常类型排行占比
  const animate = ref(false);
  const showNum = ref(5);
  const listData = ref<any>([]);
  getAbnormalTypes({}).then((res) => {
    // res.forEach((item, index) => {
    //   listData.value.push({
    //     name: item.abnormalTypeName,
    //     value: item.abnormalNum,
    //     num: index + 1,
    //     itemStyle: {
    //       color: colors.value[index],
    //     },
    //   });
    // });
    listData.value = [
      {
        num: '1',
        name: '外购件质量问题',
        value: '60',
        valueNum: '3',
        itemStyle: {
          color: colors.value[2],
        },
      },
      {
        num: '2',
        name: '物料短缺',
        value: '40',
        valueNum: '2',
        itemStyle: {
          color: colors.value[3],
        },
      },
      {
        num: '3',
        name: '技术问题',
        value: '0',
        valueNum: '0',
        itemStyle: {
          color: colors.value[0],
        },
      },
      {
        num: '4',
        name: '设备问题',
        value: '0',
        valueNum: '0',
        itemStyle: {
          color: colors.value[1],
        },
      },
      {
        num: '5',
        name: '人员问题',
        value: '0',
        valueNum: '0',
        itemStyle: {
          color: colors.value[4],
        },
      },
    ];
  });

  // 异常次数占比
  const listData1 = ref<any>([]);
  listData1.value = [
    {
      num: '1',
      name: '技术问题',
      value: '0',
      valueNum: '0',
      itemStyle: {
        color: colors.value[0],
      },
    },
    {
      num: '2',
      name: '设备问题',
      value: '0',
      valueNum: '0',
      itemStyle: {
        color: colors.value[1],
      },
    },
    {
      num: '3',
      name: '外购件质量问题',
      value: '60',
      valueNum: '3',
      itemStyle: {
        color: colors.value[2],
      },
    },
    {
      num: '4',
      name: '物料短缺',
      value: '40',
      valueNum: '2',
      itemStyle: {
        color: colors.value[3],
      },
    },
    {
      num: '5',
      name: '人员问题',
      value: '0',
      valueNum: '0',
      itemStyle: {
        color: colors.value[4],
      },
    },
  ];

  //年度工位异常统计
  const workShop = ref([]);
  getAbnormalWorkStationStatistics({}).then((res) => {
    // res.forEach((item, index) => {
    //   workShop.value.push({
    //     name: '工位' + item.workStationCode,
    //     value: item.workStationNum,
    //   });
    // });
    workShop.value.push({
      name: '装配产线',
      value: '2',
    });
    workShop.value.push({
      name: '生产准备工位01',
      value: '1',
    });
    workShop.value.push({
      name: '调试工位03',
      value: '1',
    });
    workShop.value.push({
      name: '调试工位02',
      value: '1',
    });
  });
</script>
<style scoped lang="less">
  @import url('abnormal.less');
</style>
