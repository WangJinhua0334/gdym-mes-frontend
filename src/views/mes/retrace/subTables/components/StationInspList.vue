<template>
  <div v-if="isShow" :style="{ height: containerHeight }" style="margin: 20px 0px" ref="scrollBoardContainer">
    <p>过程检验信息：</p>
    <dv-scroll-board :config="config" style="width: 100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { actionsInspList } from '../ProducttionRecordModal.api';
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
    stationId: {
      type: String,
      default: '',
    },
  });

  const config = ref({
    header: [
      '<span style="color:#000;font-weight: bold;">检验时间</span>',
      '<span style="color:#000;font-weight: bold;">判定人</span>',
      '<span style="color:#000;font-weight: bold;">结果</span>',
      '<span style="color:#000;font-weight: bold;">缺陷代码</span>',
      '<span style="color:#000;font-weight: bold;">缺陷说明</span>',
      '<span style="color:#000;font-weight: bold;">维修人</span>',
      '<span style="color:#000;font-weight: bold;">维修时间</span>',
      '<span style="color:#000;font-weight: bold;">维修说明</span>',
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
    ],
    align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
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

  function loadInspList() {
    const params = {};
    params['id'] = props.id;
    params['stationId'] = props.stationId;
    let newData = [];
    actionsInspList(params).then((res) => {
      res.forEach((item) => {
        newData.push([
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.inspTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.inspBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.result) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.defectCode) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px;overflow:hidden;" title="'+ReturnValue(item.defectDes)+'">' + ReturnValue(item.defectDes) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.repairBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.repairTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.repairDes) + '</span>',
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
        loadInspList();
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
    loadInspList();
  });
</script>

<style lang="less" scoped></style>
