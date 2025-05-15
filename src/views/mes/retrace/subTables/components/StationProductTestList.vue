<template>
  <div v-if="isShow" :style="{ height: containerHeight }" style="margin: 20px 0px" ref="scrollBoardContainer">
    <p>生产调试记录：</p>
    <dv-scroll-board :config="config" style="width: 100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { actionsProductTestList } from '../ProducttionRecordModal.api';
  const props = defineProps({
    id: {
      type: String as PropType<string>,
      default: '',
    },
    stationId: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const config = ref({
    header: [
      '<span style="color:#000;font-weight: bold;">工单</span>',
      '<span style="color:#000;font-weight: bold;">生产任务</span>',
      '<span style="color:#000;font-weight: bold;">生产动作</span>',
      '<span style="color:#000;font-weight: bold;">状态</span>',
      '<span style="color:#000;font-weight: bold;">结果</span>',
      '<span style="color:#000;font-weight: bold;">缺陷代码</span>',
      '<span style="color:#000;font-weight: bold;">设备</span>',
      '<span style="color:#000;font-weight: bold;">附件</span>',
      '<span style="color:#000;font-weight: bold;">测试人</span>',
      '<span style="color:#000;font-weight: bold;">测试时间</span>',
    ],
    headerHeight: 30 * localStorage.remScale,
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
    rowNum: 5,
    columnWidth: [
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
    ],
    align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
  });

  const isShow = ref(false);
  let containerHeight = ref('auto'); // 默认值
  watch(
    () => config.value.data,
    (newData) => {
      if (newData && newData.length > 0) {
        isShow.value = true;
      }
      // 计算新高度
      containerHeight.value = `${35 * newData.length + 70}px`;
    }
  );

  function loadProductTestList() {
    const params = {};
    params['id'] = props.id;
    params['stationId'] = props.stationId;
    let newData = [];
    actionsProductTestList(params).then((res) => {
      res.forEach((item) => {
        newData.push([
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moPlanId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.actionId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.status) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.result_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.defectIds_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.equipmentId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px"><a href="' + ReturnValue(item.attachments) + '" target="_blank">附件</a></span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.testBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.testTime) + '</span>',
        ]);
      });
      config.value.data = newData;
      config.value.rowNum = newData.length;
      config.value = { ...config.value };
    });
  }

  watch(
    () => props.id,
    () => {
      if (props.id && props.id != '') {
        loadProductTestList();
      }
    }
  );

  /**
   * 去除undefined，null，'null'
   */
  function ReturnValue(value) {
    if (value && value != null && value != 'null') {
      return value;
    }
    return '';
  }
  onMounted(() => {
    loadProductTestList();
  });
</script>

<style lang="less" scoped></style>
