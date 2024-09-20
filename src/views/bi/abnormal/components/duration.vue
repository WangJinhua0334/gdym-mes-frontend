<template>
   <div ref="chartRef" :style="{ width, height }" id="container"></div>
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
      let data = [
         { name: '质量异常', value: 9 },
         { name: '人员问题', value: 17 },
         { name: '缺少物料', value: 31 },
         { name: '设备异常', value: 25 },
         { name: '工艺问题', value: 12 },
         { name: '其他', value: 6 }
      ]
      // 将数据根据从小到大排序
      let newdata = sortObject(data);
      // 图例数据
      let lengthData = [];
      // 返回数据
      let resultData = data.map((item, index) => {
         let graw = item.value > 9 ? 78 : 83;
         if (index === 0) {
            return {
               style: {
                  fill: '#33FFFF'
               },
               ...item
            };
         } else if (index === 1) {
            return {
               style: {
                  fill: '#1BBFE0'
               },
               ...item
            };
         } else if (index === 2) {
            return {
               style: {
                  fill: '#0099E6'
               },
               ...item
            };
         } else if (index === 3) {
            return {
               style: {
                  fill: '#1F78FF'
               },
               ...item
            };
         } else if (index === 4) {
            return {
               style: {
                  fill: '#0037EB'
               },
               ...item
            };
         } else if (index === 5) {
            return {
               style: {
                  fill: '#000DC2'
               },
               ...item
            };
         }
      });
      // 获取计算的数据
      let getData = pyramidChart(
         resultData,
         document.getElementById('container')
      );
      setOptions({
         graphic: [
            {
               type: 'group',
               left: '10%',
               top: 'center',
               scale: [1, 1],
               onclick: function (params) {

               },
               children: getData
            },
         ],
         series: []
      });
      // 排序
      function sortObject(arr) {
         return arr.sort(function (a, b) {
            return a['value'] - b['value'];
         });
      }
      // 数据处理
      function pyramidChart(data = [], dom, option = {}) {
         let domHeight = dom ? dom.clientHeight : 0;
         let domWidth = dom ? dom.clientWidth : 0;
         // 默认获取一个正方形空间
         let maxDistance = domHeight > domWidth / 2 ? domWidth / 2 : domHeight;
         // 合并设置
         let resultOption = Object.assign(
            {
               slanted: 6, // 每层底部的倾斜度
               maxWidth: domWidth, // 金字塔最大宽度
               maxHeight: domHeight, // 金字塔最大高度
               offset: 35 //偏差
            },
            option
         );
         if (data.length === 1) {
            resultOption.slanted = 50;
         }
         if (data.length === 2) {
            resultOption.slanted = 25;
         }
         if (data.length === 3) {
            resultOption.slanted = 10;
         }
         // 减去多余的误差边距
         resultOption.maxHeight = resultOption.maxHeight - resultOption.offset;
         // 一半最大宽度,用于计算左右边距
         let halfMaxWidth = resultOption.maxWidth / 2.5;
         // 数据最终
         let resultData = [];
         // 数据值 数组
         let dataNums = data.map(item => item.value || 0);
         // 计算数据总和
         let dataNumSum =
            dataNums.length > 0 &&
            dataNums.reduce(function (prev, curr) {
               return Number(prev || 0) + Number(curr || 0);
            });
         // 中间数据点坐标数组 根据长度比值算出
         let midlinePoint = [];
         let multipleLayer = [0.6];
         // 计算倍数等基础数据
         dataNums.forEach((item, index, arr) => {
            let itemNext = arr[index + 1];
            if (itemNext) {
               multipleLayer.push(itemNext / dataNums[0]); // 计算倍数
            }
            // 计算点坐标 长度
            let point =
               Math.round((item / dataNumSum) * resultOption.maxHeight * 100) / 100;
            midlinePoint.push(point);
         });
         // 三角形的高度
         let triangleHeight = 6;
         let triangleHeightLayer = [];
         // 三角形tan角度
         let triangleRatio = halfMaxWidth / resultOption.maxHeight;
         midlinePoint.forEach(item => {
            triangleHeight = triangleHeight + item;
            triangleHeightLayer.push(triangleHeight);
         });
         // 中间数据点 最后的数据长度
         let midlinePointFinally =
            triangleHeightLayer[triangleHeightLayer.length - 1] || 0;
         // 开始拼接数据
         data.forEach((item, index) => {
            let arrObj = [];
            let triangleHeightLayerOne = triangleHeightLayer[index];
            let triangleHeightLayerOneLast = triangleHeightLayer[index - 1] || 0;
            let multipleLayerOne = multipleLayer[index];
            let multipleLayerOneLast = multipleLayer[index - 1] || 0;
            // 第一层数据单独处理
            if (index === 0) {
               arrObj.push(
                  [0, 0],
                  [
                     -triangleRatio *
                     (triangleHeightLayerOne - resultOption.slanted * multipleLayerOne),
                     triangleHeightLayerOne - resultOption.slanted * multipleLayerOne 
                  ],
                  [0, triangleHeightLayerOne],
                  [
                     triangleRatio *
                     (triangleHeightLayerOne - resultOption.slanted * multipleLayerOne),
                     triangleHeightLayerOne - resultOption.slanted * multipleLayerOne
                  ]
               );
            } else {
               arrObj.push(
                  [0, triangleHeightLayerOneLast],
                  [
                     -triangleRatio *
                     (triangleHeightLayerOneLast -
                        resultOption.slanted * multipleLayerOneLast),
                     triangleHeightLayerOneLast -
                     resultOption.slanted * multipleLayerOneLast
                  ],
                  [
                     -triangleRatio *
                     (triangleHeightLayerOne - resultOption.slanted * multipleLayerOne),
                     triangleHeightLayerOne - resultOption.slanted * multipleLayerOne
                  ],
                  [0, triangleHeightLayerOne],
                  [
                     triangleRatio *
                     (triangleHeightLayerOne - resultOption.slanted * multipleLayerOne),
                     triangleHeightLayerOne - resultOption.slanted * multipleLayerOne
                  ],
                  [
                     triangleRatio *
                     (triangleHeightLayerOneLast -
                        resultOption.slanted * multipleLayerOneLast),
                     triangleHeightLayerOneLast -
                     resultOption.slanted * multipleLayerOneLast
                  ]
               );
            }
            let labelPositionY = (triangleHeightLayer[index] + (triangleHeightLayer[index - 1] || 0)) / 2;
            let positionY = (triangleHeightLayer[index] + (triangleHeightLayer[index - 1] || 0)) / 2;
            // 创建标签文本图形对象 创建折线图形对象 创建圆形图形对象
            let labelGraphic = {
               type: 'text',
                  z: 100,
                  style: {
                     text: item.name + '\r\n\r\n' + item.value, // 标签显示的文本
                     x: 90,
                     y: 0,
                     fill: '#FEFEFE', // 文本颜色
                     textAlign: 'center', // 文本水平对齐方式
                     textVerticalAlign: 'middle', // 文本垂直对齐方式
                     fontSize: 16 * localStorage.remScale // 文本字体大小
                  }
            };
            let polylineGraphic = {
               type: 'polyline',
                  z: 100,
                  shape: {
                     points: [],
                     smooth: 0 // 折线平滑度
                  },
                  style: {
                     stroke: '#fff', // 折线颜色
                     lineWidth: 1 // 折线宽度
                  }
            };
            let circleGraphic = {
               type: 'circle',
                  z: 100,
                  shape: {
                     cx: 0, // 圆心X坐标
                     cy: 0, // 圆心Y坐标
                     r: 2 // 圆的半径
                  },
                  style: {
                     fill: '#FEFEFE', // 圆的填充色
                     stroke: '#FEFEFE', // 圆的边框色
                     lineWidth: 1 // 边框线宽
                  }
            };
            if(index == 0){
               labelGraphic.style.y = labelPositionY - 15
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [5, positionY],// 起点（与圆心相同）
                        [25, positionY - 15],
                        [100, positionY - 15], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = 5;
               circleGraphic.shape.cy = positionY;
            }else if(index == 1){
               labelGraphic.style.x = -90
               labelGraphic.style.y = labelPositionY - 15
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [-5, positionY - 5],// 起点（与圆心相同）
                        [-30, positionY - 15],
                        [-100, positionY - 15], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = -5;
               circleGraphic.shape.cy = positionY - 5;
            }else if(index == 2){
               labelGraphic.style.y = labelPositionY - 15
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [10, positionY - 5],// 起点（与圆心相同）
                        [30, positionY - 15],
                        [100, positionY - 15], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = 10;
               circleGraphic.shape.cy = positionY - 5;
            }else if(index == 3){
               labelGraphic.style.x = -90
               labelGraphic.style.y = labelPositionY - 15
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [-15, positionY - 5],// 起点（与圆心相同）
                        [-45, positionY - 15],
                        [-100, positionY - 15], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = -15;
               circleGraphic.shape.cy = positionY - 5;
            }else if(index == 4) {
               labelGraphic.style.y = labelPositionY - 25
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [30, positionY - 15],// 起点（与圆心相同）
                        [65, positionY - 25],
                        [100, positionY - 25], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = 30;
               circleGraphic.shape.cy = positionY - 15;
            }else if(index == 5) {
               labelGraphic.style.x = -90
               labelGraphic.style.y = labelPositionY - 25
               polylineGraphic.shape.points = [
                        // 定义折线的路径点, 例如:
                        [-30, positionY - 15],// 起点（与圆心相同）
                        [-85, positionY - 25],
                        [-100, positionY - 25], // 终点（向左20个单位）
                        // 可以继续添加点来定义更复杂的折线路径
                     ],
               circleGraphic.shape.cx = -30;
               circleGraphic.shape.cy = positionY - 15;
            }
            resultData.push({
               type: 'polygon',
               z: 1,
               shape: {
                  points: arrObj,
               },

               name: item.name,
               style: item.style
            }, labelGraphic, circleGraphic, polylineGraphic);  //
         });
         // 添加线
         resultData.push({
            type: 'polyline',
            shape: {
               points: [
                  [0, 0],
                  [0, midlinePointFinally]
               ]
            },
            style: {
               stroke: '#f2f2f2',
               opacity: 0.2,
               lineWidth: 1
            },
            z: 2
         });
         // 返回
         return resultData;
      };
   },
   { immediate: true, deep: true }
);
</script>
