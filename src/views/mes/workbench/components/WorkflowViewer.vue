<template>
  <!--  <BasicModal @register="registerModal" @cancel="handleClose">-->
  <!--  <div ref="container" class="container" style="max-width: 100%"></div>  -->
  <!--  </BasicModal>-->
  <div style="height: 100%; position: relative">
    <VueFlow :nodes="nodes" :edges="edges" class="basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
      <Background pattern-color="#aaa" gap="8" />
      <Controls />
    </VueFlow>
    <div class="popover-box" v-if="visible && stationProgress.data != null">
      <div class="cont">
        <div class="product-box">
          <div class="product-title">
            <p class="title-name">{{ stationProgress.data.product.name }}</p>
            <p class="title-code">{{ stationProgress.data.product.code }} </p>
            <Icon class="closeBtn" icon="ant-design:close-outlined" size="20px" @click.stop="closeProgress" color="#7D8EA8" />
          </div>
          <div>
            <ul>
              <li class="order-title">工单: {{ stationProgress.data.mo.code }}</li>
              <li class="order-info">
                数量 <span>{{ stationProgress.data.mo.qty ? stationProgress.data.mo.qty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 投入<span>{{ stationProgress.data.mo.inputedQty ? stationProgress.data.mo.inputedQty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 产出<span>{{ stationProgress.data.mo.completedQty ? stationProgress.data.mo.completedQty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 报废<span>{{ stationProgress.data.mo.scrapedQty ? stationProgress.data.mo.scrapedQty : 0 }}</span>
              </li>
            </ul>
            <ul>
              <li class="order-title">生产任务: {{ stationProgress.data.moPlan.code }}</li>
              <li class="order-info">
                数量 <span>{{ stationProgress.data.moPlan.qty ? stationProgress.data.moPlan.qty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 投入<span>{{ stationProgress.data.moPlan.inputedQty ? stationProgress.data.moPlan.inputedQty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 产出<span>{{
                  stationProgress.data.moPlan.completedQty ? stationProgress.data.moPlan.completedQty : 0
                }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 报废<span>{{ stationProgress.data.moPlan.scrapedQty ? stationProgress.data.moPlan.scrapedQty : 0 }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="processes-box">
          <p class="order-title2">工序: {{ stationProgress.data.workflowStation.title }}</p>
          <div v-for="(item, index) in stationProgress.data.detailVoList" :key="index">
            <ul>
              <li class="order-title1">
                <p v-if="item.product.id != stationProgress.data.product.id">加工物料: {{ item.product.code }}</p>
                <p v-if="item.product.id != stationProgress.data.product.id">物料名称: {{ item.product.name }} </p>
              </li>
              <li class="order-info">
                投入 <span>{{ item.qty ? item.qty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 产出 <span>{{ item.okQty ? item.okQty : 0 }}</span
                >&nbsp;&nbsp;|&nbsp;&nbsp; 报废 <span>{{ item.scrapedQty ? item.scrapedQty : 0 }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="processes-box" v-if="stationProgress.data.sn != null">
          <ul>
            <li class="order-title">流转卡: {{ stationProgress.data.sn }} </li>
            <li class="order-info">
              数量<span>{{ stationProgress.data.qty ? stationProgress.data.qty : 0 }}</span
              >&nbsp;&nbsp;|&nbsp;&nbsp; 完工<span>{{ stationProgress.data.okQty ? stationProgress.data.okQty : 0 }}</span
              >&nbsp;&nbsp;|&nbsp;&nbsp; 报废<span>{{ stationProgress.data.scrapedQty ? stationProgress.data.scrapedQty : 0 }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, inject, watch, reactive, onMounted } from 'vue';

  // 导入LF核心模块和对应的样式文件
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  // import { DndPanel, SelectionSelect, Group, Control, MiniMap } from '@logicflow/extension';

  //注册节点
  import CustomStart from '../../../../components/logicflow/registerNode/CustomStart';
  import CustomStartCurr from '../../../../components/logicflow/registerNode/CustomStartCurr';
  import CustomRect from '../../../../components/logicflow/registerNode/CustomRect';
  import CustomRectCurr from '../../../../components/logicflow/registerNode/CustomRectCurr';
  import CustomGroup from '../../../../components/logicflow/registerNode/CustomGroup';
  import CustomEdge from '../../../../components/logicflow/registerNode/CustomEdge';
  import { getNewWorkflowPath, getMoPlanStationProgress, getWorkflowPath } from '/@/views/mes/workbench/Workbench.api';

  import { CloseCircleOutlined } from '@ant-design/icons-vue';

  // 声明容器的对应ref对象和LF对象
  const container = ref();
  const lf = ref<LogicFlow>();

  const moPlan = inject('moPlan') || ref<any>(null);
  const inputSnCard = inject('inputFlowCard') || ref('');
  const moPlans = ref({});
  const stationProgress = reactive({
    data: {
      product: {
        code: '',
        name: '',
      },
      mo: {
        code: '',
        qty: '',
        inputedQty: '',
        scrapedQty: '',
        completedQty: '',
      },
      moPlan: {
        code: '',
        qty: '',
        inputedQty: '',
        scrapedQty: '',
        completedQty: '',
      },
      detailVoList: [
        {
          qty: '',
          okQty: '',
          scrapedQty: '',
          product: {
            name: '',
            prodGrId: '',
            prodGrName: '',
          },
        },
      ],
      qty: '',
      okQty: '',
      scrapedQty: '',
      sn: '',
      workflowStation: {
        product: { title: '' },
      },
    },
  });
  const progressData = ref({});
  const visible = ref(false);

  // 新的工艺线路
  const nodes = ref<any>([]);
  const edges = ref<any>([]);
  watch(moPlan, async () => {
    moPlans.value = unref(moPlan);
    // lf.value?.renderRawData({
    //   nodes: [],
    //   edges: [],
    // });
    if (nodes.value.length != 0) {
      nodes.value = [];
    }
    if (edges.value.length != 0) {
      edges.value = [];
    }
    if (unref(moPlan)) {
      //lf.value?.graphModel.transformModel.zoom(-20);
      const moPlanId = moPlan.value.moPlanId;
      // 获取路径数据，并填充

      // getWorkflowPath({ moPlanId: moPlanId, sn: unref(inputSnCard) }).then((data) => {
      //   let json = JSON.parse(data);
      //   json.edges.forEach((item) => {
      //     item.type = 'CustomEdge';
      //   });
      //   lf.value?.renderRawData(json);
      //   const wfsId = moPlan.value.wfsId;
      //   let currentNode = lf.value?.getNodeDataById(wfsId);
      //   if (currentNode && currentNode.type != 'CustomGroup') {
      //     let nodeType = currentNode?.type;
      //     lf.value?.changeNodeType(wfsId, nodeType + 'Curr');
      //     const x = currentNode.x + 450;
      //     const y = currentNode.y;
      //     lf.value?.focusOn({ coordinate: { x: x, y: y } });
      //   }
      // });
      getNewWorkflowPath({ moPlanId: moPlanId, sn: unref(inputSnCard) }).then((data) => {
        let json = JSON.parse(data);
        json.nodes.map((item, idnex) => {
          if (item.id && item.position) {
            nodes.value.push({
              id: item.id,
              label: item.label,
              type: item.type,
              width: item.width,
              height: item.height,
              position: item.position,
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
              style: item.style,
            });
          }
        });
        json.edges.map((item, idnex) => {
          if (item.id) {
            edges.value.push({
              id: item.id,
              source: item.source,
              target: item.target,
              type: item.type,
              label: item.label,
              animated: item.animated,
            });
          }
        });
        setTimeout(() => {
          document.getElementsByClassName('vue-flow__controls-fitview')[0].click();
        }, 1000);
        return;
      });
    } else {
      inputSnCard.value = '';
    }
  });
  onMounted(() => {
    if (Object.keys(unref(moPlan)).length != 0) {
      moPlans.value = unref(moPlan);
      if (nodes.value.length != 0) {
        nodes.value = [];
      }
      if (edges.value.length != 0) {
        edges.value = [];
      }
      if (unref(moPlan)) {
        const moPlanId = moPlan.value.moPlanId;
        // 获取路径数据，并填充
        getNewWorkflowPath({ moPlanId: moPlanId, sn: unref(inputSnCard) }).then((data) => {
          let json = JSON.parse(data);
          json.nodes.map((item, idnex) => {
            if (item.id && item.position) {
              nodes.value.push({
                id: item.id,
                label: item.label,
                type: item.type,
                width: item.width,
                height: item.height,
                position: item.position,
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                style: item.style,
              });
            }
          });
          json.edges.map((item, idnex) => {
            if (item.id) {
              edges.value.push({
                id: item.id,
                source: item.source,
                target: item.target,
                type: item.type,
                label: item.label,
                animated: item.animated,
              });
            }
          });

          return;
        });
      } else {
        inputSnCard.value = '';
      }
    }
  });
  function initLgicflow() {
    if (!lf.value) {
      lf.value = new LogicFlow({
        // 通过选项指定了渲染的容器和需要显示网格
        container: container.value,
        grid: false,
        background: {
          backgroundColor: 'rgb(31, 41, 92)',
          backgroundOpacity: 0,
        },
        //nodeTextEdit: false, // 禁止编辑节点文本
        //edgeTextEdit: false, // 禁止编辑边文本
        //adjustNodePosition: false, // 禁止拖动节点
        //adjustEdge: false, // 禁止拖动线
        //hideAnchors: true, //隐藏节点锚点
        isSilentMode: true,
        plugins: [DndPanel, SelectionSelect, Group, Control, MiniMap],
      });

      lf.value.on('node:click', (args) => {
        progressData.value = args.data;
        moPlans.value.wfsId = args.data.id;
        visible.value = true;
        getMoPlanStation();
      });
    }

    lf.value?.zoom(0.75);
    lf.value?.setZoomMiniSize(0.4);
    lf.value?.setZoomMaxSize(1.0);

    // 注册节点
    lf.value.register(CustomStart);
    lf.value.register(CustomStartCurr);
    lf.value.register(CustomRect);
    lf.value.register(CustomRectCurr);
    lf.value.register(CustomEdge);
    lf.value.register(CustomGroup);

    lf.value?.clearData();
  }

  function initFlowVue() {
    onPaneReady(({ fitView }) => {
      fitView();
    });
  }

  defineExpose({
    // initLgicflow,
    initFlowVue,
  });

  function getMoPlanStation() {
    getMoPlanStationProgress({ moPlanId: moPlans.value.moPlanId, wfsId: moPlans.value.wfsId, sn: inputSnCard.value }).then((res) => {
      stationProgress.data = res;
    });
  }
  function closeProgress() {
    visible.value = false;
  }

  //样式引入
  import '@vue-flow/core/dist/style.css';
  import '@vue-flow/core/dist/theme-default.css';
  //根据使用情况，引入相关组件
  import { Background, Controls } from '@vue-flow/additional-components';
  import { Position, VueFlow, useVueFlow } from '@vue-flow/core';
  import './WorkflowViewer.css';

  const { onPaneReady, onNodeDragStop, onNodeClick, onConnect, addEdges, setTransform, toObject } = useVueFlow();

  // 节点点击事件
  onNodeClick((e) => {
    progressData.value = e.node;
    moPlans.value.wfsId = e.node.id;
    visible.value = true;
    getMoPlanStation();
  });
  function updatePos() {
    return initFlowVue();
  }
  setTimeout(() => {
    document.getElementsByClassName('vue-flow__controls-interactive')[0].click();
  }, 1000);
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }

  .container {
    width: 100%;
    height: 100%;
  }

  ul,
  li,
  p {
    margin: 0;
    padding: 0;
  }

  @keyframes lf_animate_dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  .basicflow {
    width: 100%;
    height: 100%;
  }

  .time-plus {
    stroke: 'red';
    stroke-dasharray: 10 10;
    stroke-dashoffset: 100%;
    animation-name: lf_animate_dash;
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-direction: normal;
  }

  .popover-box {
    width: 400px;
    position: absolute;
    right: 10%;
    top: 50%;
    margin-top: -115px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    padding: 10px 24px;
    box-sizing: border-box;
    height: 300px;
    overflow: auto;

    .closeBtn {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .cont {
      width: 100%;

      .product-box {
        // display: flex;
        .product-title {
          width: 100%;
          display: flex;
          margin-bottom: 10px;

          .title-name {
            font-size: 16px;
            font-weight: 700;
          }

          .title-code {
            font-size: 12px;
            height: 28px;
            line-height: 28px;
            color: #1890ff;
            padding: 0 10px;
            background-color: #e8f4ff;
            border-radius: 6px;
            margin-left: 10px;
            font-weight: 800;
          }
        }

        > div {
          // display: flex;
          width: 100%;

          ul {
            flex: 1;
            margin-bottom: 10px;

            .order-title {
              font-size: 14px;
              line-height: 20px;
              color: #333333;
              font-weight: 600;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 10px;
            }

            .order-info {
              width: 220px;
              font-size: 12px;
              line-height: 20px;
              background-color: #e8f4ff;
              line-height: 20px;
              border-radius: 6px;
              padding: 0 10px;

              span {
                color: #1890ff;
                font-weight: 800;
              }
            }
          }
        }
      }

      .processes-box {
        width: 100%;
        // height: 100px;
        margin-bottom: 10px;

        .order-title2 {
          font-size: 14px;
          line-height: 20px;
          color: #333333;
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 10px;
        }

        > div {
          width: 100%;

          ul {
            width: 100%;

            //margin-bottom: 5px;
            .order-title1 {
              font-size: 12px;
              line-height: 20px;
              // display: flex;
              margin-bottom: 10px;

              p {
                width: 100%;
              }
            }

            .order-title {
              font-size: 14px;
              line-height: 20px;
              color: #333333;
              font-weight: 600;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-bottom: 10px;
            }

            .order-info {
              width: 220px;
              border-radius: 6px;
              font-size: 12px;
              line-height: 20px;
              background-color: #e8f4ff;
              line-height: 20px;
              padding: 0 10px;

              span {
                color: #1890ff;
                font-weight: 800;
              }
            }
          }
        }
      }

      /*.sn-box {
        li {
          font-size: 12px;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }*/
    }
  }
</style>
