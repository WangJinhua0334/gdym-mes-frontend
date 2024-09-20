<template>
  <div class="productionLinePage" :style="{ height: currentFullScreen ? '100%' : currentHeight - 50 + 'px' }">
    <div class="title-bg">
      <div class="title">
        <p class="title-logo"><img src="./image/logo.png" alt="" /></p>
        <p class="title-info" @click="toggleBoard">物探数字化车间-产线看板</p>
      </div>
    </div>
    <div class="cont">
      <div class="cont-top">
        <div class="top-equiment">
          <div style="width: 100%; height: 100%; position: relative">
            <div class="equiment-info" :class="'equiment-info' + (index + 1)" v-for="(order, index) in orderInfo" :key="index">
              <p class="info-title">{{ order.workPostName }}</p>
              <div class="info-detail">
                <div class="info-lt">
                  <div>
                    <p class="product-name">产品名</p>
                    <!-- <p class="product-text">{{ order.itemMoPlanTask.length != 0 ? order.itemMoPlanTask[0].productName : '' }}</p> -->
                    <p class="product-text">KJ117-F(A)矿用本安型水文监测分站</p>
                  </div>
                  <div>
                    <p class="product-name">工单号</p>
                    <!-- <p class="product-text">{{ order.itemMoPlanTask.length != 0 ? order.itemMoPlanTask[0].code : '' }}</p> -->
                    <p class="product-text">1000023524</p>
                  </div>
                </div>
                <div class="info-lt">
                  <div>
                    <p class="product-name">流转卡</p>
                    <p class="product-text">{{ order.itemMoPlanTask.length != 0 ? order.itemMoPlanTask[0].mesMoSn : '' }}</p>
                  </div>
                </div>
              </div>
              <p class="point-icon"></p>
            </div>
          </div>
          <div class="equiment-status">
            <div class="status-title">
              <p class="status-arrow"><img src="./image/arrow.png" alt="" /></p>
              <p class="status-info">设备状态灯</p>
            </div>
            <div class="status-lamp">
              <div>
                <p><img src="./image/runing.png" alt="" /></p>
                <p>运行</p>
              </div>
              <div>
                <p><img src="./image/daiji.png" alt="" /></p>
                <p>待机</p>
              </div>
              <!-- <div>
                                <p><img src="./image/tiaoshi.png" alt=""></p>
                                <p>调试</p>
                            </div>
                            <div>
                                <p><img src="./image/warning.png" alt=""></p>
                                <p>报警</p>
                            </div> -->
              <div>
                <p><img src="./image/lixian.png" alt="" /></p>
                <p>离线</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cont-bot">
        <div class="workstation-item" v-for="(equiment, index) in equimentList" :key="index">
          <div class="item-title">
            <p class="title" style="flex-grow: 2">{{ equiment.equipmentName }}</p>
            <p class="workstation-status" v-if="equiment.equipmentStatus == '1'">
              <span class="status-info">运行</span>
              <span class="status-icon status-icon1"></span>
            </p>
            <!-- <p class="workstation-status" v-if="equiment.equipmentStatus=='WARNING'">
                            <span class="status-info">报警</span>
                            <span class="status-icon status-icon2" ></span>
                        </p> -->
            <p class="workstation-status" v-if="equiment.equipmentStatus == '2'">
              <span class="status-info">待机</span>
              <span class="status-icon status-icon3"></span>
            </p>
            <p class="workstation-status" v-if="equiment.equipmentStatus == '0'">
              <span class="status-info">停机</span>
              <span class="status-icon status-icon5"></span>
            </p>
          </div>
          <div class="item-equiment">
            <div class="equiment-img">
              <p class="img-box">
                <img :src="equiment.equipmentPicture" alt="" />
              </p>
              <p class="capacity"
                >产能：<span>{{ equiment.accumulateCapacity }}</span></p
              >
            </div>
            <div class="equiment-parameter">
              <p
                >设备编码：<span>{{ equiment.equipmentCode }}</span></p
              >
              <p
                >设备型号：<span>{{ equiment.equipmentModel }}</span></p
              >
              <p
                >运行时间：<span>{{ equiment.runTime }}</span></p
              >
              <p
                >报警时间：<span>{{ equiment.warnTime }}</span></p
              >
            </div>
          </div>
          <div class="warning-info">
            报警信息
            <span v-if="equiment.warnInfo">
              <span>{{ equiment.warnInfo }}</span>
            </span>
            <p v-if="!equiment.warnInfo" style="font-size: 0.15rem; color: #ff1f44; margin-left: 0.05rem">暂无报警信息</p>
          </div>
          <!-- <div class="workstation-info" v-if="index != 3">
            <div v-if="index == 0">
              <p>气泵压力：0</p>
              <p>运行模式：自动</p>
              <p>生产条码：CD20233800064</p>
            </div>
            <div v-if="index == 0">
              <p>测试步骤：CAN通信测试</p>
              <p>上限：</p>
              <p>下限：</p>
              <p>标准值：</p>
            </div>
            <div v-if="index == 0">
              <p>实测值：</p>
              <p>单位：ma</p>
              <p>报警时间：</p>
              <p>报警信息：</p>
            </div>
            <div v-if="index == 1">
              <p>x轴：</p>
              <p>Y轴：</p>
              <p>Z轴：</p>
              <p>喷涂压力：5.1</p>
              <p>加工程序：地震仪控制板背面</p>
            </div>
            <div v-if="index == 1">
              <p>工作速度(%)：150.0</p>
              <p>运输速度：20</p>
              <p>工作率(%)：11.69</p>
              <p>工作耗时(s)：60000</p>
            </div>
            <div v-if="index == 1">
              <p>进板延时(s)：200</p>
              <p>出板延时(s)：2000</p>
              <p>等待率(%)：11.69</p>
              <p>报警累时：</p>
              <p>报警信息：</p>
            </div>
            <div v-if="index == 2">
              <p>x轴：</p>
              <p>Y轴：</p>
              <p>Z轴：</p>
              <p>动态搅拌速度：</p>
              <p>A1出胶速度：</p>
              <p>B1出胶速度：</p>
            </div>
            <div v-if="index == 2">
              <p>A1泵脉冲：</p>
              <p>B1泵脉冲：</p>
              <p>T链条脉冲：</p>
              <p>d1电机脉冲：</p>
              <p>A1泵压力值：</p>
              <p>B1泵压力值：</p>
            </div>
            <div v-if="index == 2">
              <p>A1料桶温度：</p>
              <p>B1料桶温度：</p>
              <p>A1料桶液位：</p>
              <p>B1料桶液位：</p>
              <p>报警时间：</p>
              <p>报警信息：</p>
            </div>
          </div>
          <div class="workstation-info" v-if="index == 3">
            <p class="noinfo">暂无设备信息</p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="productionLinePage" setup>
  import { ref, computed, unref, nextTick } from 'vue';
  import { workOrderInfo, fct, pcb, sfpt, szf } from './productionLine.api';
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
  // 实时监听窗口高度
  watchWindowSize();
  window.addEventListener('resize', watchWindowSize);
  function watchWindowSize() {
    var h = window.innerHeight;
    currentHeight.value = h;
  }

  //切换看板事件
  function toggleBoard() {
    window.location.href = 'http://218.17.142.200:10020/bi/quality';
  }

  const orderInfo = ref<any>([]);
  const equimentList = ref<any>([]);
  // 工位信息
  workOrderInfo({}).then((res) => {
    // console.log(res);
    // orderInfo.value = res;
    orderInfo.value.push({
      workPostName: '装配工作站',
      equipmentName: '装配工作站',
      itemMoPlanTask: [{ productName: '磁棒', mesMoSn: 'CD20233800064', code: 'CD20233800064' }],
    });
    orderInfo.value.push({
      workPostName: '喷涂工作站',
      equipmentName: '喷涂工作站',
      itemMoPlanTask: [{ productName: '磁棒', mesMoSn: 'CD20233800064', code: 'CD20233800064' }],
    });
    orderInfo.value.push({
      workPostName: '测试工作站',
      equipmentName: '测试工作站',
      itemMoPlanTask: [{ productName: '磁棒', mesMoSn: 'CD20233800064', code: 'CD20233800064' }],
    });
    orderInfo.value.push({
      workPostName: '生产准备',
      equipmentName: '生产准备',
      itemMoPlanTask: [{ productName: '磁棒', mesMoSn: 'CD20233800064', code: 'CD20233800064' }],
    });
  });
  // FCT自动化测试线
  fct({}).then((res) => {
    res.equipmentStatus = 1;
    res.accumulateCapacity = 90;
    equimentList.value.push(res);
      // 三防喷涂
    sfpt({}).then((res) => {
      res.equipmentStatus = 1;
      res.accumulateCapacity = 30;
      equimentList.value.push(res);
      // 双组份自动灌胶机
      szf({}).then((res) => {
        res.equipmentStatus = 1;
        equimentList.value.push(res);
        // PCB自动锁螺丝机
        pcb({}).then((res) => {
          equimentList.value.push(res);
        });
      });
    });
  });

</script>
<style scoped lang="less">
  @import 'productionLine.less';
</style>
