<template>
  <BasicModal @register="registerDrawer" :title="'预览'" :showOkBtn="false" :showCancelBtn="false" :footer="null" destroyOnClose>
    <div ref="container" class="container"></div>
    <!--右下角按钮-->
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getViewerDataFileById } from '../BasWorkflow.api';

  // 导入LF核心模块
  import LogicFlow from '@logicflow/core';
  // 导入样式文件
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';
  // 导入扩展插件
  import { DndPanel, SelectionSelect, Group, Control, MiniMap } from '@logicflow/extension';
  //导入注册节点
  import CustomStart from '../../../../components/logicflow/registerNode/CustomStart';
  import CustomRect from '../../../../components/logicflow/registerNode/CustomRect';
  import CustomGroup from '../../../../components/logicflow/registerNode/CustomGroup';
  import CustomEdge from '../../../../components/logicflow/registerNode/CustomEdge';

  // 属性
  /*const props = defineProps({
    workflowId: {
      type: String,
      default: '',
    },
  });*/

  // 声明容器的对应ref对象
  const container = ref();
  // 声明LF对象
  const lf = ref<LogicFlow>();

  /*watch(
    () => props.workflowId,
    (newVal) => {
      setTimeout(() => {
        initLogicFlow();

        if (newVal) {
          getViewerDataFileById({ id: newVal }).then((res) => {
            lf.value?.renderRawData(JSON.parse(res));
          });
        }
      }, 1000);
    },
    {
      immediate: true,
    }
  );*/

  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ loading: true, defaultFullscreen: true });

    initLogicFlow();

    if (data.workflowId) {
      // 查询工序数据
      await getViewerDataFileById({ id: data.record.id })
        .then((res) => {
          setTimeout(() => {
            let json = JSON.parse(res);
            json.edges.forEach((item) => {
              item.type = 'CustomEdge';
            });
            lf.value?.renderRawData(json);
            // lf.value?.renderRawData(JSON.parse(res));

            setModalProps({ loading: false });
          }, 200);
        })
        .catch(() => {
          closeModal();
        });
    }
  });

  // 初始化LF对象
  function initLogicFlow() {
    lf.value = new LogicFlow({
      // 通过选项指定了渲染的容器和需要显示网格
      container: container.value,
      grid: {
        size: 10,
        visible: true,
        type: 'dot',
        config: {
          color: '#ffffff',
          thickness: 1,
        },
      },
      isSilentMode: true,
      plugins: [DndPanel, SelectionSelect, Group, Control, MiniMap],
    });

    lf.value.setZoomMiniSize(0.4);
    lf.value.setZoomMaxSize(1.0);
    lf.value.zoom(0.6);

    // 注册节点
    lf.value.register(CustomStart);
    lf.value.register(CustomRect);
    lf.value.register(CustomGroup);
    lf.value.register(CustomEdge);
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
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }
</style>
