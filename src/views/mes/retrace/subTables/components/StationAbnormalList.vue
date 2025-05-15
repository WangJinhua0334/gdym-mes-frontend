<template>
  <div v-if="isShow" :style="{ height: containerHeight }" style="margin: 20px 0px" ref="scrollBoardContainer">
    <p>异常记录：</p>
    <dv-scroll-board :config="config" style="width: 100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { actionsAbnormalList } from '../ProducttionRecordModal.api';
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
      '<span style="color:#000;font-weight: bold;">工作中心</span>',
      '<span style="color:#000;font-weight: bold;">工位</span>',
      '<span style="color:#000;font-weight: bold;">异常类型</span>',
      '<span style="color:#000;font-weight: bold;">内容</span>',
      '<span style="color:#000;font-weight: bold;">问题设备</span>',
      '<span style="color:#000;font-weight: bold;">状态</span>',
      '<span style="color:#000;font-weight: bold;">提交人</span>',
      '<span style="color:#000;font-weight: bold;">提交时间</span>',
      '<span style="color:#000;font-weight: bold;">响应人</span>',
      '<span style="color:#000;font-weight: bold;">响应时间</span>',
      '<span style="color:#000;font-weight: bold;">处理措施</span>',
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

  function loadAbnormalList() {
    const params = {};
    params['id'] = props.id;
    params['stationId'] = props.stationId;
    let newData = [];
    actionsAbnormalList(params).then((res) => {
      res.forEach((item) => {
        newData.push([
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.wkcId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.wkpId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.typeId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px;overflow:hidden;" title="'+ReturnValue(item.content)+'">' + ReturnValue(item.content) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.equipmentId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.status_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.createBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.createTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.responseBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.responseTime) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px;overflow:hidden;" title="'+ReturnValue(item.measure)+'">' + ReturnValue(item.measure) + '</span>',
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
        loadAbnormalList();
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
    loadAbnormalList();
  });
</script>

<style lang="less" scoped></style>
