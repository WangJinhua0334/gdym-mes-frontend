<template>
  <!-- :style="{ backgroundColor: themeColor == 'light' ? '#fff' : '#151515' }" -->
  <div class="bg" :style="{ height: currentFullScreen ? '100%' : currentHeightscreen - 50 + 'px' }">
    <div class="equipmentPage">
      <div class="rf-cent">
        <div class="rf-cent-rf">
          <div class="block-bg">
            <div class="text-scal text-scal3">
              <span class="text-detail">{{ airData.a1 }}</span>
              <span class="text-press">°C</span>
            </div>
            <div class="text-scal text-scal2">室内温度</div>
            <div class="circle-line1"></div>
            <div class="circle-line2"></div>
          </div>
        </div>
        <div class="rf-cent-cn">
          <div class="block-bg">
            <div class="text-scal text-scal3">
              <span class="text-detail">{{ airData.a2 }}</span>
              <span class="text-press">%</span>
            </div>
            <div class="text-scal text-scal2">室内湿度</div>
            <div class="circle-line1"></div>
            <div class="circle-line2"></div>
          </div>
        </div>
        <div class="rf-cent-lf">
          <div class="block-bg">
            <div class="text-scal text-scal3">
              <span class="text-detail">{{ airData.a3 }}</span>
              <span class="text-press">°C</span>
            </div>
            <div class="text-scal text-scal2">室外温度</div>
            <div class="circle-line1"></div>
            <div class="circle-line2"></div>
          </div>
        </div>
      </div>
      <div style="width: 100%; height: 40px; margin-bottom: 10px; display: flex">
        <a-form style="width: 100%" layout="inline" autocomplete="off">
          <!-- <a-form-item label="设备编码" :labelCol="{ span: 8 }" style="width: 300px">
          <a-input v-model:value="equimentCode" placeholder="请输入设备编码" />
        </a-form-item>
        <a-form-item label="设备状态" :labelCol="{ span: 6 }" style="width: 300px; display: flex">
          <a-select v-model:value="equimentStatus" :options="statusOptions" />
        </a-form-item> -->
          <a-form-item>
            <a-button type="primary" @click="submit"> 刷新 </a-button>
          </a-form-item>
        </a-form>
        <div class="status-box">
          <div> <p style="background-color: #36ce85"></p>运行 </div>
          <div> <p style="background-color: #ffff80"></p>待机 </div>
          <div> <p style="background-color: #ec808d"></p>报警 </div>
          <div> <p style="background-color: #e6e6e6"></p>关机 </div>
        </div>
      </div>
      <div class="cont">
        <div
          class="equiment-item"
          v-if="(equimentCode == '' || equimentCode == 'ZM123456') && (equimentStatus == '' || equimentStatus == sfptData.equipmentStatus)"
        >
          <div class="equiment-title">
            <span
              :class="{
                color1: sfptData.equipmentStatus == 1,
                color2: sfptData.equipmentStatus == 2,
                color3: sfptData.equipmentStatus == 3,
                color4: sfptData.equipmentStatus == 0,
              }"
            ></span>
            <div class="title">{{ sfptData.equipmentName }}：{{ sfptData.equipmentCode }}</div>
          </div>
          <div
            class="equiment-info"
            :class="{
              color1: sfptData.equipmentStatus == 1,
              color2: sfptData.equipmentStatus == 2,
              color3: sfptData.equipmentStatus == 3,
              color4: sfptData.equipmentStatus == 0,
            }"
          >
            <div class="info-top">
              <div class="top-img"><img :src="sfptData.equipmentPicture" alt="" /></div>
              <div>
                <p>运行时间: {{ sfptData.runTime }}</p>
                <p>报警时间: {{ sfptData.warnTime }}</p>
                <p>报警信息: {{ sfptData.warnInfo == '0' ? '' : fctData.warnInfo }}</p>
              </div>
              <div>
                <p>设备型号: {{ sfptData.equipmentModel }}</p>
                <p>出厂编码: {{ sfptData.exFactoryCode }}</p>
                <p>出厂日期: {{ sfptData.exFactoryTime }}</p>
              </div>
            </div>
            <div class="info-text">
              <div class="text">
                <div>
                  <p>X轴: {{ sfptData.x }} </p>
                  <p>Y轴: {{ sfptData.y }} </p>
                  <p>Z轴: {{ sfptData.z }} </p>
                  <p>工作速度: {{ sfptData.workSpeed }} </p>
                </div>
                <div>
                  <p>加工工序: {{ sfptData.ncProgram }} </p>
                  <p>运输速度: {{ sfptData.transportSpeed }} </p>
                  <p>喷涂压力: {{ sfptData.sprayPressure }} </p>
                  <p>工作时耗: {{ sfptData.workConsumption }} </p>
                </div>
                <div>
                  <p>进板延时: {{ sfptData.enterTimeout }} </p>
                  <p>出板延时: {{ sfptData.outerTimeout }} </p>
                  <p>工作率（%）: {{ sfptData.workRate }} </p>
                  <p>等待率（%）: {{ sfptData.waitRate }} </p>
                </div>
              </div>
              <div v-if="JSON.stringify(sfptData) == '{}'">详细参数: 待定</div>
            </div>
          </div>
        </div>
        <div
          class="equiment-item"
          v-if="(equimentCode == '' || equimentCode == 'ZM123458') && (equimentStatus == '' || equimentStatus == pcbData.equipmentStatus)"
        >
          <div class="equiment-title">
            <span
              :class="{
                color1: pcbData.equipmentStatus == 1,
                color2: pcbData.equipmentStatus == 2,
                color3: pcbData.equipmentStatus == 3,
                color4: pcbData.equipmentStatus == 0,
              }"
            ></span>
            <div class="title">{{ pcbData.equipmentName }}：{{ pcbData.equipmentCode }}</div>
          </div>
          <div
            class="equiment-info"
            :class="{
              color1: pcbData.equipmentStatus == 1,
              color2: pcbData.equipmentStatus == 2,
              color3: pcbData.equipmentStatus == 3,
              color4: pcbData.equipmentStatus == 0,
            }"
          >
            <div class="info-top">
              <div class="top-img"><img :src="pcbData.equipmentPicture" alt="" /></div>
              <div>
                <p>运行时间: {{ pcbData.runTime }}</p>
                <p>报警时间: {{ pcbData.warnTime }}</p>
                <p>报警信息: {{ pcbData.warnInfo }}</p>
              </div>
              <div>
                <p>设备型号: {{ pcbData.equipmentModel }}</p>
                <p>出厂编码: {{ pcbData.exFactoryCode }}</p>
                <p>出厂日期: {{ pcbData.exFactoryTime }}</p>
              </div>
            </div>
            <div class="info-text">
              <div class="text">
                <div>
                  <p>螺丝机是否启动: {{ pcbData.equipmentStatus == 0 ? '否' : '是' }}</p>
                  <p>线体启动信号: {{ pcbData.lineStart == 0 ? '否' : '是' }}</p>
                </div>
                <div>
                  <p>螺丝机完成信号: {{ pcbData.isComplete == 0 ? '否' : '是' }}</p>
                </div>
              </div>
              <!-- <div>详细参数: 待定</div> -->
            </div>
          </div>
        </div>
        <div
          class="equiment-item"
          v-if="(equimentCode == '' || equimentCode == 'ZM123452') && (equimentStatus == '' || equimentStatus == fctData.equipmentStatus)"
        >
          <div class="equiment-title">
            <span
              :class="{
                color1: fctData.equipmentStatus == 1,
                color2: fctData.equipmentStatus == 2,
                color3: fctData.equipmentStatus == 3,
                color4: fctData.equipmentStatus == 0,
              }"
            ></span>
            <div class="title">{{ fctData.equipmentName }}：{{ fctData.equipmentCode }}</div>
          </div>
          <div
            class="equiment-info"
            :class="{
              color1: fctData.equipmentStatus == 1,
              color2: fctData.equipmentStatus == 2,
              color3: fctData.equipmentStatus == 3,
              color4: fctData.equipmentStatus == 0,
            }"
          >
            <div class="info-top">
              <div class="top-img"><img :src="fctData.equipmentPicture" alt="" /></div>
              <div>
                <p>运行时间: {{ fctData.runTime }}</p>
                <p>报警时间: {{ fctData.warnTime }} </p>
                <p>报警信息: {{ fctData.warnInfo }} </p>
              </div>
              <div>
                <p>设备型号: {{ fctData.equipmentModel }} </p>
                <p>出厂编码: {{ fctData.exFactoryCode }} </p>
                <p>出厂日期: {{ fctData.exFactoryTime }} </p>
              </div>
            </div>
            <div class="info-text">
              <div class="text">
                <div>
                  <p>条码: {{ fctData.sn }}</p>
                  <p>运行模式: {{ fctData.runModel }}</p>
                  <p>气泵压力: {{ fctData.pressure }} </p>
                  <p>测试步骤: {{ fctData.testStep }}</p>
                </div>
                <div>
                  <p>测试下限: {{ fctData.testLower }}</p>
                  <p>测试上限: {{ fctData.testUpper }}</p>
                  <p>测试实际值: {{ fctData.testRrealityValue }}</p>
                  <p>测试标准值: {{ fctData.testStandValue }}</p>
                </div>
              </div>
              <!-- <div>详细参数: 待定</div> -->
            </div>
          </div>
        </div>
        <div
          class="equiment-item"
          v-if="(equimentCode == '' || equimentCode == 'ZM123457') && (equimentStatus == '' || equimentStatus == szfData.equipmentStatus)"
        >
          <div class="equiment-title">
            <span
              :class="{
                color1: szfData.equipmentStatus == 1,
                color2: szfData.equipmentStatus == 2,
                color3: szfData.equipmentStatus == 3,
                color4: szfData.equipmentStatus == 0,
              }"
            ></span>
            <div class="title">{{ szfData.equipmentName }}：{{ szfData.equipmentCode }}</div>
          </div>
          <div
            class="equiment-info"
            :class="{
              color1: szfData.equipmentStatus == 1,
              color2: szfData.equipmentStatus == 2,
              color3: szfData.equipmentStatus == 3,
              color4: szfData.equipmentStatus == 0,
            }"
          >
            <div class="info-top">
              <div class="top-img"><img :src="szfData.equipmentPicture" alt="" /></div>
              <div>
                <p>运行时间: {{ szfData.runTime }}</p>
                <p>报警时间: {{ szfData.warnTime }}</p>
                <p>报警信息: {{ szfData.warnInfo }}</p>
              </div>
              <div>
                <p>设备型号: {{ szfData.equipmentModel }}</p>
                <p>出厂编码: {{ szfData.exFactoryCode }}</p>
                <p>出厂日期: {{ szfData.exFactoryTime }}</p>
              </div>
            </div>
            <div class="info-text">
              <div class="text">
                <div>
                  <p>X轴: {{ szfData.xaxis }}</p>
                  <p>Y轴: {{ szfData.yaxis }}</p>
                  <p>Z轴: {{ szfData.zaxis }}</p>
                  <p>动态搅拌速度: {{ szfData.stirSpeed }}</p>
                </div>
                <div>
                  <p>A1出胶速度: {{ szfData.a1OutSpeed }}</p>
                  <p>B1出胶速度: {{ szfData.b1OutSpeed }}</p>
                  <p>A1泵脉冲: {{ szfData.a1Pulse }}</p>
                  <p>B1泵脉冲: {{ szfData.b1Pulse }}</p>
                </div>
                <div>
                  <p>T链条脉冲: {{ szfData.tPulse }}</p>
                  <p>d1搅拌电机脉冲: {{ szfData.d1Pulse }}</p>
                  <p>A1泵压力值: {{ szfData.a1Pressure }}</p>
                  <p>B1泵压力值: {{ szfData.b1Pressure }}</p>
                </div>
                <div>
                  <p>B输送泵压力值: {{ szfData.bOutPressure }}</p>
                  <p>A1料桶搅拌泵的状态: {{ szfData.a1PumpStatus }}</p>
                  <p>B1料桶搅拌泵的状态: {{ szfData.b1PumpStatus }}</p>
                  <p>加工程序: {{ szfData.nowProgram }}</p>
                </div>
              </div>
              <div v-if="JSON.stringify(szfData) == '{}'">详细参数: 待定</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="eam-equipmentMonitoring" setup>
  import { ref, computed, unref } from 'vue';
  import { sfpt, pcb, fct, szf, selectAirConditioning } from './EquipmentMonitoring.api';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  const { getShowMenu } = useMenuSetting();
  const { getDarkMode } = useRootSetting();

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

  const themeColor = computed(() => unref(getDarkMode.value));
  const equimentCode = ref('');
  const equimentStatus = ref('');
  const statusOptions = ref([
    {
      label: '请选择',
      value: '',
    },
    {
      label: '运行',
      value: '1',
    },
    {
      label: '待机',
      value: '2',
    },
    {
      label: '报警',
      value: '3',
    },
    {
      label: '关机',
      value: '0',
    },
  ]);
  const sfptData = ref({});
  const pcbData = ref({});
  const fctData = ref({});
  const szfData = ref({});
  const airData = ref({});
  airData.value.a1 = 0;
  airData.value.a2 = 0;
  airData.value.a3 = 0;
  function submit() {
    //console.log(equimentStatus.value);
    init();
  }

  init();

  function init() {
    sfpt({}).then((res) => {
      sfptData.value = res;
    });

    pcb({}).then((res) => {
      pcbData.value = res;
    });

    fct({}).then((res) => {
      fctData.value = res;
    });

    szf({}).then((res) => {
      szfData.value = res;
    });
    selectAirConditioning({}).then((res) => {
      console.log(res);
      //循环res
      res.forEach((item) => {
        if (item.name == '室内温度') {
          airData.value['a1'] = item.value;
        }
        if (item.name == '室内湿度') {
          airData.value['a2'] = item.value;
        }
        if (item.name == '室外温度') {
          airData.value['a3'] = item.value;
        }
      });
      //console.log(airData.value);
    });
  }
