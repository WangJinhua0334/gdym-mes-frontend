<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
import { afterSalesProducts } from '../afterSales.api';
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
    default: () => ({})
  }
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.data,
  () => {
    let category = ref<any>([]);
    if (props.data.length != 0) {
      category.value = props.data
      let yName = [], xName = []; // y轴名称
      let bgData = []; // 最大值用作背景显示的数据
      let maxValue = props.data.sort((a, b) => b.value - a.value)[0].value; //最大值
      category.value.forEach(element => {
        yName.push(element.name);
        xName.push(element.value)
        bgData.push({
          name: element.name,
          value: maxValue,
          type: element.type,
        });
      });
      setOptions({
        xAxis: {
          max: maxValue,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        grid: {
          left: '5%',
          top: 0,
          right: '15%',
          bottom: 0
        },
        yAxis: [
          { // 每条图形上面的文字
            inverse: true,
            data: yName,
            axisLabel: {
              inside: true,
              verticalAlign: 'bottom',
              lineHeight: 16*localStorage.remScale,
              margin: 0,       //刻度标签与轴线之间的距离
              formatter: function (value,index) {
                const id = index + 1;
                if (id < 4) {
                  return `{icon${id}|No.${id}} {a|${value}}`
                } else {
                  return `{count|No.${id}} {a|${value}}`
                }

              },
              rich: {
                icon1: {
                  padding: [5, 0, 5, 0],
                  align: 'center',
                  color: '#FF7088',
                  fontSize: 20*localStorage.remScale,
                  fontFamily: 'num'
                },
                icon2: {
                  padding: [5, 0, 5, 0],
                  align: 'center',
                  color: '#FF8F57',
                  fontSize: 20*localStorage.remScale,
                  fontFamily: 'num'
                },
                icon3: {
                  padding: [5, 0, 5, 0],
                  align: 'center',
                  color: '#33FFFF',
                  fontSize: 20*localStorage.remScale,
                  fontFamily: 'num'
                },
                count: {
                  padding: [5, 0, 5, 0],
                  align: 'center',
                  color: '#1F78FF',
                  fontSize: 20*localStorage.remScale,
                  fontFamily: 'num'
                },
                a: {
                  fontSize: 18*localStorage.remScale,
                  color: '#D6E0FC',
                  padding: [5, 0, 5, 0],
                }
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          }
        ],
        series: [
          {
            // 背景样式
            name: '背景',
            type: "pictorialBar",
            barWidth: 6*localStorage.remScale,
            // barHeight: 10,
            stack: '总量',
            barGap: '-100%',
            symbol: 'rect',
            symbolRepeat: 'fixed',
            legendHoverLink: false,
            itemStyle: {
              color: 'rgba(153, 153, 153, 0.23)'
            },
            data: bgData,
            symbolSize: [6*localStorage.remScale, 15*localStorage.remScale],
            symbolPosition: 'start',
            symbolOffset: [0, 20*localStorage.remScale],
            animation: false, //关闭动画
            z: 0
          },
          {
            name: 'info',
            type: "pictorialBar",
            barWidth: 6*localStorage.remScale,
            legendHoverLink: false,
            silent: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#437FDB',
                  },
                  {
                    offset: 1,
                    color: '#33FFFF',
                  },
                ],
                global: false // 缺省为 false
              }
            },
            symbolRepeat: 'fixed',
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [6*localStorage.remScale, 15*localStorage.remScale],
            symbolPosition: 'start',
            symbolOffset: [0, 20*localStorage.remScale],
            data: category.value,
            label:{
              show:true,
              color: '#fff',
              fontSize: 18*localStorage.remScale,
              formatter:function(params){
                return params.value
              },
              position:"right",
              offset: [5, 10],
            },
            z: 1,
          },
        ]
      });
    }

  },
  { immediate: true, deep: true }
);
</script>
