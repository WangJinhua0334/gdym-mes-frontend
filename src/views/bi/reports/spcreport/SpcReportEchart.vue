<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
  import * as echarts from 'echarts';

  // 假设 useECharts hook 的简化实现，如果项目中没有，可以替换为直接使用 echarts
  // 这里为了兼容原始代码结构，提供一个基础的实现
  function useECharts(elRef: Ref<HTMLDivElement | null>) {
    let chartInstance: echarts.ECharts | null = null;

    const setOptions = (options: echarts.EChartsOption) => {
      if (elRef.value) {
        if (!chartInstance) {
          chartInstance = echarts.init(elRef.value);
        }
        chartInstance.setOption(options, true); // 使用 notMerge: true 确保更新
      }
    };

    return { setOptions };
  }

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
      const series = props.data.series.map((item: any, index: number) => ({
        name: item.name,
        data: item.data.map((value: any) => value),
        type: item.type || 'line',
        smooth: true,
        itemStyle: {
          color: item.color || ['#f5222d', '#ff4d4f', '#ff7875', '#ffccc7', '#ffa39e'][index % 10],
        },
        label: {
          show: item.showLabel === undefined ? true : item.showLabel,
          position: item.labelPosition || 'top',
          fontWeight: 'bold',
        },
      }));
      const auxiliaryLineColor = '#87CEEB';
      // 定义辅助线的Y轴值和样式
      const markLines = [
        { yAxis: 1.33, lineStyle: { color: auxiliaryLineColor }, label: { formatter: '1.33', position: 'start' } },
        { yAxis: 1.67, lineStyle: { color: auxiliaryLineColor }, label: { formatter: '1.67', position: 'start' } },
        { yAxis: 2.0, lineStyle: { color: auxiliaryLineColor }, label: { formatter: '2.00', position: 'start' } },
      ];

      // 为每个系列添加辅助线
      series.forEach((s: any) => {
        s.markLine = {
          silent: true, // 辅助线不响应鼠标事件
          symbol: 'none', // 不显示标记符号
          data: markLines,
        };
      });

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
          max: 4, // 固定Y轴最大值为5
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