</script>

<style scoped lang="less">
  .bg {
    background: url('/src/assets/images/bg.gif') center center no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    overflow: hidden;
  }
  .equipmentPage {
    width: calc(100%);
    height: calc(100%);
    // margin: 10px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #1f295c99;
    color: white;

    .status-box {
      width: 40%;
      height: 30px;
      margin-top: 5px;
      display: flex;

      > div {
        width: 120px;
        display: flex;
        font-size: 12px;
        line-height: 20px;

        p {
          width: 30px;
          height: 20px;
          margin-right: 10px;
          border-radius: 3px;
        }
      }
    }

    .cont {
      width: 100%;
      height: calc(100% - 30px);
      display: flex;
      flex-flow: wrap;

      .equiment-item {
        width: 48%;
        height: 45%;
        margin-right: 1%;

        .equiment-title {
          width: 100%;
          height: 20px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;

          span {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .title {
            font-size: 14px;
            line-height: 20px;
          }

          .color1 {
            background-color: #36ce85;
          }

          .color2 {
            background-color: #ffff80;
          }

          .color3 {
            background-color: #ec808d;
          }

          .color4 {
            background-color: #e6e6e6;
          }
        }

        .equiment-info {
          width: 100%;
          height: calc(100% - 40px);
          border-radius: 5px;
          padding: 10px;
          box-sizing: border-box;

          .info-top {
            display: flex;
            margin-bottom: 20px;

            > div {
              flex: 1;
              margin-right: 10px;
              height: 100px;

              p {
                font-size: 12px;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                display: -webkit-box;
                -webkit-box-orient: vertical;
              }

              img {
                width: 50%;
                height: 100%;
              }
            }
          }

          .info-text {
            .text {
              display: flex;

              > div {
                flex: 1;

                p {
                  font-size: 12px;
                  line-height: 15px;
                }
              }
            }
          }
        }

        .color1 {
          border: 2px solid #36ce85;
        }

        .color2 {
          border: 2px solid #ffff80;
        }

        .color3 {
          border: 2px solid #ec808d;
        }

        .color4 {
          border: 2px solid #e6e6e6;
        }
      }
    }
  }

  .rf-cent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 5%;

    .rf-cent-lf,
    .rf-cent-rf,
    .rf-cent-cn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .block-bg {
        position: relative;
        background: url('../assets/images/producion/month.png') no-repeat top left;
        background-size: 100% 100%;
        text-align: center;
        color: #ffb016;
        margin-right: 20px;
      }

      .block-text {
        width: 50%;
      }
    }

    .block-bg {
      width: 80px;
      height: 80px;

      .text-scal {
        font-size: 18px;

        .text-detail {
          font-size: 22px;
          font-weight: bold;
        }

        .text-press {
          font-size: 22px;
        }
      }

      .circle-line1 {
        width: 80px;
        height: 80px;
      }
    }

    .block-text {
      text-align: center;
      font-size: 18px;
    }

    .rf-cent-rf {
      .block-bg {
        color: #26ec10;
      }
    }

    .rf-cent-cn {
      .block-bg {
        color: #ffb016;
      }
    }

    .rf-cent-lf {
      .block-bg {
        color: rgb(4, 153, 253);
      }
    }
  }
</style>
