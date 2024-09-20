<template>
  <BasicModal @register="registerModal" destroyOnClose :title="title" @ok="handleSubmit" @cancel="handleClose">
    <div ref="container" class="container" style="max-width: 98%"></div>
  </BasicModal>
  <!--工序编辑抽屉-->
  <BasWorkflowStationDrawer @register="registerDrawer" @success="editNodeSuccess" :showFooter="!readonly" />
  <!--工序编辑抽屉-->
  <BasWorkflowPathSelectorDrawer @register="registerPathSelectDrawer" @success="editPathSuccess" :showFooter="!readonly" />
</template>

<script lang="ts" setup>
  import { computed, ref, unref, onMounted, nextTick, inject, watch, toRaw } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { buildUUID } from '/@/utils/uuid';
  import BasWorkflowStationDrawer from './BasWorkflowStationDrawer.vue';
  import BasWorkflowPathSelectorDrawer from './BasWorkflowPathSelectorDrawer.vue';
  const [registerDrawer, { openModal }] = useModal();
  const [registerPathSelectDrawer, { openDrawer: openPathSelectDrawer }] = useDrawer();

  import { getDesignerDataFileById, design } from '../BasWorkflow.api';
  import { basWorkflowChildStationList, basStationListByIds } from '../BasWorkflowStation.api';

  // 导入LF核心模块和对应的样式文件
  import LogicFlow from '@logicflow/core';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  import { DndPanel, SelectionSelect, Group, Control, Menu } from '@logicflow/extension';

  //注册节点
  import CustomStart from '/@/components/logicflow/registerNode/CustomStart';
  import CustomRect from '/@/components/logicflow/registerNode/CustomRect';
  import CustomGroup from '/@/components/logicflow/registerNode/CustomGroup';
  import CustomEdge from '/@/components/logicflow/registerNode/CustomEdge';
  import { patternItems } from '/@/components/logicflow/Logicflow.data';

  // 界面容器
  const container = ref();
  // LogincFlow对象
  const lf = ref<LogicFlow>();

  const editStationNote = ref();
  const editStationEdge = ref();

  const readonly = ref(true);

  const workflowId = ref();
  const prodId = ref();
  const workflowStations: any[] = [];

  //设置标题
  const title = computed(() => '设计器');
  // Emits声明
  const emit = defineEmits(['register', 'success', 'designerClose']);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    // await resetFields();

    workflowId.value = data.workflowId;
    prodId.value = data.prodId;

    readonly.value = !data.showFooter;

    setModalProps({
      confirmLoading: false,
      showCancelBtn: !readonly.value,
      showOkBtn: !readonly.value,
      canFullscreen: true,
      defaultFullscreen: true,
    });

    lf.value = new LogicFlow({
      // 通过选项指定了渲染的容器和需要显示网格
      container: container.value,
      grid: {
        size: 30,
        visible: true,
        type: 'dot',
        config: {
          color: '#f1f0f0',
          thickness: 1,
        },
      },
      background: { backgroundColor: '#9dcbf1' },
      stopScrollGraph: true, //禁止鼠标滚轮滚动画布
      nodeTextEdit: false, // 禁止编辑节点文本
      edgeTextEdit: false, //禁止编辑线文本
      //isSilentMode: readonly.value, //浏览（不可编辑）模式
      plugins: [DndPanel, SelectionSelect, Group, Control, Menu], //界面插件
    });
    // 注册拖拽节点
    lf.value.register(CustomStart);
    lf.value.register(CustomRect);
    lf.value.register(CustomGroup);
    lf.value.register(CustomEdge);
    if (!readonly.value) {
      lf.value.extension.dndPanel.setPatternItems(patternItems); // 开启拖拽区
    }

    // 编辑节点
    async function editNode(nodeData) {
      editStationNote.value = nodeData;

      let record = workflowStations.find((p) => p.id == nodeData.id);
      if (!record) {
        record = { id: nodeData.id, stationId: nodeData.properties.stationId ?? '' };
      }

      record.isStart = nodeData.type == 'CustomStart' ? 'Y' : 'N';

      let data = {
        workflowId: workflowId.value,
        prodId: prodId.value,
        isGroup: nodeData.type == 'CustomGroup',
        record: record,
      };
      openModal(true, data);
    }

    // 编辑线
    async function editEdge(edgeData) {
      editStationEdge.value = edgeData;

      let record = {
        id: edgeData.id,
        isDefault: edgeData.properties.isDefault ?? 'N',
        pathSelectorId: edgeData.properties.pathSelectorId ?? '',
      };

      let data = {
        workflowId: workflowId.value,
        record: record,
      };
      openPathSelectDrawer(true, data);
    }

    // 删除工序组节点
    async function deleteGroupNode(node) {
      //先清除原先子工序节点
      let childIds: string[] = [];
      await node.children.forEach((element) => {
        childIds.push(element);
      });

      if (childIds.length > 0) {
        node.children.splice(0);
        for (let i = 0; i < childIds.length; i++) {
          lf.value?.deleteNode(childIds[i]);
        }
      }

      lf.value?.deleteNode(node.id);
    }

    // 设置菜单
    lf.value.setMenuConfig({
      nodeMenu: [
        {
          text: '删除',
          callback(node) {
            if (node.type == 'CustomGroup') {
              deleteGroupNode(node);
            } else {
              lf.value?.deleteNode(node.id);
            }
          },
        },
        {
          text: '编辑',
          callback(node) {
            editNode(node);
          },
        },
      ], // 覆盖默认的节点右键菜单
      edgeMenu: [
        {
          text: '删除',
          callback(edge) {
            lf.value?.deleteEdge(edge.id);
          },
        },
        {
          text: '编辑',
          callback(edge) {
            editEdge(edge);
          },
        },
      ], // 删除默认的边右键菜单
      graphMenu: [], // 覆盖默认的边右键菜单，与false表现一样
    });

    // 设置主题
    lf.value.setTheme({
      // circle: {
      //   fill: "#f3346d",
      //   stroke: "#a80303",
      //   strokeWidth: 2,
      // },
    });

    // 加载数据
    if (data.record) {
      getDesignerDataFileById({ id: data.workflowId }).then((res) => {
        setTimeout(function () {
          let json = JSON.parse(res);
          json.edges.forEach((item) => {
            item.type = 'CustomEdge';
          });
          lf.value?.render(json);
          // lf.value?.render(toRaw(data.record));
        }, 200);
      });
    } else {
      setTimeout(function () {
        lf.value?.render(
          toRaw({
            nodes: [],
            edges: [],
          })
        );
      }, 200);
    }

    lf.value.zoom(0.8);
    lf.value.setZoomMiniSize(0.4);
    lf.value.setZoomMaxSize(1.0);

    // 节点双击绑定事件
    lf.value.on('node:dbclick', (args) => {
      editNode(args.data);
    });
    // 线双击绑定事件
    lf.value.on('edge:dbclick', (args) => {
      editEdge(args.data);
    });
  });

  // 节点修改成功回调
  async function editNodeSuccess(record) {
    if (!lf.value) return;
    let currentNodeModel = lf.value.getNodeModelById(record.id);
    currentNodeModel.updateText(record.title);
    currentNodeModel.setProperties({ stationId: record.stationId });
    let idx = workflowStations.findIndex((p) => p.id == record.id);
    if (idx > -1) {
      workflowStations.splice(idx, 1);
    }

    workflowStations.push(record);

    let childIds = record.childStationIds;
    if (record.stationType == 'station_group' && childIds.length > 0) {
      if (workflowStations.findIndex((p) => p.pid == record.id) < 0) {
        await basWorkflowChildStationList({ pid: record.id }).then((result) => {
          if (result && result.length > 0) {
            workflowStations.push[result];
          }
        });
      }

      // 删除不存在的子工序
      let deletedChildStationList = workflowStations.filter((p) => p.pid == record.id && childIds.indexOf(p.stationId) < 0);
      await deletedChildStationList.forEach((p) => {
        let i = workflowStations.indexOf(p);
        workflowStations.splice(i, 1);
      });

      // 查询子工序列表
      let newChildStationList: any[] = [];
      let newChildIds = childIds.filter((p) => workflowStations.findIndex((q) => q.pid == record.id && q.stationId == p) < 0);
      if (newChildIds.length > 0) {
        await basStationListByIds({ ids: newChildIds.join() }).then((result) => {
          newChildStationList = result;
        });
      }

      // 添加新增的工序
      await newChildStationList.forEach((p) => {
        workflowStations.push({
          id: buildUUID(),
          stationId: p.id,
          stationType: p.type,
          title: p.name,
          isStart: 'N',
          isChild: 'Y',
          pid: record.id,
          sequence: record.sequence,
          editflag: true,
        });
      });

      let xD = currentNodeModel.x;
      let yD = currentNodeModel.y;
      xD = xD - parseInt(parseInt(currentNodeModel.width) / 3) + 20;

      //先清除原先子工序节点
      await currentNodeModel.children.forEach((element) => {
        lf.value?.deleteNode(element);
      });

      currentNodeModel.children.clear();

      // 构建节点
      let childStationList = workflowStations.filter((p) => p.pid == record.id);
      childStationList.forEach((p) => {
        lf.value?.addNode({
          id: p.id,
          text: p.title,
          type: 'CustomRect',
          x: xD,
          y: yD,
          properties: {
            stationId: p.stationId,
          },
        });

        xD += 150;
        currentNodeModel.addChild(p.id);
      });
    }
  }

  // 线修改成功回调
  async function editPathSuccess(record) {
    if (!lf.value) return;

    let text = record.isDefault == 'Y' ? '默认' : '';

    let edgeId = editStationEdge.value.id;
    lf.value?.getEdgeModelById(edgeId).updateText(text);
    lf.value?.getEdgeModelById(edgeId).setProperties({
      isDefault: record.isDefault,
      pathSelectorId: record.pathSelectorId,
    });
  }

  // 表单提交事件
  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });

      let params = { id: unref(workflowId), basWorkflowStations: workflowStations };

      let nodes: object[] = [];
      let noteMap = toRaw(toRaw(lf.value?.graphModel.nodesMap));
      for (let i in noteMap) {
        let properties = {};
        let propertiesTemp = toRaw(toRaw(noteMap[i].model.properties));
        if (propertiesTemp.stationId) {
          properties = { stationId: propertiesTemp.stationId };
        }

        let children = [];
        if (noteMap[i].model.children) {
          children = Array.from(noteMap[i].model.children);
        }

        nodes.push({
          id: noteMap[i].model.id,
          x: noteMap[i].model.x,
          y: noteMap[i].model.y,
          width: noteMap[i].model.width,
          height: noteMap[i].model.height,
          text: noteMap[i].model.text.value,
          type: noteMap[i].model.type,
          properties: properties,
          children: children,
        });
      }
      params['nodes'] = nodes;

      let edges: object[] = [];
      let edgeMap = toRaw(toRaw(lf.value?.graphModel.edgesMap));
      for (let i in edgeMap) {
        edges.push({
          id: edgeMap[i].model.id,
          sourceNodeId: edgeMap[i].model.sourceNodeId,
          targetNodeId: edgeMap[i].model.targetNodeId,
          type: edgeMap[i].model.type,
          text: edgeMap[i].model.text.value,
          properties: edgeMap[i].model.properties,
        });
      }
      params['edges'] = edges;

      // //提交表单
      await design(params);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  function handleClose() {
    emit('designerClose');
    return true;
  }
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
    margin-left: 20px;
  }
</style>
