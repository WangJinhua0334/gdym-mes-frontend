<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="调试项" key="testItemPanel" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="testItemPanel"
          :loading="testItemTable.loading"
          :columns="testItemTable.columns"
          :dataSource="testItemTable.dataSource"
          :editConfig="testItemTable.editConfig"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
          @valueChange="tableValueChange"
        >
          <!--字段回显插槽-->
          <template #resultSwitch="record">
            <a-switch
              v-model:disabled="record.row.resultDisabled"
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="OK"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="NG"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
    <!--页脚-->
    <slot>
      <div class="footer">
        <a-button @click="doClose">关闭</a-button>
        <a-button type="primary" @click="doSave">保存</a-button>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, watch, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { formSchema, tableColums, wkpId } from './ProductTest.data';
  import { getTestData, saveTest } from './ProductTest.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const userStore = useUserStore();
  const $message = useMessage();
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  const workBenchData = ref<any>();
  const operator = ref<string>('');

  const sn = ref();
  const testData = ref();

  const testItemPanel = ref();
  const tableRefs = { testItemPanel };
  const activeKey = ref('testItemPanel');
  const refKeys = ref(['testItemPanel']);

  const testItemTable = reactive({
    loading: false,
    columns: tableColums,
    dataSource: [],
    editConfig: {
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
    },
  });

  // 测试项值变更事件
  function tableValueChange(args) {
    const { oldValue, value, row, column } = args;
    if (
      column.property != 'testTag' &&
      column.property != 'limitMin' &&
      column.property != 'minOperators' &&
      column.property != 'limitMax' &&
      column.property != 'maxOperators' &&
      column.property != 'value' &&
      column.property != 'result'
    )
      return;

    if (oldValue == value) return;

    if (column.property === 'testTag') {
      if (value === 'judgemengt') {
        row.limitMax = null;
        row.maxOperators = null;
        row.limitMin = null;
        row.minOperators = null;
        row.value = null;
        row.result = 'N';

        row.resultDisabled = false;
      } else {
        row.result = 'N';
        row.resultDisabled = true;
      }
    } else if (column.property != 'result') {
      let flag = false;
      if (row.limitMin) {
        if (row.minOperators && row.minOperators === 'lower_limit_gt') flag = row.value > row.limitMin;
        else if (row.minOperators && row.minOperators === 'lower_limit_gteq') flag = row.value >= row.limitMin;
        else flag = row.value == row.limitMin;
      }

      if (flag && row.limitMax) {
        if (row.maxOperators && row.maxOperators === 'top_limit_lt') flag = row.value < row.limitMax;
        else if (row.maxOperators && row.maxOperators === 'top_limit_lteq') flag = row.value <= row.limitMax;
        else flag = row.value == row.limitMax;
      }

      row.result = flag ? 'Y' : 'N';
    }

    autoCalculateResult();
  }

  // 自动计算结果
  function autoCalculateResult() {
    let result = 'Y';
    const rowData = testItemPanel.value.getTableData();
    rowData.forEach((data) => {
      if (!data.result || data.result === 'N') {
        result = 'N';
      }
    });

    setFieldsValue({ result: result });
  }

  //表单配置
  const [registerForm, { setFieldsValue, getFieldsValue, validate }] = useForm({
    showActionButtonGroup: false,
    schemas: formSchema,
    labelWidth: 150,
    baseColProps: { span: 24 },
  });

  //方法配置
  const [handleChangeTabs] = useJvxeMethod(null, null, tableRefs, activeKey, refKeys);

  onMounted(() => {
    setTimeout(() => {
      workBenchData.value = props.componentData.record;
      operator.value = unref(workBenchData).operateBy ?? userStore.getUserInfo.username;
      if (unref(workBenchData).workPostId) {
        wkpId.value = unref(workBenchData).workPostId;
        if (unref(workBenchData).scanInfo) {
          sn.value = unref(workBenchData).scanInfo.sn;
          doGetTestData();
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

  watch(
    () => unref(testData),
    () => {
      if (unref(testData)) {
        const data = unref(testData);

        setFieldsValue({ moCode: data.mesMo.code });
        setFieldsValue({ moPlanCode: data.mesMoPlan.code });
        setFieldsValue({ title: data.basWorkflowStation.title });
        setFieldsValue({ prodCode: data.basProduct.code });
        setFieldsValue({ prodName: data.basProduct.name });
        setFieldsValue({ sn: data.sn });
        setFieldsValue({ qty: data.qty });
        setFieldsValue({ equipmentId: data.equipmentId });
        setFieldsValue({ result: data.result });
        setFieldsValue({ defectIds: data.defectIds ? data.defectIds.split(',') : null });
        setFieldsValue({ remark: data.remark });
        setFieldsValue({ attachments: data.attachments });

        if (data.mesLotTestItemList && data.mesLotTestItemList.length > 0) {
          testItemTable.dataSource = data.mesLotTestItemList;
        }
      }
    },
    { immediate: false, deep: true }
  );

  /*
  function classifyIntoFormData(allValues) {
    console.log(allValues);
    let main = Object.assign({}, allValues.formValue);
    return {
      sn: unref(sn),
      isMove: !!isMove ? 'Y' : 'N',
      stationId: unref(workBenchData).stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      result: main.result,
      defectIds: main.defectIds,
      equipmentId: main.equipmentId,
      remark: main.remark,
      attachments: main.attachments,
      // 测试项列表
      testItemList: allValues.tablesValue[0].tableData,
    };
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      emit('setModalProps', { confirmLoading: true });
      //提交表单
      await doSaveTest(values);
      //关闭弹窗
      emit('close');
    } finally {
      emit('setModalProps', { confirmLoading: true });
    }
  }
  */

  // 获取测试数据
  async function doGetTestData() {
    emit('setModalProps', { loading: true });
    getTestData({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      operateBy: unref(operator),
    })
      .then((res) => {
        if (res.mesLotTestItemList) {
          for (let i in res.mesLotTestItemList) {
            let item = res.mesLotTestItemList[i];
            if (item.testTag === 'judgemengt') item.resultDisabled = false;
            else item.resultDisabled = true;
          }
        }

        testData.value = res;
        emit('setModalProps', { loading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  // 测试
  async function doSaveTest(isSubmit) {
    validate();
    tableRefs.testItemPanel.value.validateTable();
    emit('setModalProps', { loading: true });

    const formData = getFieldsValue();
    //如果为不良的话，不良消息接收人为必填
    if (isSubmit) {
      if (formData.result == 'N' && (formData.ngUserBy == null || formData.ngUserBy == '')) {
        $message.createMessage.warning('请选择不良消息接收人');
        return;
      }
    }
    let parameters = {
      sn: unref(sn),
      isMove: !!isSubmit ? 'Y' : 'N',
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      result: formData.result,
      defectIds: formData.defectIds,
      equipmentId: formData.equipmentId,
      remark: formData.remark,
      attachments: formData.attachments,
      // 测试项列表
      testItemList: testItemPanel.value.getTableData(),
      operateBy: unref(operator),
      ngUserBy: formData.ngUserBy,
    };

    await saveTest(parameters)
      .then((res) => {
        emit('success');
      })
      .catch((err) => {
        emit('setModalProps', { loading: false });
      });
  }

  function doClose() {
    emit('close');
  }

  async function doSave() {
    try {
      emit('setModalProps', { loading: true });
      await doSaveTest(false);
    } finally {
      emit('setModalProps', { loading: false });
    }
  }

  async function doSubmit() {
    try {
      emit('setModalProps', { loading: true });
      await doSaveTest(true);
    } finally {
      emit('setModalProps', { loading: false });
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
