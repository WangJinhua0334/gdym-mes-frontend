<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
  </div>
  <!--页脚-->
  <slot>
    <div class="footer">
      <a-button @click="close">关闭</a-button>
      <a-button type="primary" @click="submit">提交</a-button>
    </div>
  </slot>
</template>

<script lang="ts" name="MesWkpStockList" setup>
  import { unref, onMounted, ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { deductColumns, deductSearchFormSchema } from './WkpStock.data';
  import { deductList, deduct } from './WkpStock.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const $message = useMessage();
  const userStore = useUserStore();
  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  const workBenchData = ref<any>();
  const operateBy = ref<string>('');

  const sn = ref();
  const wkpId = ref();

  onMounted(() => {
    setTimeout(() => {
      workBenchData.value = props.componentData.record;
      operateBy.value = unref(workBenchData).operateBy ?? userStore.getUserInfo.username;
      if (unref(workBenchData).workPostId) {
        wkpId.value = unref(workBenchData).workPostId;
        if (unref(workBenchData).scanInfo) {
          sn.value = unref(workBenchData).scanInfo.sn;
          reload();
        } else {
          $message.createMessage.warning('请先扫描流转卡！');
          emit('close');
        }
      } else {
        $message.createMessage.warning('请先选择工位！');
        emit('close');
      }
    }, 500);
  });
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '扣料检验',
      api: () =>
        deductList({
          wkpId: unref(wkpId),
          sn: unref(sn),
          stationId: unref(workBenchData).stationId,
          actionCode: unref(workBenchData).actionId_dictText,
        }),
      columns: deductColumns,
      canResize: true,
      pagination: true,
      formConfig: {
        //labelWidth: 120,
        schemas: deductSearchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection }] = tableContext;

  function close() {
    emit('close');
  }
  // 下料
  async function doWoke() {
    try {
      let values = {};
      values['sn'] = sn.value;
      values['wkpId'] = wkpId.value;
      values['operateBy'] = operateBy.value;
      values['stationId'] = unref(workBenchData).stationId;
      values['actionCode'] = unref(workBenchData).actionId_dictText;

      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await deduct(values);
      //刷新列表
      emit('success');
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  async function submit() {
    try {
      emit('setModalProps', { confirmLoading: true });
      await doWoke();
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
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
