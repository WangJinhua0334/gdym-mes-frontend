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
          right: '15%',
          bottom: '15%',
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            nameTextStyle: {
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
            data: props.data.xData,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DEEBFF',
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#fff',
              fontSize: 14 * localStorage.remScale,
            },
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
            nameGap: 5,
            interval: 10,
            splitLine: {
              show: false,
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
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              show: true,
              formatter: '{value} %',
              fontSize: 14 * localStorage.remScale,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#FFA070',
                opacity: 0,
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '月产量',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#33FFFF' },
                { offset: 1, color: '#437FDB' },
              ]),
            },
            data: props.data.okQty,
          },
          {
            name: '合格率',
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
              width: 2 * localStorage.remScale,
            },
            itemStyle: {
              color: '#FFA070',
            },
            // smooth: true,
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              },
            },
            data: props.data.monthOkRate,
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
