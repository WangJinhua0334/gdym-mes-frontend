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
    let angle = 0; //角度，用来做简单的动画效果的
    let value = props.data.data; //图上角度数据
    setOptions({
      title: [
        {
          text: "{a|" + value + "}{c|%}",
          x: "center",
          y: "center",
          textStyle: {
            rich: {
              a: {
                fontSize: 20*localStorage.remScale,
                color: props.data.color,
                fontWeight: "bold",
              },
              c: {
                fontSize: 12*localStorage.remScale,
                color: props.data.color
              },
            },
          },
        },
        {
          left: 'center',
          top: '70%',
          subtext: props.data.name,
          subtextStyle: {
            fontSize: 16*localStorage.remScale,
            color: "#fff",
          }
        }
      ],
      series: [
        {
          name: "",
          type: "custom",
          coordinateSystem: "none",
          renderItem: function (params, api) {
            return {
              type: "arc",
              shape: {
                cx: api.getWidth() / 2,
                cy: api.getHeight() / 2,
                r: (Math.min(api.getWidth(), api.getHeight()) / 1.5) * 0.45,
                startAngle: ((0 + -angle) * Math.PI) / 180,
                endAngle: ((360 + -angle) * Math.PI) / 180,
              },
              style: {
                stroke: "#0CD3DB",
                fill: "transparent",
                lineWidth: 2.5*localStorage.remScale,
              },
              silent: true,
            };
          },
          data: [0],
        },
        {
          name: "",
          type: "pie",
          radius: ["45%", "35%"],
          silent: true,
          clockwise: true,
          startAngle: 90,
          z: 0,
          zlevel: 0,
          label: {
            position: "center",
          },

          data: [
            {
              value: value,
              name: "",
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
                      color: "#1F78FF", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#33FFFF", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                }
              },
            },
            {
              value: 100 - value,
              name: "",
              label: {
                show: false,
              },
              itemStyle: {
                color: "#1F78FF",
                opacity: 0.4,
              },
            },
          ],
        },
        {
          name: "",
          type: "gauge",
          radius: "68%",
          center: ["50%", "50%"],
          startAngle: 0,
          endAngle: 360,
          splitNumber: 20*localStorage.remScale,
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 10*localStorage.remScale,
            lineStyle: {
              width: 1,
              color: "rgba(0,0,0,0.6)",
            },
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              opacity: 0,
            },
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: 0,
              name: "",
            },
          ],
        },
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
