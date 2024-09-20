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
    default: () => ({})
  }
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
watch(
  () => props.data,
  () => {
    console.log(localStorage.remScale)
    let echartsData = ref<any>([]);
    props.data.forEach(item => {
      if(item.value > 95){
        echartsData.value.push({
          value: item.value, 
          name: item.name, 
          itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#FF8F57", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#FAE087", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                }
              }
        })
      }else{
        echartsData.value.push({
          value: item.value, 
          name: item.name, 
          itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#437FDB", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#33FFFF", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                }
              }
        })
      }
    });
    setOptions({
      legend: {
        show: false
      },
      tooltip: {
        show: true,
        textStyle: {
          fontSize: 12*localStorage.remScale,
        },
        formatter: function (param) {
          return param.name + ': ' + (param.value)
        }
      },
      color: ['#FF8F57', '#437FDB'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: [20*localStorage.remScale, 90*localStorage.remScale],
          center: ['50%', '50%'],
          roseType: 'area',
          label: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
              color: '#fff',
              fontSize: 12*localStorage.remScale
          },
          data: echartsData
        },
        {
          name: '',
          type: 'pie',
          radius: [20*localStorage.remScale, 90*localStorage.remScale],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 4
          },
          
          label: {
            formatter: params => {
              return (
                '{name|' + params.name + '}'
              );
            },
            rich: {
              name: {
                fontSize: 12*localStorage.remScale,
                padding: [0, 0, 0, 10],
                color: '#fff'
              },
              value: {
                fontSize: 14*localStorage.remScale,
                padding: [10, 0, 0, 10],
                color: '#fff'
                // color: '#333333'
              }
            },
          },
          labelLine: {
            length: 20*localStorage.remScale,
            length2: 10*localStorage.remScale
          },
          data: echartsData
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
