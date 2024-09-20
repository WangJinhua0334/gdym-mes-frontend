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
    const colors = ['#1F78FF', '#33FFFF', '#FAE087', '#FF7F3E'];
    let data = [{
      name: '',
      value: '',
      itemStyle: {}
    }];
    props.data.forEach((item, index) => {
      data.push({
        name: item.defectName,
        value: item.defectQty,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[index] },
            { offset: 1, color: '#000F5C' }
          ]),
        }
      })
    });
    let spanAngle = 90;
    let repeatedMultiple = 180 / spanAngle;
    let addDataLen = parseInt((repeatedMultiple - 1) * data.length);
    for (let i = 0; i < addDataLen; i++) {
      data.push({
        name: '',
        value: 0,
        tooltip: {
          show: false
        },
        itemStyle: {
          color: 'rgba(0,0,0,0)',
        }
      });
    }
    setOptions({
      color: ['#1F78FF', '#33FFFF', '#FAE087', '#FF7F3E'],
      series: [
        {
          type: 'pie',
          radius: ['0%', '0%'],
          center: ['30%', '80%'],
          clockwise: false,
          data: [{
            name: '',
            value: spanAngle,
            itemStyle: {
              color: 'rgba(220,220,220,0)',
              borderColor: 'rgba(255,255,255,.3)',
            }
          },
          {
            name: '',
            value: 360 - spanAngle,
            itemStyle: {
              color: 'rgba(220,220,220,0)',
            }
          }
          ]
        },
        {
          type: 'pie',
          startAngle: 0,
          roseType: 'area',
          clockwise: false,
          center: ['45%', '80%'],
          radius: ['15%', '120%'],
          data: data,
          label: {
            show: true,
            color: '#fff',
            fontSize: 20*localStorage.remScale,
            formatter: function (params){
              if(params.data.value != 0){
                return `${params.data.name}\n${params.data.value}`
              }
              
            }
          },
          labelLine: {
            length: 1*localStorage.remScale,
            length2: 20*localStorage.remScale,
            smooth: true
          },

        },
        {
          name: '占位',
          type: 'pie',
          silent: true,
          center: ['45%', '80%'],
          radius: '8%',
          z: 3,
          label: {
            show: false,
          },
          data: [{
            value: 100,
            name: '占位2'
          },

          ],
          itemStyle: {
            color: '#fff',
            shadowBlur: 10,
          }
        }, {
          name: '占位',
          type: 'pie',
          silent: true,
          center: ['45%', '80%'],
          radius: '15%',
          z: 2,
          label: {
            show: false,
            position: 'center'
          },
          data: [{
            value: 100,
            name: '占位3'
          },

          ],
          itemStyle: {
            color: '#fff',
            opacity: .3,
            shadowBlur: 40,
          }
        }

      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
