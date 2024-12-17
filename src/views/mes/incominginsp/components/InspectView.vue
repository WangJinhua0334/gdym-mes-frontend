<template>
  <BasicModal v-bind="$attrs" @register="registerViewModal" destroyOnClose :title="'详情'">
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
            :scroll-x="true"
          >
            <!--字段回显插槽-->
            <template #resultSwitch="record">
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
            :scroll-x="true"
          >
            <!--字段回显插槽-->
            <template #resultSwitch="record">
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
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, watch, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { formSchema, judTableColums, meaTableColums } from './InspectView.data';
  import { getInspectData } from './InspectView.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { JVxeColumn, JVxeTypes } from '/@/components/jeecg/JVxeTable/src/types';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { object } from 'vue-types';

  // Emits声明
  const $message = useMessage();

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, getFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: formSchema,
    labelWidth: 150,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ canFullscreen: true, defaultFullscreen: true, showCancelBtn: true, showOkBtn: false });
    await doGetTestData(data.record);
  });
  let judgeCount = ref('定性检测(0)');
  let measureCount = ref('定量检测(0)');
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
          disabled: true,
          type: JVxeTypes.slot,
          align: 'center',
          slotName: 'resultSwitch',
          width: 120,
        },
        {
          title: 'V' + (i + 1) + 'SN',
          key: 'sn' + (i + 1),
          align: 'center',
          disabled: true,
          type: JVxeTypes.input,
          width: 120,
        }
      );
      //动态生成列，添加结果--定量
      newMeaTableColums.value.push(
        {
          title: '值',
          key: 'value' + (i + 1),
          type: JVxeTypes.inputNumber,
          align: 'center',
          disabled: true,
          width: 100,
        },
        {
          title: 'SN',
          key: 'valueSn' + (i + 1),
          align: 'center',
          disabled: true,
          type: JVxeTypes.input,
          width: 100,
        }
      );
    }
    //在最后面添加备注和附件列--定性
    newJudTableColums.value.push({
      title: '备注',
      key: 'remark',
      disabled: true,
      type: JVxeTypes.textarea,
    });
    newJudTableColums.value.push({
      title: '附件',
      key: 'attachments',
      disabled: true,
      type: JVxeTypes.file,
    });
    newMeaTableColums.value.push({
      title: '附件',
      key: 'attachments',
      disabled: true,
      type: JVxeTypes.file,
    });
    //在最后面添加备注和附件列--定量
    newMeaTableColums.value.push({
      title: '备注',
      key: 'remark',
      disabled: true,
      type: JVxeTypes.textarea,
      placeholder: '请输入${title}',
    });
    judgemengItemPanel.value.getXTable().reloadColumn(newJudTableColums);
    measurementItemPanel.value.getXTable().reloadColumn(newMeaTableColums);
  }
  //方法配置
  const [handleChangeTabs] = useJvxeMethod(null, null, tableRefs, activeKey, refKeys);
  //监听检验数据改变
  watch(
    () => unref(inspectData),
    () => {
      if (unref(inspectData)) {
        const data = unref(inspectData);

        setFieldsValue({ prodId_dictText: data.prodId_dictText });
        setFieldsValue({ receiveCode: data.receiveCode });
        setFieldsValue({ purchaseCode: data.purchaseCode });
        setFieldsValue({ prodName: data.prodName });
        setFieldsValue({ supplierId_dictText: data.supplierId_dictText });
        setFieldsValue({ qty: data.qty });
        setFieldsValue({ result: data.result });
        setFieldsValue({ defectIds: data.defectIds_dictText });
        setFieldsValue({ remark: data.remark });
        setFieldsValue({ attachments: data.attachments });
        setFieldsValue({ samplingQty: data.samplingQty ? data.samplingQty : 1 });

        //创建生成列
        createColumn(data.samplingQty ? data.samplingQty : 1);
        //解析数据进行赋值
        analysisData(data.inspItemList);
      }
    },
    { immediate: false, deep: true }
  );
  //解析检验项数据，赋值
  function analysisData(lotInspItem) {
    let judDataList = ref<any>([]);
    let meaDataList = ref<any>([]);
    if (lotInspItem && lotInspItem.length > 0) {
      for (let item of lotInspItem) {
        //添加定性
        if (item.inspTag == 'judgemengt') {
          const addRowJud = {
            id: item.id,
            stdItemId: item.stdItemId,
            code: item.code,
            description: item.description,
            attachments: item.attachments,
            remark: item.remark,
            isSuitable: item.isSuitable,
            inspTool: item.inspTool,
            inspBasis: item.inspBasis,
            techRequirements: item.techRequirements,
          };
          //添加值
          if (unref(item.inspValueList) && unref(item.inspValueList).length > 0) {
            for (let i = 0; i < unref(item.inspValueList).length; i++) {
              let key1 = 'result' + (i + 1);
              let key2 = 'sn' + (i + 1);
              Reflect.set(addRowJud, key1, unref(item.inspValueList)[i].value > 0 ? 'N' : 'Y');
              Reflect.set(addRowJud, key2, unref(item.inspValueList)[i].sn);
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
            unitId: item.unitId,
          };
          //添加值
          if (unref(item.inspValueList) && unref(item.inspValueList).length > 0) {
            for (let i = 0; i < unref(item.inspValueList).length; i++) {
              let key1 = 'value' + (i + 1);
              let key2 = 'valueSn' + (i + 1);
              Reflect.set(addRowMea, key1, unref(item.inspValueList)[i].value);
              Reflect.set(addRowMea, key2, unref(item.inspValueList)[i].sn);
            }
          }
          meaDataList.value.push(addRowMea);
        }
      }
    }
    judgeCount.value = '定性检测(' + judDataList.value.length + ')';
    measureCount.value = '定量检测(' + meaDataList.value.length + ')';
    judgemengItemPanel.value.getXTable().reloadData(unref(judDataList));
    measurementItemPanel.value.getXTable().reloadData(unref(meaDataList));
  }
  // 获取检验项数据
  async function doGetTestData(data) {
    setModalProps({ loading: true });
    getInspectData({
      inspectId: data.id,
    })
      .then((res) => {
        inspectData.value = res;
        setModalProps({ loading: false });
      })
      .catch((err) => {
        closeModal();
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
