<template>
  <div ref="chartRef" :style="{ width, height }" id="manyLineCharts"></div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch,unref,onMounted,nextTick } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
import { Options } from '@zxcvbn-ts/core/dist/Options';
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
const { setOptions, echarts,getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);
let options = {}
  let timers = ref(null)
const pos = ref(0)
const categoryLength = ref()
var bool = true
    var index = 0
function handleAutoLoop() {
  nextTick(() => {
    // 图表的初始化
    const myChart = echarts.init(document.getElementById('manyLineCharts'))
    
    myChart.on('mouseover', (param) => {
        bool = false
        clearInterval((window as any).startCharts)
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index
        })
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: param.dataIndex
        })
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: param.dataIndex
        })
    })
    function chartHover() {
        var dataLen = options.series[0].data.length
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index
        })
        index = (index + 1) % dataLen
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
        })
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index
        })
    }
    chartHover();
    (window as any).startCharts = setInterval(chartHover, 2000)
    myChart.on('mouseout', function () {
        if (!bool) {
            (window as any).startCharts = setInterval(chartHover, 2000)
            bool = true
        }
    })
  })
}
 
onMounted(() => {
  handleAutoLoop()
})
watch(
  () => props.data,
  () => {
    const colors = ['#33FFFF', '#57FF84', '#FAE087', '#FF8F57', '#FF7088', '#C670FF', '#579AFF', '#c9ac29', '#2a67d2', '#99994d', '#00cc00'];
    var datas = [];
    function generateData(totalNum, bigvalue, smallvalue) {
      let dataArr = ref<any>([]);
      for (var i = 0; i < totalNum; i++) {
        if (i % 2 === 0) {
          dataArr.value.push({
            name: (i + 1).toString(),
            value: bigvalue,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: "rgba(58, 87, 105, 1)" },
                { offset: 1, color: "rgba(151, 151, 151, 0)" }
              ]),
              borderWidth: 0,
            }
          });
        } else {
          dataArr.value.push({
            name: (i + 1).toString(),
            value: smallvalue,
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0,
            }
          });
        }

      }
      return dataArr.value;
    }

    const dolitData = generateData(10, 30, 10);
    const dolitData2 = generateData(10, 20, 10);

    for (var index = 0; index < props.data.yData.length; index++) {
      let dataItem = props.data.yData[index];
      let name = dataItem["name"];
      let cnt = +dataItem["value"];
      if (cnt == undefined || cnt == null || cnt <= 0) {
        continue;
      }
      dataItem = {
        "value": cnt,
        "name": name,
        "itemStyle": {
          "borderWidth": 1,
          "borderColor": "transparent",
          "color": new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: colors[index] },
            { offset: 0.3, color: colors[index] },
            { offset: 1, color: 'transparent' }
          ]),
        }
      };
      datas.push(dataItem);
    }
    options = {
      legend: {
        orient: "center",
        right: "right",
        data: props.data.xData,
        x: 'right',
        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
        y: 'center',
        itemGap: 10*localStorage.remScale,
        itemHeight: 10*localStorage.remScale,
        itemWidth: 15*localStorage.remScale,
        textStyle: {
          color: '#fff',  // 图例文字颜色
          fontSize: 14*localStorage.remScale
        },
      },
      tooltip: {
        show: false,
        position: function (point, params, dom, rect, size) {
          //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
          var x = point[0]; //
          var y = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          var posX = 0; //x坐标位置
          var posY = 0; //y坐标位置

          if (x < boxWidth) { //左边放不开
            posX = 5;
          } else { //左边放的下
            posX = x - boxWidth;
          }

          if (y < boxHeight) { //上边放不开
            posY = 5;
          } else { //上边放得下
            posY = y - boxHeight;
          }

          return [posX, posY];

        }
      },
      series: [
      {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['34%', '50%'],
          avoidLabelOverlap: true,
          minAngle: 5,
          zlevel: 4,
          label: {
              show: false,
              position: 'center',
              formatter: (item) => {
                return `{percent|${item.value}次}\n{sexName|${item.name}}`
              },
              align: 'center',
              color: '#ffffff',
              verticalAlign: 'middle',
              // 此处重点，字体大小设置为0
              fontSize: '0',
            },
            emphasis: {
              label: {
                show: true,
                rich: {
                  percent: {
                    fontSize: 32*localStorage.remScale,
                    color: '#fff',
                  },
                  sexName: {
                    fontSize: 16*localStorage.remScale,
                    color: '#ccc',
                  },
                },
              },
            },
          data: datas
        },
        {
          name: '不动外圆',
          type: 'pie',
          silent: true,
          radius: ['73%', '75%'],
          center: ['34%', '50%'],
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          data: dolitData
        },
        {
          name: '不动内环',
          type: 'pie',
          silent: true,
          radius: ['45%', '47%'],
          center: ['34%', '50%'],
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          data: dolitData2
        },
      ]
    }
    
    setOptions(options);
  },
  { immediate: true, deep: true }
);
</script>
