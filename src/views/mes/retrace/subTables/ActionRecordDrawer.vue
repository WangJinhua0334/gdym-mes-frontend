<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="'动作记录详情'" destroyOnClose :width="500">
    <a-steps progress-dot :current="nodeIndex" direction="vertical">
      <a-step :title="item.eventCode_dictText" :key="item.id" v-for="item in record">
        <template #description>
          <span>动作：{{ item.actionId_dictText }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
          <span>状态：{{ item.status_dictText }}</span>
          <br />
          <span>工作中心：{{ item.wkcId_dictText }}</span>
          <br />
          <span>工位：{{ item.wkpId_dictText }}</span>
          <br />
          <span>操作人：{{ item.operateBy_dictText }}</span>
          <br />
          <span>操作时间：{{ item.operateTime }}</span>
          <br />
          <span>设备：{{ item.equipId_dictText }}</span>
          <br />
          <span>备注：{{ item.remark }}</span>
          <br />
          <span>数量：{{ item.qty }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
          <span>不良：{{ item.ngQty == null ? 0 : item.ngQty }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
          <span>报废：{{ item.scrapedQty }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
          <br />
        </template>
      </a-step>
    </a-steps>
    <slot>
      <div class="footer">
        <a-button @click="closeDrawer">返回</a-button>
      </div>
    </slot>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { lotTrackListByLotId } from '../RetraceReport.api';
  // 动作记录
  const record = ref<any>([]);
  // 当前节点序号
  const nodeIndex = ref(0);
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await lotTrackListByLotId({ lotId: data.record.lotId, wfsId: data.record.wfsId }).then((res) => {
      record.value = unref(res);
      nodeIndex.value = unref(res).length - 1;
    });
    setDrawerProps({ loading: false });
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

  .footer {
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 5px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    /* background: #f5f5f5; */
    border-top: 1px solid #f0f0f0;
  }
  .footer button {
    margin: 0px 10px;
  }
</style>
