<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :destroy-on-close="true" :title="title" :showOkBtn="false" :defaultFullscreen="true">
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel
        :key="index"
        v-for="(item, index) in record"
        :header="item.stationName"
        style="border: 1px solid #0095ff; background-color: #0077b312"
      >
        <a-row :gutter="16">
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >状态：<span>{{ ReturnValue(item.status_dictText) }}</span></p
            >
            <p
              >开工人：<span>{{ ReturnValue(item.startUser) }}</span></p
            >
          </a-col>
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >数量：<span>{{ ReturnValue(item.qty) }}</span></p
            >
            <p
              >开工时间：<span>{{ ReturnValue(item.startTime) }}</span></p
            >
          </a-col>
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >合格：<span>{{ ReturnValue(item.okQty) }}</span></p
            >
            <p
              >开工工位：<span>{{ ReturnValue(item.startWorkStation) }}</span></p
            >
          </a-col>
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >不合格：<span>{{ ReturnValue(item.ngQty) }}</span></p
            >
            <p
              >完工人：<span>{{ ReturnValue(item.endUser) }}</span></p
            >
          </a-col>
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >报废：<span>{{ ReturnValue(item.scrapedQty) }}</span></p
            >
            <p
              >完工时间：<span>{{ ReturnValue(item.endTime) }}</span></p
            >
          </a-col>
          <a-col :span="4" :xs="24" :sm="12" :md="12" :lg="4" :xl="4" :xxl="4">
            <p
              >工作中心：<span>{{ ReturnValue(item.wkcName) }}</span></p
            >
            <p
              >完工工位：<span>{{ ReturnValue(item.endWorkStation) }}</span></p
            >
          </a-col>
        </a-row>

        <!-- 其他子组件 -->
        <a-row>
          <a-col :span="24">
            <StationWokeList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationWorkHourList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationOutInspList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationProductTestList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationProductBindList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationProductUnBindList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <StationAbnormalList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </BasicModal>
</template>

<script lang="ts" name="ams-reports-amsRepairCount" setup>
  import { actionsList } from './ProducttionRecordModal.api';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import StationInspList from './components/StationInspList.vue';
  import StationWokeList from './components/StationWokeList.vue';
  import StationProductTestList from './components/StationProductTestList.vue';
  import StationProductBindList from './components/StationProductBindList.vue';
  import StationProductUnBindList from './components/StationProductUnBindList.vue';
  import StationWorkHourList from './components/StationWorkHourList.vue';
  import StationOutInspList from './components/StationOutInspList.vue';
  import StationAbnormalList from './components/StationAbnormalList.vue';
  import '/@/utils/flexible.js';
  import { computed, ref, unref } from 'vue';

  //动作记录
  const record = ref<any>([]);
  //let flagvue=false;
  //默认启用界面
  const activeKey = ref(['0']);
  //接收信息
  let id = ref('');
  let wfsId = ref('');
  let sn = ref('');
  //let station = ref('');
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    sn.value = unref(data).record.sn;
    //station.value = unref(data).record.stationName;
    id.value = unref(data).record.id;
    wfsId.value = unref(data).record.wfsId;
    loadListData();
  });
  /**
   * 加载动作事件数据
   */
  function loadListData() {
    const params = {};
    params['id'] = id.value;
    params['wfsId'] = wfsId.value;
    actionsList(params).then((data) => {
      record.value = data;
      //flagvue=true;
    });
  }
  /**
   * 去除undefined，null，'null'
   */
  function ReturnValue(value) {
    if (value && value != null && value != 'null') {
      return value;
    }
    return '';
  }
  //设置标题
  const title = computed(() => 'SN条码：[' + sn.value + ']的生产记录');
</script>

<style scoped>
  div p {
    font-weight: bold;
  }
  div p span {
    font-weight: normal;
  }
</style>
