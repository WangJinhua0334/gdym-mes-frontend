<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '400px',
    },
    data: {
      type: Object,
      default: () => ({
        xData: [],
        series: [],
      }),
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.data,
    () => {
      const series = props.data.series.map((item, index) => ({
        name: item.name,
        data: item.data.map((value) => value),
        type: item.type || 'line',
        smooth: true,
        itemStyle: {
          color:
            item.color || ['#2196F3', '#08C9C9', '#00C345', '#FAD714', '#FF9300', '#F52222', '#EB2F96', '#7500EA', '#2D46C4', '#484848'][index % 10],
        },
        label: {
          show: item.showLabel === undefined ? true : item.showLabel,
          position: item.labelPosition || 'top',
          fontWeight: 'bold',
        },
      }));

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680',
            },
          },
          formatter: (params: any[]) => {
            let tooltipHtml = '';
            params.forEach((param) => {
              tooltipHtml += `<div>${param.seriesName}: ${param.value}</div>`;
            });
            return tooltipHtml;
          },
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'top',
        },
        grid: { left: '1%', right: '1%', top: '15%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: props.data.xData,
          axisLabel: {
            interval: 0,
            formatter: function (value: string) {
              const maxLength = 5;
              let formattedValue = '';
              for (let i = 0; i < value.length; i += maxLength) {
                formattedValue += value.slice(i, i + maxLength) + '\n';
              }
              return formattedValue.trim();
            },
            rich: {
              a: {
                lineHeight: 14,
              },
            },
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: 4,
        },
        series: series,
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 100,
            xAxisIndex: [0],
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
            xAxisIndex: [0],
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
