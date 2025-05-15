<template>
  <div v-if="isShow" :style="{ height: containerHeight }" style="margin: 20px 0px" ref="scrollBoardContainer">
    <p>物料解绑记录：</p>
    <dv-scroll-board :config="config" style="width: 100%" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { actionsProductUnBindList } from '../ProducttionRecordModal.api';
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
      '<span style="color:#000;font-weight: bold;">物料编码</span>',
      '<span style="color:#000;font-weight: bold;">物料名称</span>',
      '<span style="color:#000;font-weight: bold;">数量</span>',
      '<span style="color:#000;font-weight: bold;">物料条码</span>',
      '<span style="color:#000;font-weight: bold;">物料批次</span>',
      '<span style="color:#000;font-weight: bold;">类型</span>',
      '<span style="color:#000;font-weight: bold;">解绑原因</span>',
      '<span style="color:#000;font-weight: bold;">解绑人</span>',
      '<span style="color:#000;font-weight: bold;">解绑时间</span>',
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
      localStorage.remScale * 400,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 200,
      localStorage.remScale * 300,
      localStorage.remScale * 150,
      localStorage.remScale * 150,
    ],
    align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
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

  function loadProductUnBindList() {
    const params = {};
    params['id'] = props.id;
    params['stationId'] = props.stationId;
    let newData = [];
    actionsProductUnBindList(params).then((res) => {
      res.forEach((item) => {
        newData.push([
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.moPlanId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.prodId_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px;overflow:hidden;" title="'+ReturnValue(item.prodName_dictText)+'">' + ReturnValue(item.prodName_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.qty) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.materialSn) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.materialBatch) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.materialSnType_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px;overflow:hidden;" title="'+ReturnValue(item.unbindReason)+'">' + ReturnValue(item.unbindReason) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.unbindBy_dictText) + '</span>',
          '<span style="color:#000;font-size: 12px;height:20px">' + ReturnValue(item.unbindTime) + '</span>',
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
        loadProductUnBindList();
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
    loadProductUnBindList();
  });
</script>

<style lang="less" scoped></style>
