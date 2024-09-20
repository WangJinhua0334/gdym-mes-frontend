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
      default: '400px',
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
          top: '18%',
          bottom: '18%',
        },
        xAxis: {
          type: 'category',
          name: '设备',
          nameTextStyle: {
            color: '#fff',
            fontSize: 14 * localStorage.remScale,
          },
          data: props.data.Xdata,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DEEBFF',
            },
          },
          axisLabel: {
            show: true,
            fontSize: 14 * localStorage.remScale,
            interval: 0, //使x轴文字显示全
            // val 打印出来是 data 里的字符串
            formatter: function (params) {
              var newParamsName = '';
              var paramsNameNumber = params.length;
              var provideNumber = 8; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = '';
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
        },
        yAxis: {
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
          axisTick: {
            show: true,
          },
          type: 'value',
          splitLine: {
            show: false,
          },
        },
        color: ['#FFA070', '#3BEDDE'],
        series: [
          {
            data: props.data.actualCount,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#437FDB' },
                { offset: 1, color: '#33FFFF' },
              ]),
            },
            barMaxWidth: 20,
            label: {
              show: true,
              position: 'top',
              fontSize: 14 * localStorage.remScale,
            },
          },
          {
            data: props.data.planCount,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FF7E3D' },
                { offset: 1, color: '#FAE087' },
              ]),
            },
            barMaxWidth: 20,
            label: {
              show: true,
              position: 'top',
              fontSize: 14 * localStorage.remScale,
            },
          },
        ],
      });
    },
    { immediate: true, deep: true }
  );
</script>
