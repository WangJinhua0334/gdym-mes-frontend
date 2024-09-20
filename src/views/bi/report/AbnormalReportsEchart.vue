<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '280px',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  watch(
    () => props.data,
    () => {
      //console.log(props.data);
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680',
            },
          },
        },
        grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
        xAxis: {
          type: 'category',
          data: props.data.xData,
        },
        yAxis: {
          type: 'value',
          //max: 10,
          splitNumber: 4,
        },
        series: [
          {
            data: props.data.yData,
            type: 'bar',
            barMaxWidth: 80,
            label: {
              show: true,
              position: 'inside',
              fontWeight: 'bold',
            },
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
