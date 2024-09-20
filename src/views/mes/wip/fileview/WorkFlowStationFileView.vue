<template>
  <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
    <a-tab-pane tab="工位文件查看" key="prodWkpViewList" :forceRender="true">
      <ProdWkpFileViewList :prodId="prodId" :wkpId="wkpId" ref="prodWkpFileViewList" @close="close" />
    </a-tab-pane>
    <!-- <a-tab-pane tab="工位文件查看" key="wkpList" :forceRender="true">
      <WkpFileViewList :wkpId="wkpId" ref="wkpFileViewList"></WkpFileViewList>
    </a-tab-pane> -->
    <a-tab-pane tab="产品文件查看" key="prodViewList" :forceRender="true">
      <ProdFileViewList :prodId="prodId" ref="prodFileViewList" @close="close" />
    </a-tab-pane>
    <a-tab-pane tab="工序SOP文件查看" key="wfsList" :forceRender="true">
      <SopFileViewList :wfsId="wfsId" ref="sopFileViewList" @close="close" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, watch, inject, nextTick } from 'vue';
  import { scan } from './WorkFlowStationFileView.api';
  import WkpFileViewList from './wkpfileview/WkpFileViewList.vue';
  import SopFileViewList from './sopfileview/SopFileViewList.vue';
  import ProdFileViewList from './prodfileview/ProdFileViewList.vue';
  import ProdWkpFileViewList from './prodwkpfileview/ProdWkpFileViewList.vue';
  import { useModal } from '/@/components/Modal';

  import { useMessage } from '/@/hooks/web/useMessage';
  //提示弹窗
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['setModalProps', 'close']);

  const wfsId = ref();
  const wkpId = ref();
  const prodId = ref();
  const wkpFileViewList = ref();
  const sopFileViewList = ref();
  const prodFileViewList = ref();
  const prodWkpFileViewList = ref();
  const workInfoData = inject('workInfoData');
  const inputFlowCard = inject('inputFlowCard');
  const activeKey = ref('prodWkpViewList');

  function handleChangeTabs(key) {
    if (key == 'prodWkpViewList') {
      if (!unref(wkpId)) {
        $message.createMessage.warning('未指定工位，无法查看工位文件');
        return;
      }
      prodWkpFileViewList.value.reload();
    } else if (key == 'wfsList') {
      if (!unref(wfsId)) {
        $message.createMessage.warning('未指定流转卡，无法查看工序文件');
        return;
      }
      sopFileViewList.value.reload();
    } else if (key == 'prodViewList') {
      if (!unref(prodId)) {
        $message.createMessage.warning('未指定流转卡，无法查看产品文件');
        return;
      }
      prodFileViewList.value.reload();
    }
  }

  function reset() {
    wkpId.value = '';
    wfsId.value = '';
    prodId.value = '';
    activeKey.value = 'prodWkpViewList';
  }
  //关闭弹窗
  function close() {
    emit('close');
  }
  onMounted(() => {
    reset();

    if (unref(workInfoData) && unref(workInfoData).wkpId) {
      wkpId.value = unref(workInfoData).wkpId;
      if (unref(inputFlowCard)) {
        scan({ sn: unref(inputFlowCard) }).then((res) => {
          if (res) {
            wfsId.value = res.basWorkflowStation.id;
            prodId.value = res.mesMo.prodId;
            prodWkpFileViewList.value.reload();
          }
        });
      } else {
        prodWkpFileViewList.value.reload();
      }
    } else {
      if (unref(inputFlowCard)) {
        scan({ sn: unref(inputFlowCard) }).then((res) => {
          if (res) {
            wfsId.value = res.basWorkflowStation.id;
            prodId.value = res.mesMo.prodId;
          }
        });
      }
      $message.createMessage.warning('未指定工位，无法查看工位文件');
    }
  });
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
