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
const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);
watch(
  () => props.data,
  () => {
    setOptions({
      grid: {
        top: '22%',
        left: '5%',
        right: '17%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name:'月份',
        nameTextStyle:{
             color: '#fff',
             fontSize: 14*localStorage.remScale
          },
        boundaryGap: false,
        data: props.data.xData,
        axisLine: {show: false},
        axisTick: { show: false, },
        splitLine: {show: false},
        axisLabel: {
          show: true,
          color: "#fff",
          fontSize: 14*localStorage.remScale
        }
      },
      yAxis: {
        type: 'value',
        name:'数量',
        nameTextStyle:{
             color: '#fff',
             fontSize: 14*localStorage.remScale
          },
        axisLine: {show: false},
        axisTick: { show: false, },
        splitLine: {show: false},
        axisLabel: {
          show: true,
          color: "#fff",
          fontSize: 14*localStorage.remScale
        }
      },
      color: ['#33FFFF','#FF8F57','#FAE087'],
      series: [
        {
          name: '保养',
          type: 'line',
          stack: 'Total',
          color: '#FAE087',
          data: props.data.maintainOrder,
          label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                if(params.value != 0){
                  return params.value; 
                }else{
                  return '';
                }
              },
              fontSize: 14*localStorage.remScale,
              color: '#fff'
          }
        },
        {
          name: '体检',
          type: 'line',
          stack: 'Total',
          data: props.data.inspectOrder,
          color: '#FF8F57',
          label: {
            show: true,
              position: 'top',
              formatter: function(params) {
                console.log(params)
                if(params.value != 0){
                  return params.value; 
                }else{
                  return '';
                }
              },
              fontSize: 14*localStorage.remScale,
              color: '#fff'
          }
        },
        {
          name: '维修',
          type: 'line',
          stack: 'Total',
          color: '#33FFFF',
          data: props.data.repairOrder,
          label: {
            show: true,
              position: 'top',
              formatter: function(params) {
                console.log(params)
                if(params.value != 0){
                  return params.value; 
                }else{
                  return '';
                }
              },
              fontSize: 14*localStorage.remScale,
              color: '#fff'
          }
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
