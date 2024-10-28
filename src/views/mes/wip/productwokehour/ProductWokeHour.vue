<template>
  <BasicForm @register="registerForm" />
  <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
    <a-tab-pane tab="工时明细" key="hoursPanel" :forceRender="true">
      <JVxeTable
        keep-source
        resizable
        ref="hoursPanel"
        :loading="bindItemTable.loading"
        :columns="bindItemTable.columns"
        :dataSource="bindItemTable.dataSource"
        :rowNumber="true"
        :rowSelection="false"
        :toolbar="true"
        :toolbarConfig="{ btn: ['remove', 'clearSelection'] }"
      >
        <template #toolbarPrefix="{ text }">
          <a-button type="primary" @click="handleAddUser" v-show="true" preIcon="ant-design:plus-outlined"> 新增</a-button>
        </template>
      </JVxeTable>
    </a-tab-pane>
  </a-tabs>
  <!--页脚-->
  <slot>
    <div class="footer">
      <a-button @click="close">关闭</a-button>
      <a-button type="primary" @click="save">提交工时</a-button>
      <a-button type="primary" @click="submit">工序完工</a-button>
    </div>
  </slot>
  <JPopupOnlReportCustomModal
    @register="userModel"
    :code="userModelProps.code"
    :multi="userModelProps.multi"
    :sorter="userModelProps.sorter"
    :groupId="userModelProps.uniqGroupId"
    :param="userModelProps.params"
    :columns="userModelProps.columns"
    :method="userModelProps.method"
    :queryInfo="userModelProps.queryInfo"
    :url="userModelProps.url"
    @ok="userQueryCallBack"
  />
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, watch, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, wkpId, tableColums } from './ProductWokeHour.data';
  import { getWokeData, woke, wokeHour } from './ProductWokeHour.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { useModal } from '/@/components/Modal';

  const userStore = useUserStore();

  const hoursPanel = ref();
  const tableRefs = { hoursPanel };
  const activeKey = ref('hoursPanel');
  const refKeys = ref(['hoursPanel']);
  //方法配置
  const [handleChangeTabs] = useJvxeMethod(null, null, tableRefs, activeKey, refKeys);

  const bindItemTable = reactive({
    loading: false,
    columns: tableColums,
    dataSource: [],
  });
  //弹框配置
  const userModelProps = {
    code: '',
    multi: true,
    sorter: '',
    uniqGroupId: 'button_user_query' + Math.random(),
    method: 'get',
    url: '/sys/user/list',
    params: {},
    columns: [
      {
        title: '账号',
        align: 'center',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'realname',
      },
    ],
    queryInfo: [
      {
        field: 'username',
        label: '账号',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'realname',
        label: '姓名',
        mode: 'single',
        view: 'string',
      },
    ],
  };
  const [userModel, { openModal }] = useModal();
  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const $message = useMessage();
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  const workBenchData = props.componentData.record;

  const sn = ref();
  const wokeData = ref();

  watch(
    () => unref(wokeData),
    () => {
      if (unref(wokeData)) {
        /*setFieldsValue({
          ...unref(scanResult),
        });*/

        setFieldsValue({ moCode: unref(wokeData).mesMo.code });
        setFieldsValue({ moPlanCode: unref(wokeData).mesMoPlan.code });
        setFieldsValue({ title: unref(wokeData).basWorkflowStation.title });
        setFieldsValue({ prodCode: unref(wokeData).basProduct.code });
        setFieldsValue({ prodName: unref(wokeData).basProduct.name });
        //setFieldsValue({ prodSpec: unref(scanResult).basProduct.specification });
        setFieldsValue({ sn: unref(wokeData).sn });
        setFieldsValue({ qty: unref(wokeData).qty });
        setFieldsValue({ wokenQty: unref(wokeData).wokenQty });
        setFieldsValue({ wokeQty: unref(wokeData).qty - unref(wokeData).wokenQty });
        setFieldsValue({ scrapedQty: 0 });
        setFieldsValue({ startTime: new Date() });
        setFieldsValue({ completeTime: new Date() });
        setFieldsValue({ operator: unref(workBenchData).operateBy ?? userStore.getUserInfo.username });
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  onMounted(() => {
    setTimeout(() => {
      if (unref(workBenchData).workPostId) {
        wkpId.value = unref(workBenchData).workPostId;
        if (unref(workBenchData).scanInfo) {
          sn.value = workBenchData.scanInfo.sn;
          doGetWokeData();
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

  // 传给弹出框的params
  const currentParams = ref({});
  //用户信息新增方法
  function handleAddUser() {
    currentParams.value = {};
    openModal(true);
  }
  //选择物料信息回调
  function userQueryCallBack(rows) {
    if (rows && rows.length > 0) {
      const haveRows = hoursPanel.value.getXTable().getTableData().fullData;
      for (let row of rows) {
        if (haveRows && haveRows.length > 0) {
          for (let haveRow of haveRows) {
            if (row.id == haveRow.id) {
              break;
            }
          }
        }
        let addRow = {
          id: row.id,
          username: row.username,
          realname: row.realname,
          standardHours: 0,
          workHours: 0,
          restHours: 0,
          holidaysHours: 0,
        };
        hoursPanel.value.addRows([addRow]);
      }
    }
  }
  // 过站校验
  async function doGetWokeData() {
    emit('setModalProps', { confirmLoading: true });
    getWokeData({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      operateBy: getFieldsValue().operator,
    })
      .then((res) => {
        wokeData.value = res;
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  // 过站
  async function doWoke() {
    emit('setModalProps', { confirmLoading: true });
    await woke({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      equipmentId: getFieldsValue().equipmentId,
      qty: getFieldsValue().wokeQty,
      scrapedQty: getFieldsValue().scrapedQty,
      startTime: getFieldsValue().startTime,
      completeTime: getFieldsValue().completeTime,
      operateBy: getFieldsValue().operator,
      hoursList: hoursPanel.value.getXTable().getTableData().fullData,
    })
      .then((res) => {
        emit('success');
      })
      .catch((err) => {
        emit('setModalProps', { confirmLoading: false });
      });
  }

  function close() {
    emit('close');
  }
  /**
   * 提交过栈
   */
  async function submit() {
    await validate();
    try {
      emit('setModalProps', { confirmLoading: true });
      await doWoke();
    } finally {
      emit('setModalProps', { confirmLoading: false });
    }
  }
  /**
   * 只保存工时信息
   */
  async function save() {
    await validate();
    try {
      emit('setModalProps', { confirmLoading: true });
      await wokeHour({
        sn: unref(sn),
        stationId: unref(workBenchData).scanInfo.stationId,
        actionCode: unref(workBenchData).actionId_dictText,
        wkpId: unref(workBenchData).workPostId,
        equipmentId: getFieldsValue().equipmentId,
        qty: getFieldsValue().wokeQty,
        scrapedQty: getFieldsValue().scrapedQty,
        startTime: getFieldsValue().startTime,
        completeTime: getFieldsValue().completeTime,
        operateBy: getFieldsValue().operator,
        hoursList: hoursPanel.value.getXTable().getTableData().fullData,
      })
        .then((res) => {
          emit('success');
        })
        .catch((err) => {
          emit('setModalProps', { confirmLoading: false });
        });
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
