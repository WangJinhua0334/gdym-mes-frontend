<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="'呼叫进度详情'" destroyOnClose :width="500">
    <a-steps progress-dot :current="nodeIndex" direction="vertical">
      <a-step title="异常呼叫">
        <template #description>
          <span>呼叫项目：{{ record.typeId_dictText }}</span>
          &nbsp;&nbsp;
          <span>{{ record.typeDesc_dictText }}</span>
          <br />
          <span>发起时间：{{ record.createTime }}</span>
          &nbsp;&nbsp;
          <span>发起人：{{ record.createBy_dictText }}</span>
          <br />
          <span>问题设备：{{ record.equipmentId_dictText }}</span>
          &nbsp;&nbsp;
          <span>问题描述：{{ record.content }}</span>
          <br />
          <span>责任部门：{{ record.responsibleDeptId_dictText }}</span>
          &nbsp;&nbsp;
          <span>责任人：{{ record.responsibleBy_dictText }}</span>
          <br />
          <span>工位：{{ record.wkpId_dictText }}</span>
          &nbsp;&nbsp;
          <span>工作中心：{{ record.wkcId_dictText }}</span>
          &nbsp;&nbsp;
          <span>车间：{{ record.wksId_dictText }}</span>
          <br />
        </template>
      </a-step>
      <a-step title="撤销呼叫" v-if="record.status == 'canceled' && !record.responseBy" status="error">
        <template #description>
          <span>撤销人：{{ record.revokeBy_dictText }}</span>
          <br />
          <span>撤销时间：{{ record.revokeTime }}</span>
          <br />
        </template>
      </a-step>
      <a-step title="异常响应">
        <template #description>
          <div
            v-if="
              record.status === 'processing' ||
              record.status === 'processed' ||
              record.status === 'completed' ||
              record.status === 'rejected' ||
              (record.status == 'canceled' && record.responseBy)
            "
          >
            <span>响应人：{{ record.responseBy_dictText }}</span>
            <br />
            <span>响应时间：{{ record.responseTime }}</span>
            <br />
            <span>响应时长：{{ record.responseHours }}(小时)</span>
            <br />
          </div>
        </template>
      </a-step>
      <a-step title="撤销呼叫" v-if="record.status == 'canceled' && record.responseBy" status="error">
        <template #description>
          <span>撤销人：{{ record.revokeBy_dictText }}</span>
          <br />
          <span>撤销时间：{{ record.revokeTime }}</span>
          <br />
        </template>
      </a-step>
      <a-step title="异常处置">
        <template #description>
          <div v-if="record.status === 'processed' || record.status === 'completed' || record.status === 'rejected'">
            <span>处理人：{{ record.processBy_dictText }}</span>
            <br />
            <span>处理时间：{{ record.processTime }}</span>
            <br />
            <span>处理时长：{{ record.processHours }}(小时)</span>
            <br />
            <span>原因分析：{{ record.reason }}</span>
            <br />
            <span>处理措施：{{ record.measure }}</span>
            <br />
          </div>
        </template>
      </a-step>
      <a-step title="异常确认" v-if="record.status != 'rejected'">
        <template #description>
          <div v-if="record.status == 'completed'">
            <span>确认人：{{ record.completeBy_dictText }}</span>
            <br />
            <span>确认时间：{{ record.completeTime }}</span>
            <br />
          </div>
        </template>
      </a-step>
      <a-step title="未处理成功" status="error" v-if="record.status == 'rejected'">
        <template #description>
          <div>
            <span>驳回人：{{ record.completeBy_dictText }}</span>
            <br />
            <span>驳回时间：{{ record.completeTime }}</span>
            <br />
            <span>驳回原因：{{ record.remark }}</span>
            <br />
          </div>
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
  import { queryById } from '../MesAbnormal.api';
  import { outline } from '@ant-design/icons-vue';

  // 异常记录
  const record = ref<any>({});
  // 当前节点序号
  const nodeIndex = ref(0);

  watch(
    () => unref(record),
    () => {
      if (unref(record)) {
        if (unref(record).status == 'canceled' && !unref(record).respondBy) {
          nodeIndex.value = 1;
        } else if (unref(record).status == 'processing') {
          nodeIndex.value = 1;
        } else if (unref(record).status == 'canceled' && unref(record).respondBy) {
          nodeIndex.value = 2;
        } else if (unref(record).status == 'processed') {
          nodeIndex.value = 2;
        } else if (unref(record).status == 'completed') {
          nodeIndex.value = 3;
        } else if (unref(record).status == 'rejected') {
          nodeIndex.value = 3;
        }
      }
    },
    { immediate: false, deep: true }
  );

  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    nodeIndex.value = 0;

    await queryById({ id: data.record.id }).then((res) => {
      record.value = res;
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
    padding: 10px 5px;
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
