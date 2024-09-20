<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
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
            name: '月份',
            nameTextStyle: {
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DEEBFF',
              },
            },
            axisLabel: {
              show: true,
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
            data: props.data.Xdata,
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            nameTextStyle: {
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DEEBFF',
              },
            },
            axisLabel: {
              show: true,
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '计划维修',
            type: 'line',
            // stack: 'Total',
            lineStyle: {
              width: 2,
              color: '#427eda',
            },
            smooth: true,
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(31,120,255,.36)',
                },
                {
                  offset: 1,
                  color: 'rgba(31,120,255,.06)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: props.data.plan,
          },
          {
            name: '实际维修',
            type: 'line',
            // stack: 'Total',
            lineStyle: {
              width: 2,
              color: '#32f8fb',
            },
            smooth: true,
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(51,255,255,.36)',
                },
                {
                  offset: 1,
                  color: 'rgba(51,255,255,.06)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: props.data.actual,
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
