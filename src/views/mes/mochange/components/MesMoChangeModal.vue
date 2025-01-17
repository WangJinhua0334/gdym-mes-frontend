<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" name="MesMoChangeForm" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="变更单子表" key="mesMoChangeDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoChangeDetail"
          :loading="mesMoChangeDetailTable.loading"
          :columns="mesMoChangeDetailTable.columns"
          :dataSource="mesMoChangeDetailTable.dataSource"
          :editConfig="mesMoChangeDetailTable.editConfig"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
          @valueChange="bomTableValueChange"
        >
          <template #writeSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { formSchema, mesMoChangeDetailJVxeColumns, moId, moStationList } from '../MesMoChange.data';
  import { saveOrUpdate, queryAddMesMoChangeDetail, mesMoStationList } from '../MesMoChange.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  let changeId = ref('');
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['mesMoChangeDetail']);
  const activeKey = ref('mesMoChangeDetail');
  const mesMoChangeDetail = ref();
  const tableRefs = { mesMoChangeDetail };
  const mesMoChangeDetailTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
    editConfig: any;
  }>({
    loading: false,
    dataSource: [],
    columns: mesMoChangeDetailJVxeColumns,
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      beforeEditMethod: ({ row, column }) => {
        if (column.property === 'prodId') {
          if (!!row.stationBomId) {
            return false;
          }
        }
        return true;
      },
    },
  });
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();
    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter, defaultFullscreen: true });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
      changeId.value = data?.record?.id;
      /**工单工序子列表赋值 */
      mesMoStationList({ mainId: data?.record?.moId }).then((res) => {
        moStationList.value = res.result;
      });
      requestSubTableData(queryAddMesMoChangeDetail, { id: data?.record?.id, moId: data?.record?.moId }, mesMoChangeDetailTable);
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //方法配置
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
    requestAddOrEdit,
    classifyIntoFormData,
    tableRefs,
    activeKey,
    refKeys
  );

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(formDisabled) ? '编辑' : '详情'));

  async function reset() {
    await resetFields();
    activeKey.value = 'mesMoChangeDetail';
    mesMoChangeDetailTable.dataSource = [];
  }
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      mesMoChangeDetailList: allValues.tablesValue[0].tableData,
    };
  }
  /**监听工单选择 */
  watch(
    () => unref(moId),
    async () => {
      /**工单工序子列表赋值 */
      mesMoStationList({ mainId: unref(moId) }).then((res) => {
        moStationList.value = res.result;
      });
      /**刷新子表 */
      requestSubTableData(queryAddMesMoChangeDetail, { id: changeId.value, moId: moId.value }, mesMoChangeDetailTable);
    },
    { immediate: false, deep: true }
  );

  // 测试项值变更事件
  function bomTableValueChange(args) {
    const { oldValue, value, row, column } = args;
    if (column.property == 'type') {
      if (row.type == 'add' && row.stationBomId != '') {
        $message.createMessage.error('原始数据不支持[新增]类型');
        row.type = '';
      } else if (row.type == 'update' && row.stationBomId == '') {
        $message.createMessage.error('新增数据不支持[修改]类型');
        row.type = '';
      } else if (row.type == 'delete' && row.stationBomId == '') {
        $message.createMessage.error('新增数据不支持[删除]类型');
        row.type = '';
      }
    }
    if (column.property != 'qty' && column.property != 'lossRate') return;

    if (oldValue == value) return;

    const moQty = Number(getFieldsValue().qty ? getFieldsValue().qty : 0);
    row.requireQty = calculateRequiredQty(moQty, row.qty, row.lossRate);
  }

  /**BOM物料需求量计算
   * @param moQty 工单数量
   * @param bomgQty 物料单位用量
   * @param bomLossRate 物料损耗率
   */
  function calculateRequiredQty(moQty, qty, lossRate) {
    if (!lossRate) {
      lossRate = 0;
    }

    let requiredQty = Number(moQty) * Number(qty);
    requiredQty += Number(requiredQty) * Number(lossRate);
    return requiredQty;
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
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
</style>
