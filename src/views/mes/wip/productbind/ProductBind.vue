<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="物料明细" key="bindItemPanel" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="bindItemPanel"
          :loading="bindItemTable.loading"
          :columns="bindItemTable.columns"
          :dataSource="bindItemTable.dataSource"
          :editConfig="bindItemTable.editConfig"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
        >
          <!--字段回显插槽-->
          <!-- <template #action="record">
            <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
          </template> -->
          <template #action="{ row }">
            <div v-if="row.binded">
              <a @click="handleUnbind(row)">解绑</a>
              <a-divider type="vertical" />
              <a @click="handleReplace(row)">替换</a>
              <a-divider v-if="!!row.image" type="vertical" />
              <a v-if="!!row.image" @click="handleDetail(row)">附件</a>
            </div>

            <div v-else>
              <a @click="handleBind(row)">绑定</a>
            </div>
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
    <!--页脚-->
    <slot>
      <div class="footer">
        <a-button @click="handleClose">关闭</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </div>
    </slot>

    <ProductBindModal @register="registerBindModal" @success="handleGetData" />
    <ProductUnbindModal @register="registerUnbindModal" @success="handleGetData" />
    <ProductBindAttachmentsDrawer @register="registerAttactmentsDrawer" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, watch, reactive } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import ProductBindModal from './components/ProductBindModal.vue';
  import ProductUnbindModal from './components/ProductUnbindModal.vue';
  import ProductBindAttachmentsDrawer from './components/AttachmentsDrawer.vue';
  import { formSchema, tableColums, scanFunc, wkpId } from './ProductBind.data';
  import { getBindData, bind } from './ProductBind.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const [registerBindModal, { openModal: openBindModal }] = useModal();
  const [registerUnbindModal, { openModal: openUnbindModal }] = useModal();
  const [registerAttactmentsDrawer, { openDrawer: openAttactmentsDrawer }] = useDrawer();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const $message = useMessage();
  const userStore = useUserStore();
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  const workBenchData = ref<any>();
  const operateBy = ref<string>('');

  const sn = ref();
  const bindData = ref();

  const bindItemPanel = ref();
  const tableRefs = { bindItemPanel };
  const activeKey = ref('bindItemPanel');
  const refKeys = ref(['bindItemPanel']);

  const bindItemTable = reactive({
    loading: false,
    columns: tableColums,
    dataSource: [],
    /*editConfig: {
      trigger: 'click',
      mode: 'cell',
      beforeEditMethod: ({ row, column }) => {
        if (
          column.property === 'minOperators' ||
          column.property === 'limitMin' ||
          column.property === 'maxOperators' ||
          column.property === 'limitMax' ||
          column.property === 'value'
        ) {
          if (!row.testTag || row.testTag === 'judgemengt') {
            return false;
          }
        } else if (column.property === 'result') {
          if (!row.testTag || row.testTag != 'judgemengt') {
            return false;
          }
        } else if (column.property === 'remark' || column.property === 'attachment') {
          if (!row.testTag) {
            return false;
          }
        }

        return true;
      },
    },*/
  });
  //表单配置
  const [registerForm, { setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: formSchema,
    labelWidth: 150,
    baseColProps: { span: 24 },
  });

  //方法配置
  const [handleChangeTabs] = useJvxeMethod(null, null, tableRefs, activeKey, refKeys);

  onMounted(() => {
    setTimeout(() => {
      scanFunc.value = handleScan;

      workBenchData.value = props.componentData.record;
      operateBy.value = unref(workBenchData).operateBy ?? userStore.getUserInfo.username;
      if (unref(workBenchData).workPostId) {
        wkpId.value = unref(workBenchData).workPostId;
        if (unref(workBenchData).scanInfo) {
          sn.value = unref(workBenchData).scanInfo.sn;
          handleGetData();
        } else {
          $message.createMessage.warning('请先扫描流转卡！');
          emit('close');
        }
      } else {
        $message.createMessage.warning('请先选择工位！');
        emit('close');
      }
      setFieldsValue({ sn: '' });
      document.getElementById('form_item_materialSn')?.focus();
    }, 500);
  });

  watch(
    () => unref(bindData),
    () => {
      if (unref(bindData)) {
        const data = unref(bindData);

        setFieldsValue({ moCode: data.mesMo.code });
        setFieldsValue({ moPlanCode: data.mesMoPlan.code });
        setFieldsValue({ title: data.basWorkflowStation.title });
        setFieldsValue({ prodCode: data.basProduct.code });
        setFieldsValue({ prodName: data.basProduct.name });
        setFieldsValue({ sn: data.sn });
        setFieldsValue({ qty: data.qty });

        if (data.mesLotItemBindList && data.mesLotItemBindList.length > 0) {
          data.mesLotItemBindList.forEach((item) => {
            if (item.id == null || item.id == '') item.binded = false;
            else item.binded = true;
          });
          bindItemTable.dataSource = data.mesLotItemBindList;
        }
      }
    },
    { immediate: false, deep: true }
  );

  /**获取绑定数据 */
  function handleGetData() {
    emit('setModalProps', { confirmLoading: true });
    getBindData({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      operateBy: unref(operateBy),
    })
      .then((res) => {
        bindData.value = res;
        emit('setModalProps', { confirmLoading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  /**扫描 */
  function handleScan(materialSn) {
    bind({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      materialSnList: [materialSn],
      operateBy: unref(operateBy),
      isMove: 'N',
    }).then(() => {
      setFieldsValue({ materialSn: '' });
      handleGetData();
    });
  }

  /**
   * 绑定
   */
  function handleBind(record) {
    openBindModal(true, {
      action: 'bind',
      sn: unref(sn),
      wkpId: unref(workBenchData).workPostId,
      stationId: unref(workBenchData).stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      record: record,
      operateBy: unref(operateBy),
    });
  }

  /**
   * 解绑
   */
  function handleUnbind(record) {
    openUnbindModal(true, {
      record: record,
      operateBy: unref(operateBy),
    });
  }

  /**
   * 替换
   */
  function handleReplace(record) {
    openBindModal(true, {
      action: 'bindReplace',
      sn: unref(sn),
      wkpId: unref(workBenchData).workPostId,
      stationId: unref(workBenchData).stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      record: record,
      operateBy: unref(operateBy),
    });
  }

  /**
   * 详情
   */
  function handleDetail(record) {
    openAttactmentsDrawer(true, {
      record: record,
    });
  }

  /**
   * 关闭
   */
  function handleClose() {
    //scanFunc.value = null;
    wkpId.value = null;

    emit('close');
  }

  /**
   * 提交
   */
  function handleSubmit() {
    bind({
      sn: unref(sn),
      stationId: unref(workBenchData).stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      isMove: 'Y',
    }).then((res) => {
      if (res == 2) {
        //scanFunc.value = null;
        wkpId.value = null;

        emit('success');
      }
    });
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
