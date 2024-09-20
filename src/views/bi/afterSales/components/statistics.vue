<template>
    <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
import { defHttp } from '/@/utils/http/axios';
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
        let icon = 'path://M0,27V9L16,0,32,9V27L16,36Z'
        
        setOptions({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                'formatter': '{b0}: {c0}%'
            },
            grid: {
                containLabel: true,
                left: '0',
            },
            xAxis: {
                max: 100,
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
            yAxis: {
                show: false,
                type: 'category',
                inverse: false,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // margin: 10,
                    fontSize: 20*localStorage.remScale,
                    color: 'white'
                },
                axisPointer: {
                    label: {
                        show: false,
                        margin: 100
                    }
                }
            },
            series: [{
                type: 'pictorialBar',
                symbolRepeat: 'fixed',
                symbolMargin: '6!',
                label: {
                    show: false,
                    position: 'right',
                    offset: [0, 0],
                    formatter: (param) => {
                        return (param.value).toFixed(0) + '%'
                    },
                    fontSize: 12*localStorage.remScale,
                    color: '#fff'
                },
                symbolClip: true,
                symbolSize: [20*localStorage.remScale, 23*localStorage.remScale],
                symbolPosition: 'start',
                symbolBoundingData: 100,
                data: [{
                    value: props.data.value,
                    symbol: 'image://' + props.data.url,
                    // itemStyle: {
                    //     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    //         { offset: 0, color: props.data.color[0] },
                    //         { offset: 1, color: props.data.color[1] }
                    //     ])
                    // }
                }],
                z: 10
            },
            {
                type: 'pictorialBar',
                itemStyle: {
                    opacity: 0.2
                },
                animationDuration: 0,
                symbolRepeat: 'fixed',
                symbolMargin: '6!',
                symbolSize: [20*localStorage.remScale, 23*localStorage.remScale],
                symbolBoundingData: 100,
                symbolPosition: 'start',
                data: [{
                    value: 100,
                    symbol: icon,
                    itemStyle: {
                        color: '#1DDBF9'
                    }
                }],
                z: 10
            }
            ]
        });
    },
    { immediate: true, deep: true }
);
</script>
  