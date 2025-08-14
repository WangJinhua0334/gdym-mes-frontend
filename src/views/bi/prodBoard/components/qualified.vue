<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300px',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.data,
    () => {
      setOptions({
        grid: {
          top: '20%',
          left: '5%',
          right: '14%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            name: '次数',
            axisLine: {
              show: true,
              lineStyle: {
                color: 'white',
              },
            },
            axisLabel: {
              show: true,
              color: 'white',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ccc'],
                width: 1,
                type: 'dashed',
              },
            },
            axisTick: {
              show: true,
              alignWithLabel: true,
            },
            data: props.data.Xdata,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'mm',
            axisLine: {
              show: true,
              lineStyle: {
                color: 'white',
              },
            },
            axisLabel: {
              show: true,
              color: 'white',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ccc'],
                width: 1,
                type: 'dashed',
              },
            },
          },
        ],
        series: [
          {
            name: '高度',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 2,
              color: '#427eda',
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(66, 126, 218, .36)',
                },
                {
                  offset: 1,
                  color: 'rgba(66, 126, 218, .06)',
                },
              ]),
            },
            data: props.data.heightData,
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
