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
        show: false
      },
      visualMap: {
        show: false,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '80%',
          center: ['50%', '60%'],
          data: props.data.sort(function (a, b) {
            return b.value - a.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 1)',
            formatter: '{b}\n{c}%',
            minMargin: 5*localStorage.remScale,
            edgeDistance: 10*localStorage.remScale,
            lineHeight: 15*localStorage.remScale,
            fontSize: 16*localStorage.remScale
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 1)'
            },
            smooth: 0.2,
            length: 15*localStorage.remScale,
            length2: 15*localStorage.remScale,
            maxSurfaceAngle: 90
          },
          labelLayout: function (params) {
            const isLeft = params.labelRect.x + params.labelRect.width;
            const points = params.labelLinePoints;
            return {
              labelLinePoints: points
            };
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
