<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
import "echarts-wordcloud";//引入词云
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
      tooltip: {
        show: true,
        position: 'top',
        textStyle: {
          fontSize: 20*localStorage.remScale,
        }
      },
      series: [{
        type: "wordCloud",
        // 网格大小，各项之间间距
        gridSize: 20*localStorage.remScale,
        // 形状 circle 圆，cardioid  心， diamond 菱形，
        // triangle-forward 、triangle 三角，star五角星
        shape: 'circle',
        // 字体大小范围
        sizeRange: [20, 30],
        // 文字旋转角度范围
        rotationRange: [0, 90],
        // 旋转步值
        rotationStep: 90,
        // 自定义图形
        // maskImage: maskImage,
        left: 'center',
        top: 'center',
        // 画布宽
        width: '90%',
        // 画布高
        height: '80%',
        // 是否渲染超出画布的文字
        drawOutOfBound: false,
        textStyle: {
          color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 200 + 55),
                Math.round(Math.random() * 200 + 55),
                Math.round(Math.random() * 200 + 55)
              ].join(',') + ')';
            },
          emphasis: {
            shadowBlur: 10*localStorage.remScale,
            shadowColor: '#2ac'
          }
        },
        data: props.data
      }]
    });
  },
  { immediate: true, deep: true }
);
</script>
