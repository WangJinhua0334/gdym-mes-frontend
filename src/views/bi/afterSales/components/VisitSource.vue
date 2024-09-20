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
    var effectScatterItemStyle = { type: 'radial',
    x: 0.5,
    y: 0.5,
    r: 0.5,
    colorStops: [{
        offset: 0, color: '#001A99' // 0% 处的颜色
    }, {
        offset: 1, color: '#33FFFF' // 100% 处的颜色
    }],
    global: false }
    var points = [
      // 点坐标
      { value: [116.405285 , 39.904989 ], itemStyle: { color: effectScatterItemStyle},},
      { value: [117.190182 , 39.125596], itemStyle: { color: effectScatterItemStyle },},
      { value: [114.502461 , 38.045474 ], itemStyle: { color: effectScatterItemStyle }, },
      { value: [112.549248 , 37.857014 ], itemStyle: { color: effectScatterItemStyle },},
      { value: [111.670801 , 40.818311], itemStyle: { color: effectScatterItemStyle },},
      { value: [123.429096 , 41.796767], itemStyle: { color: effectScatterItemStyle },},
      { value: [125.3245 , 43.886841], itemStyle: { color: effectScatterItemStyle },},
      { value: [126.642464 , 45.756967], itemStyle: { color: effectScatterItemStyle },},
      { value: [115.892151 , 28.676493], itemStyle: { color: effectScatterItemStyle },},
      { value: [118.767413 , 32.041544], itemStyle: { color: effectScatterItemStyle },},
      { value: [117.000923 , 36.675807], itemStyle: { color: effectScatterItemStyle },},
      { value: [117.283042 , 31.86119], itemStyle: { color: effectScatterItemStyle },},
      { value: [119.306239 , 26.075302], itemStyle: { color: effectScatterItemStyle },},
      { value: [113.665412 , 34.757975], itemStyle: { color: effectScatterItemStyle },},
      { value: [114.298572 , 30.584355], itemStyle: { color: effectScatterItemStyle },},
      { value: [112.982279 , 28.19409], itemStyle: { color: effectScatterItemStyle },},
      { value: [113.280637 , 23.125178], itemStyle: { color: effectScatterItemStyle },},
      { value: [106.504962 , 29.533155], itemStyle: { color: effectScatterItemStyle },},
      { value: [104.065735 , 30.659462], itemStyle: { color: effectScatterItemStyle },},
      { value: [106.713478 , 26.578343], itemStyle: { color: effectScatterItemStyle },},
      { value: [102.712251 , 25.040609], itemStyle: { color: effectScatterItemStyle },},
      { value: [108.948024 , 34.263161], itemStyle: { color: effectScatterItemStyle },},
      { value: [103.823557 , 36.058039], itemStyle: { color: effectScatterItemStyle },},
      { value: [106.278179 , 38.46637], itemStyle: { color: effectScatterItemStyle },},
      { value: [87.617733 , 43.792818], itemStyle: { color: effectScatterItemStyle },},
      { value: [123.429096 , 41.796767], itemStyle: { color: effectScatterItemStyle },},
      { value: [123.429096 , 41.796767], itemStyle: { color: effectScatterItemStyle },}
    ]
    setOptions({
      backgroundColor: 'transparent', // 设置背景色透明
      // 必须设置
      tooltip: {
        show: false
      },
      // 地图阴影配置
      geo: {
        map: 'china',
        // 这里必须定义，不然后面series里面不生效
        tooltip: {
          show: false
        },
        label: {
          show: false
        },
        zoom: 1.03,
        silent: true, // 不响应鼠标时间
        show: true,
        roam: false, // 地图缩放和平移
        aspectScale: 0.75, // scale 地图的长宽比
        itemStyle: {
          borderColor: '#0FA3F0',
          borderWidth: 1,
          areaColor: '#00F1FF',
          shadowColor: 'rgba(1,34,73,0.48)',
          shadowBlur: 10,
          shadowOffsetX: -10, //
          shadowOffsetY: 10
        },
        select: {
          disabled: true
        },
        emphasis: {
          disabled: true,
          areaColor: 'rgba(31,120,255,0.26)'
        },
        // 地图区域的多边形 图形样式 阴影效果
        // z值小的图形会被z值大的图形覆盖
        top: '18%',
        left: 'center',
        // 去除南海诸岛阴影 series map里面没有此属性
        regions: [{
          name: '南海诸岛',
          selected: false,
          emphasis: {
            disabled: true
          },
          itemStyle: {
            areaColor: '#00000000',
            borderColor: '#00000000'
          }
        }],
        z: 1
      },
      series: [
        // 地图配置
        {
          type: 'map',
          map: 'china',
          zoom: 1,
          tooltip: {
            show: false
          },
          label: {
            show: true, // 显示省份名称
            color: '#ffffff',
            align: 'center',
            fontSize: 11*localStorage.remScale
          },
          top: '18%',
          left: 'center',
          aspectScale: 0.75,
          roam: false, // 地图缩放和平移
          itemStyle: {
            borderColor: '#3ad6ff', // 省分界线颜色  阴影效果的
            borderWidth: 1,
            areaColor: '#0045de',
            opacity: 1
          },
          // 去除选中状态
          select: {
            disabled: true
          },
          emphasis: { // 聚焦后颜色
            disabled: false, // 开启高亮
            label: {
              align: 'center',
              color: '#ffffff'
            },
            itemStyle: {
              color: '#ffffff',
              areaColor: '#0075f4'// 阴影效果 鼠标移动上去的颜色
            }
          },
          z: 1
        },
        // 点
    {
      name: 'companyPoint',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      showEffectOn: 'render',
      // zlevel: 2, // zlevel用于 Canvas 分层 相同的绘制在同一个canvas上
      rippleEffect: {
        number: 3, // 波纹数量
        period: 4, // 动画周期 数值越大，波动越慢
        scale: 2.5, // 动画中波纹的最大缩放比例
        brushType: 'stroke' // 波纹的绘制方式 stroke fill
      },
      label: {
        show: true,
        position: 'bottom',
       fontWeight: 400,
       formatter: '{b}',
        color: 'black',
        fontSize: 14*localStorage.remScale
      },
      symbol: 'circle',
      symbolSize: 10,
      data: points,
      tooltip: {
        alwaysShowContent:true,
        show: false,
        backgroundColor: 'rgba(0,0,0,0)',
        padding: 0,
        borderWidth: 0,
        extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);', // 去除box-shadow阴影
        formatter: (params) => {}
      },
      z: 4
    },
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>
