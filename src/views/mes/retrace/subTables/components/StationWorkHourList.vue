<template>
  <dv-scroll-board :config="config" style="width: 100%; height: 200px" />
</template>

<script lang="ts" setup>
  import { Ref, ref, onMounted, getCurrentInstance, nextTick, watch } from 'vue';
  import { actionsWorkHourList } from '../ProducttionRecordModal.api';
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
      '<span style="color:#000;font-weight: bold;">动作</span>',
      '<span style="color:#000;font-weight: bold;">开工时间</span>',
      '<span style="color:#000;font-weight: bold;">完工时间</span>',
      '<span style="color:#000;font-weight: bold;">标准工时</span>',
      '<span style="color:#000;font-weight: bold;">实际工时</span>',
      '<span style="color:#000;font-weight: bold;">操作人</span>',
    ],
    headerHeight: 30 * localStorage.remScale,
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
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

  function loadInspList() {
    const params = {};
    params['id'] = props.id;
    params['stationId'] = props.stationId;
    let newData = [];
    actionsWorkHourList(params).then((res) => {
      console.log(res);
      res.forEach((item) => {
        newData.push([
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moPlanId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.actionId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.startTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.completeTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.standardHours) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.actualHours) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.operateBy_dictText) + '</span>',
        ]);
      });
      config.value.data = newData;
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
