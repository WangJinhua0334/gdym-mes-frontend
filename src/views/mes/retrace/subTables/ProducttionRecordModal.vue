<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :destroy-on-close="true" :title="title" :showOkBtn="false" :defaultFullscreen="true">
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel
        :key="index"
        v-for="(item, index) in record"
        :header="item.stationName"
        style="border: 1px solid #0095ff; background-color: #0077b312"
      >
        <div class="ant-row">
          <div class="ant-col ant-col-4 ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-4 ant-col-xl-4 ant-col-xxl-4">
            <p>工序信息：</p>
            <p
              >状态：<span>{{ ReturnValue(item.status_dictText) }}</span></p
            >
            <p
              >数量：<span>{{ ReturnValue(item.qty) }}</span></p
            >
            <p
              >合格：<span>{{ ReturnValue(item.okQty) }}</span></p
            >
            <p
              >不合格：<span>{{ ReturnValue(item.ngQty) }}</span></p
            >
            <p
              >报废：<span>{{ ReturnValue(item.scrapedQty) }}</span></p
            >
            <p
              >工时：<span>{{ ReturnValue(item.workHour) }}</span></p
            >
          </div>
          <div class="ant-col ant-col-4 ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-4 ant-col-xl-4 ant-col-xxl-4">
            <p>开工(完工)信息：</p>
            <p
              >工作中心：<span>{{ ReturnValue(item.wkcName) }}</span></p
            >
            <p
              >开工人：<span>{{ ReturnValue(item.startUser) }}</span></p
            >
            <p
              >开工时间：<span>{{ ReturnValue(item.startTime) }}</span></p
            >
            <p
              >开工工位：<span>{{ ReturnValue(item.startWorkStation) }}</span></p
            >
            <p
              >完工人：<span>{{ ReturnValue(item.endUser) }}</span></p
            >
            <p
              >完工时间：<span>{{ ReturnValue(item.endTime) }}</span></p
            >
            <p
              >完工工位：<span>{{ ReturnValue(item.endWorkStation) }}</span></p
            >
          </div>
          <div class="ant-col ant-col-16 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-16 ant-col-xl-16 ant-col-xxl-16">
            <p>检验信息：</p>
            <StationInspList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
        <div class="ant-row">
          <div class="ant-col ant-col-24 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ant-col-xxl-24">
            <p>生产调试记录：</p>
            <StationProductTestList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
        <div class="ant-row">
          <div class="ant-col ant-col-24 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ant-col-xxl-24">
            <p>物料绑定记录：</p>
            <StationProductBindList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
        <div class="ant-row">
          <div class="ant-col ant-col-24 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ant-col-xxl-24">
            <p>物料解绑记录：</p>
            <StationProductUnBindList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
        <div class="ant-row">
          <div class="ant-col ant-col-24 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ant-col-xxl-24">
            <p>报工记录：</p>
            <StationWokeList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
        <div class="ant-row">
          <div class="ant-col ant-col-24 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24 ant-col-xxl-24">
            <p>工时记录：</p>
            <StationWorkHourList :id="item.lotId" :stationId="item.stationId" :destroy-on-close="true" />
          </div>
        </div>
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
