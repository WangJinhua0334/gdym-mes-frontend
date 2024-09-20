<template>
  <BasicForm @register="registerForm" ref="formRef" />
  <!-- 子表单区域 -->
  <a-tabs tabPosition="top">
    <a-tab-pane tab="物料条码绑定" key="bindSnListPanel" :forceRender="true">
      <!--引用表格-->
      <BasicTable @register="registerTable">
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
    </a-tab-pane>
  </a-tabs>
  <!-- <slot>
    <div class="footer">
      <a-button @click="handleClose">关闭</a-button>
    </div>
  </slot> -->

  <BasicModal @register="registerManualModal" destroyOnClose :title="'手动绑定'" :width="800" @cancel="closeManualModal" @ok="handleManualBindSubmit">
    <BasicForm @register="registerSubForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive, onMounted, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { formSchema, columns, bindFormSchema, selectedMoPlanId, doEnterPressing } from './MesMoPlanBindSn.data';
  import { queryById, listMaterialBindSnData, deleteSn, bindSn, manualBindSn } from '../MesMoPlan.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  // // Emits声明
  const emit = defineEmits(['register', 'setModalProps', 'success', 'close']);
  //提示弹窗
  const $message = useMessage();

  //获取父组件传递的数据
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
    moPlanId: {
      type: String,
      default: '',
    },
  });

  /**
   * 重置
   */
  async function reset() {
    selectedMoPlanId.value = null;
    doEnterPressing.value = false;
    resetFields();
  }

  onMounted(() => {
    reset();

    setTimeout(() => {
      //工作台页面加载处理
      if (props.componentData && unref(props.componentData.record.scanInfo).moPlanId) {
        setFieldsValue({ moPlanId: unref(props.componentData.record.scanInfo).moPlanId });
        selectedMoPlanId.value = unref(props.componentData.record.scanInfo).moPlanId;
      }

      //生产计划界面加载处理
      if (props.moPlanId) {
        setFieldsValue({ moPlanId: props.moPlanId });
        selectedMoPlanId.value = props.moPlanId;
      }
    }, 500);
  });

  // 监听生产任务选择
  watch(
    () => unref(selectedMoPlanId),
    async () => {
      if (unref(selectedMoPlanId)) {
        try {
          emit('setModalProps', { confirmLoading: true, loading: true });
          await queryById({ id: unref(selectedMoPlanId) }).then(async (moPlan) => {
            setFieldsValue({ ...moPlan });
            await listMaterialBindSnData({ id: unref(selectedMoPlanId) }).then((res) => {
              dataSource.value = res;
              emit('setModalProps', { confirmLoading: false, loading: false });
            });
          });
        } catch (error) {
          reset();
          emit('close');
        }
      } else {
        reset();
      }
    },
    { immediate: false, deep: true }
  );

  // 监听回车事件
  watch(
    () => doEnterPressing.value,
    () => {
      if (doEnterPressing.value) {
        handleSubmit();
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
  });

  // 数据源
  const dataSource = ref<any[]>([]);

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      //title: '流转卡绑定明细',
      dataSource: dataSource,
      columns,
      canResize: false,
      immediate: false,
      showTableSetting: false,
      useSearchForm: false,
      pagination: false,
      showActionColumn: true,
      actionColumn: {
        width: 90,
        fixed: 'right',
      },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //表单配置
  const [registerSubForm, { resetFields: resetSubFromFields, setFieldsValue: setSubFromFieldsValue, validate: validateSubFrom }] = useForm({
    labelWidth: 150,
    schemas: bindFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });

  const [registerManualModal, { setModalProps: setManualModalProps, openModal: openManualModal, closeModal: closeManualModal }] = useModal();

  //表单提交事件
  async function handleSubmit() {
    let values = await validate();

    try {
      emit('setModalProps', { confirmLoading: true, loading: true });
      await bindSn({ moPlanId: values.moPlanId, bindSn: values.bindSn }).then((res) => {
        setFieldsValue({ bindSn: '' });
        handleSuccess();
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      emit('setModalProps', { confirmLoading: false, loading: false });
      doEnterPressing.value = false;
    }
  }

  /**
   * 删除事件
   */
  async function handleDelete(record: Recordable) {
    if (record.isInput == 'Y') {
      $message.createMessage.warning('流转卡已投产，不能删除');
      return;
    }

    await deleteSn({ id: record.bindSnId }).then(() => {
      handleSuccess();
    });
  }

  /**
   * 手动绑定事件
   */
  async function handleManualBind(record: Recordable) {
    await openManualModal(true);

    await resetSubFromFields();

    const values = { ...record };
    values.bindQty = 1;
    await setSubFromFieldsValue(values);
  }

  /**
   * 手动绑定提交
   */
  async function handleManualBindSubmit() {
    const values = await validateSubFrom();

    try {
      setManualModalProps({ confirmLoading: true });
      await manualBindSn({ moPlanId: values.moPlanId, prodId: values.prodId, bindSn: values.bindSn, bindQty: values.bindQty }).then(() => {
        closeManualModal();
        handleSuccess();
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setManualModalProps({ confirmLoading: false });
    }
  }

  /**
   * 成功事件
   */
  async function handleSuccess() {
    //刷新列表
    if (unref(selectedMoPlanId)) {
      await listMaterialBindSnData({ id: unref(selectedMoPlanId) }).then((res) => {
        dataSource.value = res;
      });
    } else {
      dataSource.value = [];
    }
  }

  function handleClose() {
    reset();
    emit('close');
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    let arr: any[] = [];
    if (!!record.bindSnId && record.isInput == 'N') {
      arr.push({
        label: '删除',
        popConfirm: {
          title: '是否删除?',
          confirm: handleDelete.bind(null, record),
        },
      });
    } else if (!record.bindSnId) {
      arr.push({
        label: '手动绑定',
        onClick: handleManualBind.bind(null, record),
      });
    }
    return arr;
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

  :deep(.ant-picker) {
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
