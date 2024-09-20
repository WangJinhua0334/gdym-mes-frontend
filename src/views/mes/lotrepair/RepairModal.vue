<template>
  <BasicForm @register="registerRepairForm" :showFooter="false" />
  <div v-for="item in defects" :key="item.id">
    <hr style="padding-bottom: 20px" />
    <DefectModal :defect="item" @addRefs="addRefs" />
  </div>
  <hr />
  <a-tabs v-model:activeKey="activeKey" style="padding-bottom: 25px">
    <a-tab-pane tab="物料绑定" key="prodBind" :forceRender="true">
      <JVxeTable
        keep-source
        resizable
        ref="prodBind"
        :loading="prodBindTable.loading"
        :columns="prodBindTable.columns"
        :dataSource="prodBindTable.dataSource"
        :height="340"
        :rowNumber="true"
        :rowSelection="false"
        :toolbar="false"
      >
        <!-- 定义插槽 -->
        <template #action="props">
          <a @click="handleReplace(props)">替换</a>
          <!-- <a-divider type="vertical" />
          <a @click="handleUnbind(props)">解绑</a> -->
        </template>
      </JVxeTable>
    </a-tab-pane>
  </a-tabs>
  <!-- <div class="submit-div">
    <a-button type="primary" @click="handleSubmit"> 提交</a-button>
  </div> -->
  <slot>
    <div class="footer">
      <a-button @click="doClose">关闭</a-button>
      <a-button type="primary" @click="handleSubmit">确认</a-button>
    </div>
  </slot>
  <div>
    <!-- <ProdReplaceModal @register="registerProdReplaceModal" @success="handleSuccess" /> -->
    <ProductBindModal @register="registerBindModal" @success="handleGetData" />
    <ProductUnbindModal @register="registerUnbindModal" @success="handleGetData" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted, watch, inject, nextTick, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, prodBindJVxeColumns, scanSn } from './RepairModal.data';
  import { saveOrUpdate, queryBySn, queryMesLotRepairDetailByRepairId, itembindsListByLotSn, getBindData } from './RepairModal.api';
  import DefectModal from './defect/DefectModal.vue';
  import ProductBindModal from './components/ProductBindModal.vue';
  import ProductUnbindModal from './components/ProductUnbindModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';
  //提示弹窗
  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'close', 'success']);

  //注册model
  //const [registerProdReplaceModal, { openModal: openProdReplaceModal }] = useProdReplaceModal();
  const [registerBindModal, { openModal: openBindModal }] = useModal();
  const [registerUnbindModal, { openModal: openUnbindModal }] = useModal();

  //调用ts页面的方法
  scanSn.value = (sn) => {
    scranLotSn(sn);
  };
  //获取父组件传递的数据
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });
  const defects = ref([]);
  const repairInfo = ref();
  const activeKey = ref('prodBind');
  const prodBind = ref();
  const tableRefs = { prodBind };
  const userStore = useUserStore();
  const prodBindTable = reactive({
    loading: false,
    dataSource: [] as any,
    columns: prodBindJVxeColumns,
  });

  const itemRefs = [] as any;
  const operateBy = ref<string>('');
  function addRefs(form) {
    itemRefs.push(form);
  }

  watch(
    () => repairInfo.value,
    () => {
      if (unref(repairInfo)) {
        setFieldsValue({ ...unref(repairInfo) });
        queryMesLotRepairDetailByRepairId({ id: unref(repairInfo).id }).then((res) => {
          if (res && res.length > 0) {
            defects.value = res;
          }
        });
        itembindsListByLotSn({ lotId: unref(repairInfo).lotId }).then((res) => {
          if (res && res.length > 0) {
            console.log(res);
            prodBindTable.dataSource = [...unref(res)];
          }
        });
      }
    },
    { immediate: false, deep: true }
  );
  //操作完刷新绑定列表
  function handleGetData() {
    itembindsListByLotSn({ lotId: unref(repairInfo).lotId }).then((res) => {
      if (res && res.length > 0) {
        prodBindTable.dataSource = [...unref(res)];
      }
    });
  }
  /**
   * 解绑
   */
  function handleUnbind(record) {
    openUnbindModal(true, {
      record: unref(record).row,
      operateBy: unref(operateBy),
    });
  }

  /**
   * 替换
   */
  function handleReplace(record) {
    console.log(record);
    openBindModal(true, {
      wkpId: unref(props.componentData.record).workPostId,
      action: 'bindReplace',
      record: unref(record).row,
      operateBy: unref(operateBy),
    });
  }
  //加载事件
  onMounted(() => {
    resetFields();
    defects.value = [];
    setTimeout(() => {
      operateBy.value = unref(props.componentData.record).operateBy ?? userStore.getUserInfo.username;
      if (unref(props.componentData.record).workPostId) {
      } else {
        $message.createMessage.warning('请先选择工位！');
        emit('close');
      }
      if (unref(props.componentData.record.scanInfo).sn) {
        scranLotSn(unref(props.componentData.record.scanInfo).sn);
        updateSchema({ field: 'lotSn', componentProps: { disabled: true } });
      } else {
        updateSchema({ field: 'lotSn', componentProps: { disabled: false } });
      }
    }, 500);
  });
  /**
   * 根据sn查询数据
   * @param sn
   */
  function scranLotSn(sn) {
    queryBySn({ sn: sn })
      .then((res) => {
        if (res && res.length > 0) {
          let result = res.filter((s) => s.status == 'wait_repair');
          if (result && result.length > 0) {
            repairInfo.value = res[0];
          } else {
            $message.createMessage.warning('维修单已被处理');
            //emit('close');
          }
        } else {
          $message.createMessage.warning('没有需要维修的产品');
          //emit('close');
        }
      })
      .catch((e) => {
        emit('close');
      });
  }
  //表单配置
  const [registerRepairForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //关闭按钮事件
  function doClose() {
    emit('close');
  }
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      let mesLotRepairDetailList = [];
      if (itemRefs && itemRefs.length > 0) {
        for (let item of itemRefs) {
          let def = unref(defects).filter((s) => s.id == unref(item).getFieldsValue().id);
          let obj = Object.assign({}, def[0], unref(item).getFieldsValue());
          mesLotRepairDetailList.push(obj);
        }
      }
      // defects
      values.mesLotRepairDetailList = mesLotRepairDetailList;
      //values.mesLotItemBindList = prodBind.value.getXTable().getTableData().fullData;

      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await saveOrUpdate(values);
      emit('success');
    } finally {
      emit('setModalProps', { confirmLoading: false });
      emit('success');
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
