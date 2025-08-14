<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs" style="padding-bottom: 30px">
      <a-tab-pane :tab="judgeCount" key="judgemengItemPanel" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="judgemengItemPanel"
          :loading="judgemengItemTable.loading"
          :columns="judgemengItemTable.columns"
          :dataSource="judgemengItemTable.dataSource"
          :rowNumber="true"
          :rowSelection="true"
          :keyboardEdit="true"
          @value-change="editClosedJud"
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
          <template #mustSwitch="record">
            <a-switch
              :disabled="true"
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
      <a-tab-pane :tab="measureCount" key="measurementItemPanel" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="measurementItemPanel"
          :loading="measurementItemTable.loading"
          :columns="measurementItemTable.columns"
          :dataSource="measurementItemTable.dataSource"
          :rowNumber="true"
          :rowSelection="true"
          :keyboardEdit="true"
          @edit-closed="editClosed"
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
          <template #mustSwitch="record">
            <a-switch
              :disabled="true"
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
        <a-button type="primary" @click="doSubmit" v-if="hasPermission('mes:workbench:productoutinspSub')">提交</a-button>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, watch, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { formSchema, judTableColums, meaTableColums, wkpId, samplingQty } from './ProductOutInspect.data';
  import { getOutInspectData, saveOutInspect } from './ProductOutInspect.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { JVxeColumn, JVxeTypes } from '/@/components/jeecg/JVxeTable/src/types';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const { createConfirm } = useMessage();

  // Emits声明
  const emit = defineEmits(['setModalProps', 'success', 'close']);
  const $message = useMessage();
  const props = defineProps({
    componentData: {
      type: Object,
      default: () => {},
    },
  });

  let judgeCount = ref('定性检测(0)');
  let measureCount = ref('定量检测(0)');
  let workBenchData = ref<any>();
  const sn = ref();
  const inspectData = ref();
  const newJudTableColums = ref<JVxeColumn[]>([]);
  const newMeaTableColums = ref<JVxeColumn[]>([]);
  const judgemengItemPanel = ref();
  const measurementItemPanel = ref();
  const tableRefs = { judgemengItemPanel, measurementItemPanel };
  const activeKey = ref('judgemengItemPanel');
  const refKeys = ref(['judgemengItemPanel', 'measurementItemPanel']);

  //定性检测
  const judgemengItemTable = reactive({
    loading: false,
    columns: newJudTableColums,
    dataSource: [],
    edit: true,
    scrollX: true,
  });
  //定量检测
  const measurementItemTable = reactive({
    loading: false,
    columns: newMeaTableColums,
    dataSource: [],
    edit: true,
    scrollX: true,
  });
  //定量编辑关闭后触发事件
  function editClosed(data) {
    // 提前缓存常用变量
    const columnKey = unref(data.column).key;
    const isTargetColumn = columnKey.includes('value') && !columnKey.includes('Sn');
    const tableData = measurementItemPanel.value.getXTable().getTableData().fullData;
    const itemData = tableData[data.rowIndex];

    if (!isTargetColumn) return;

    // 提取公共变量
    const { limitMin, minOperators, limitMax, maxOperators } = itemData;
    // 判断是否需要设置结果为 'N'
    let shouldSetN = false;
    const formData = getFieldsValue();
    for (let i = 0; i < formData.samplingQty; i++) {
      const value = itemData['value' + (i + 1)];
      if (value == undefined) {
        shouldSetN = true;
        continue;
      }
      // 下限判断
      if (limitMin != null && minOperators && value != null) {
        if (!compareValues(value, minOperators, limitMin)) {
          shouldSetN = true;
        }
      }
      // 上限判断
      if (!shouldSetN && limitMax != null && maxOperators && value != null) {
        if (!compareValues(value, maxOperators, limitMax)) {
          shouldSetN = true;
        }
      }
    }
    // 设置最终结果
    itemData.result = shouldSetN ? 'N' : 'Y';
    autoCalculateResult();
  }
  /**
   * 通过传入比较符，判断是否满足
   **/
  function compareValues(value1: number, operator: string, value2: number): boolean {
    console.log(value1, operator, value2);
    switch (operator) {
      case 'lower_limit_gt': //>
        return value1 > value2;
      case 'lower_limit_gteq': //>=
        return value1 >= value2;
      case 'lower_limit_eq': //==
        return value1 == value2;
      case 'top_limit_lt': //>
        return value1 < value2;
      case 'top_limit_lteq': //<=
        return value1 <= value2;
      case 'top_limit_eq': //==
        return value1 == value2;
      case '!=':
        return value1 != value2;
      default:
        throw new Error('未知的运算符');
    }
  }
  //定性编辑关闭后触发事件
  function editClosedJud(data) {
    if (unref(data.column).key.includes('result')) {
      let itemResult = 'Y';
      let itemData = judgemengItemPanel.value.getXTable().getTableData().fullData[data.rowIndex];
      const formData = getFieldsValue();
      for (let i = 0; i < formData.samplingQty; i++) {
        if (!itemData['result' + (i + 1)] || itemData['result' + (i + 1)] == 'N') {
          itemResult = 'N';
        }
      }
      judgemengItemPanel.value.getXTable().getTableData().fullData[data.rowIndex].result = itemResult;
    }
    autoCalculateResult();
  }
  //按抽样数进行生成列
  function createColumn(qty) {
    newJudTableColums.value = [...judTableColums];
    newMeaTableColums.value = [...meaTableColums];
    for (let i = 0; i < qty; i++) {
      //动态生成列，添加结果--定性
      newJudTableColums.value.push(
        {
          title: 'V' + (i + 1) + '结果',
          key: 'result' + (i + 1),
          defaultValue: 'N',
          customValue: ['Y', 'N'],
          type: JVxeTypes.slot,
          align: 'center',
          slotName: 'resultSwitch',
          validateRules: [{ required: true, message: '${title}不能为空' }],
          width: 120,
          minWidth: 120,
        },
        {
          title: 'V' + (i + 1) + 'SN',
          key: 'sn' + (i + 1),
          align: 'center',
          type: JVxeTypes.input,
          width: 120,
          minWidth: 120,
        }
      );
      //动态生成列，添加结果--定量
      newMeaTableColums.value.push(
        {
          title: 'V' + (i + 1) + '值',
          key: 'value' + (i + 1),
          type: JVxeTypes.inputNumber,
          align: 'center',
          placeholder: '请输入${title}',
          width: 120,
          minWidth: 120,
          formatter: ({ cellValue }) => {
            // 显示时格式化为两位小数
            if (typeof cellValue === 'number') {
              return Number(cellValue).toFixed(2);
            }
            return cellValue;
          },
        },
        {
          title: 'V' + (i + 1) + 'SN',
          key: 'valueSn' + (i + 1),
          align: 'center',
          type: JVxeTypes.input,
          width: 120,
          minWidth: 120,
        }
      );
    }
    //添加结果栏
    newJudTableColums.value.push({
      title: '结果',
      key: 'result',
      disabled: true,
      defaultValue: 'N',
      customValue: ['Y', 'N'],
      type: JVxeTypes.slot,
      align: 'center',
      slotName: 'mustSwitch',
      width: 120,
      minWidth: 120,
    });
    //在最后面添加备注和附件列--定性
    newJudTableColums.value.push({
      title: '备注',
      key: 'remark',
      type: JVxeTypes.textarea,
      placeholder: '请输入${title}',
      width: 200,
      minWidth: 200,
    });
    newJudTableColums.value.push({
      title: '附件',
      key: 'attachments',
      align: 'center',
      type: JVxeTypes.file,
      width: 200,
      minWidth: 200,
    });
    //添加结果栏
    newMeaTableColums.value.push({
      title: '结果',
      key: 'result',
      disabled: true,
      defaultValue: 'N',
      customValue: ['Y', 'N'],
      type: JVxeTypes.slot,
      align: 'center',
      slotName: 'mustSwitch',
      width: 120,
      minWidth: 120,
    });
    //在最后面添加备注和附件列--定量
    newMeaTableColums.value.push({
      title: '备注',
      key: 'remark',
      type: JVxeTypes.textarea,
      placeholder: '请输入${title}',
      width: 200,
      minWidth: 200,
    });
    newMeaTableColums.value.push({
      title: '附件',
      key: 'attachments',
      align: 'center',
      type: JVxeTypes.file,
      width: 200,
      minWidth: 200,
    });
    judgemengItemPanel.value.getXTable().reloadColumn(newJudTableColums);
    measurementItemPanel.value.getXTable().reloadColumn(newMeaTableColums);
  }
  // 自动计算结果
  function autoCalculateResult() {
    let result = 'Y';
    const rowJudData = judgemengItemPanel.value.getTableData();
    rowJudData.forEach((data) => {
      if (data.result === 'N') {
        result = 'N';
      }
    });
    const rowMeaData = measurementItemPanel.value.getTableData();
    rowMeaData.forEach((data) => {
      if (data.result === 'N') {
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
      workBenchData = props.componentData.record;
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
  //监听抽样数量数据改变
  watch(
    () => samplingQty.value,
    () => {
      console.log(unref(samplingQty));
      createColumn(unref(samplingQty));
    },
    { immediate: false, deep: true }
  );
  //监听检验数据改变
  watch(
    () => unref(inspectData),
    () => {
      if (unref(inspectData)) {
        const data = unref(inspectData);

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
        setFieldsValue({ schemaDesc: data.schemaDesc });
        setFieldsValue({ schemaStdDesc: data.schemaStdDesc });
        setFieldsValue({ samplingQty: data.samplingQty ? data.samplingQty : 1 });

        //创建生成列
        createColumn(data.samplingQty ? data.samplingQty : 1);
        //解析数据进行赋值
        if (data.outInspItemList && data.outInspItemList.length > 0) {
          analysisData(data.outInspItemList);
        }
      }
    },
    { immediate: false, deep: true }
  );
  //解析检验项数据，赋值
  function analysisData(lotInspItem) {
    if (lotInspItem.length > 0) {
      let judDataList = ref<any>([]);
      let meaDataList = ref<any>([]);
      for (let item of lotInspItem) {
        //添加定性
        if (item.inspTag == 'judgemengt') {
          const addRowJud = {
            id: item.id,
            stdItemId: item.stdItemId,
            code: item.code,
            unitId: item.unitId,
            description: item.description,
            attachments: item.attachments,
            remark: item.remark,
            isSuitable: item.isSuitable,
            inspTool: item.inspTool,
            inspBasis: item.inspBasis,
            techRequirements: item.techRequirements,
            result: item.result,
          };
          //添加值
          if (unref(item.valueList) && unref(item.valueList).length > 0) {
            for (let i = 0; i < unref(item.valueList).length; i++) {
              let key1 = 'result' + (i + 1);
              let key2 = 'sn' + (i + 1);
              Reflect.set(addRowJud, key1, unref(item.valueList)[i].value > 0 ? 'N' : 'Y');
              Reflect.set(addRowJud, key2, unref(item.valueList)[i].sn);
            }
          }
          judDataList.value.push(addRowJud);
        }
        //添加定量
        if (item.inspTag == 'measurement') {
          const addRowMea = {
            id: item.id,
            stdItemId: item.stdItemId,
            code: item.code,
            description: item.description,
            unitId: item.unitId,
            minOperators: item.minOperators,
            maxOperators: item.maxOperators,
            limitMin: item.limitMin,
            limitMax: item.limitMax,
            attachments: item.attachments,
            remark: item.remark,
            isSuitable: item.isSuitable,
            inspTool: item.inspTool,
            inspBasis: item.inspBasis,
            techRequirements: item.techRequirements,
            result: item.result,
          };
          //添加值
          if (unref(item.valueList) && unref(item.valueList).length > 0) {
            for (let i = 0; i < unref(item.valueList).length; i++) {
              let key1 = 'value' + (i + 1);
              let key2 = 'valueSn' + (i + 1);
              Reflect.set(addRowMea, key1, unref(item.valueList)[i].value);
              Reflect.set(addRowMea, key2, unref(item.valueList)[i].sn);
            }
          }
          meaDataList.value.push(addRowMea);
        }
      }
      judgeCount.value = '定性检测(' + judDataList.value.length + ')';
      measureCount.value = '定量检测(' + meaDataList.value.length + ')';

      judgemengItemPanel.value.getXTable().loadData(unref(judDataList));
      measurementItemPanel.value.getXTable().loadData(unref(meaDataList));
    }
  }
  // 获取检验项数据
  async function doGetTestData() {
    emit('setModalProps', { loading: true });
    getOutInspectData({
      sn: unref(sn),
      stationId: unref(workBenchData).scanInfo.stationId,
      actionCode: unref(workBenchData).actionId_dictText,
      wkpId: unref(workBenchData).workPostId,
      operateBy: getFieldsValue().operator,
    })
      .then((res) => {
        inspectData.value = res;
        emit('setModalProps', { loading: false });
      })
      .catch((err) => {
        emit('close');
      });
  }

  //检验
  async function doSaveTest(isSubmit) {
    validate();
    tableRefs.judgemengItemPanel.value.validateTable();
    tableRefs.measurementItemPanel.value.validateTable();

    const formData = getFieldsValue();

    //如果为不良的话，不良消息接收人为必填
    if (isSubmit) {
      if (formData.result == 'N' && (formData.ngUserBy == null || formData.ngUserBy == '')) {
        $message.createMessage.warning('请选择消息接收人');
        return;
      }
    }
    if (formData.isPush == 'Y' && (formData.ngUserBy == null || formData.ngUserBy == '')) {
      $message.createMessage.warning('请选择消息接收人');
      return;
    }
    //组合检验项数据
    const outInspItemList = ref<any>([]);
    let message = '';
    //循环定性数据
    for (let judItem of judgemengItemPanel.value.getTableData()) {
      let judSubItem = ref<any>([]);
      //循环值数据
      for (let i = 0; i < formData.samplingQty; i++) {
        judSubItem.value.push({
          sn: Reflect.get(judItem, 'sn' + (i + 1)),
          value: Reflect.get(judItem, 'result' + (i + 1)) == 'Y' ? 0 : 1,
        });
      }
      //添加定性数据到对象
      outInspItemList.value.push({
        stdItemId: judItem.stdItemId,
        code: judItem.code,
        description: judItem.description,
        isSuitable: judItem.isSuitable,
        unitId: judItem.unitId,
        inspTag: 'judgemengt',
        result: judItem.result,
        attachments: judItem.attachments,
        remark: judItem.remark,
        valueList: judSubItem.value,
      });

      if ('N' == judItem.result || !judItem.result) {
        message += judItem.description + '  未通过;<br/>';
      }
    }
    //循环定量数据
    for (let meaItem of measurementItemPanel.value.getTableData()) {
      let meaSubItem = ref<any>([]);
      //循环值数据
      for (let i = 0; i < formData.samplingQty; i++) {
        meaSubItem.value.push({
          sn: Reflect.get(meaItem, 'valueSn' + (i + 1)),
          value: Reflect.get(meaItem, 'value' + (i + 1)),
        });
      }
      //添加定量数据到对象
      outInspItemList.value.push({
        stdItemId: meaItem.stdItemId,
        code: meaItem.code,
        description: meaItem.description,
        minOperators: meaItem.minOperators,
        maxOperators: meaItem.maxOperators,
        limitMin: meaItem.limitMin,
        limitMax: meaItem.limitMax,
        isSuitable: meaItem.isSuitable,
        unitId: meaItem.unitId,
        inspTag: 'measurement',
        result: meaItem.result,
        attachments: meaItem.attachments,
        remark: meaItem.remark,
        valueList: meaSubItem.value,
      });

      if ('N' == meaItem.result || !meaItem.result) {
        message += meaItem.description + '  未通过;<br/>';
      }
    }

    //增加提示
    if (message != '') {
      const flg = await new Promise((resolve) => {
        createConfirm({
          iconType: 'warning',
          title: '确认保存吗？',
          content: message,
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
      if (!flg) {
        return;
      }
    }

    emit('setModalProps', { loading: true });
    //组合传值参数
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
      samplingQty: formData.samplingQty,
      ngQty: formData.ngQty,
      isPush: formData.isPush,
      ngUserBy: formData.ngUserBy,
      // 检验项数据
      outInspItemList: outInspItemList.value,
    };

    await saveOutInspect(parameters)
      .then((res) => {
        if (!!isSubmit) {
          emit('success');
        }
      })
      .catch((err) => {
        emit('setModalProps', { loading: false });
      });
  }

  function doClose() {
    emit('close');
  }
  //保存
  async function doSave() {
    try {
      emit('setModalProps', { loading: true });
      await doSaveTest(false);
    } finally {
      emit('setModalProps', { loading: false });
    }
  }
  //提交
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
