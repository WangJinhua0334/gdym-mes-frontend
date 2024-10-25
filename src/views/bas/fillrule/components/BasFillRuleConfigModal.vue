<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="编码配置详情" key="basFillRuleConfigDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basFillRuleConfigDetail"
          :loading="basFillRuleConfigDetailTable.loading"
          :columns="basFillRuleConfigDetailTable.columns"
          :dataSource="basFillRuleConfigDetailTable.dataSource"
          :editConfig="basFillRuleConfigDetailTable.editConfig"
          :height="340"
          :dragSort="true"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
          @valueChange="basFillRuleConfigDetailChange"
          ><template #mustSwitch="record">
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
  import { ref, computed, unref, reactive, watch, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { formSchema, basFillRuleConfigDetailJVxeColumns, selectSysFillRuleId } from '../BasFillRuleConfig.data';
  import { saveOrUpdate, queryBasFillRuleConfigDetail, getSysFillRule, getDefaultBySysFillRuleId } from '../BasFillRuleConfig.api';
  import { useMessage } from '/@/hooks/web/useMessage';

  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const formDisabled = ref(false);
  const refKeys = ref(['basFillRuleConfigDetail']);
  const activeKey = ref('basFillRuleConfigDetail');
  const basFillRuleConfigDetail = ref();
  const tableRefs = { basFillRuleConfigDetail };
  const basFillRuleConfigDetailTable = reactive({
    loading: false,
    columns: basFillRuleConfigDetailJVxeColumns,
    dataSource: [],
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      beforeEditMethod : ({ row, column }) => {
        console.log(column);
        console.log(row);
        if (column.property === 'fillRuleType') {
          return true;
        }

        if (row.fillRuleType === 'fixed_value' && column.property === 'fillRuleValue') {
          return true;
        }

        if (
          (row.fillRuleType === 'year' || row.fillRuleType === 'month' || row.fillRuleType === 'date' || row.fillRuleType === 'week') &&
          column.property === 'fillRuleLength'
        ) {
          return true;
        }

        if (row.fillRuleType === 'params' && column.property === 'fillRuleParam') {
          return true;
        }

        if (
          row.fillRuleType === 'serial_number' &&
          (column.property === 'fillRuleLength' ||
            column.property === 'fillRuleHex' ||
            column.property === 'fillRuleHexStr' ||
            column.property === 'fillRuleStart')
        ) {
          return true;
        }

        return false;
      },
    },
  });

  /*function cellClickEvent(vv) {
    if (vv.row.fillRuleType == 'year' || vv.row.fillRuleType == 'month' || vv.row.fillRuleType == 'date') {
      for (let c of basFillRuleConfigDetailTable.columns) {
        if (c.key == 'fillRuleType') {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
      }
    } else if (vv.row.fillRuleType == 'serial_number') {
      for (let c of basFillRuleConfigDetailTable.columns) {
        if (c.key == 'fillRuleType' || c.key == 'fillRuleLength' || c.key == 'fillRuleHex' || c.key == 'fillRuleStart') {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
      }
    } else if (vv.row.fillRuleType == 'params') {
      for (let c of basFillRuleConfigDetailTable.columns) {
        if (c.key == 'fillRuleParam' || c.key == 'fillRuleType') {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
      }
    } else {
      for (let c of basFillRuleConfigDetailTable.columns) {
        if (c.key == 'fillRuleValue' || c.key == 'fillRuleType') {
          c.disabled = false;
        } else {
          c.disabled = true;
        }
      }
    }
  }*/

  watch(
    () => selectSysFillRuleId.value,
    (newval, oldval) => {
      if (selectSysFillRuleId.value) {
        nextTick(() => {
          const haveRows = basFillRuleConfigDetail.value.getXTable().getTableData().fullData;
          for (let row of haveRows) {
            delete row.fillRuleParam;
          }
          basFillRuleConfigDetail.value.getXTable().reloadData(haveRows);
        });
        getSysFillRule({ id: selectSysFillRuleId.value }).then((res) => {
          if (res && res.ruleParams) {
            let paramOptions = [] as Array<{}>;
            for (let param in JSON.parse(res.ruleParams)) {
              paramOptions.push({
                title: param,
                value: param,
              });
            }
            for (let c of basFillRuleConfigDetailTable.columns) {
              if (c.key == 'fillRuleParam') {
                c.options = paramOptions;
              }
            }
          }
        });
      } else {
        nextTick(() => {
          const haveRows = basFillRuleConfigDetail.value.getXTable().getTableData().fullData;
          for (let row of haveRows) {
            delete row.fillRuleParam;
          }
          basFillRuleConfigDetail.value.getXTable().reloadData(haveRows);
        });
      }
    },
    { immediate: false, deep: true }
  );

  function basFillRuleConfigDetailChange(v) {
    if (v.oldValue == v.value) return;

    if (v.col.key === 'fillRuleType') {
      delete v.row.fillRuleLength;
      delete v.row.fillRuleHex;
      delete v.row.fillRuleStart;
      delete v.row.fillRuleValue;
      delete v.row.fillRuleParam;

      if (v.value === 'serial_number') {
        v.row.fillRuleLength = 5;
        v.row.fillRuleHex = 10;
        v.row.fillRuleStart = 1;
      } else if (v.value === 'year' || v.value === 'month' || v.value === 'date' || v.value === 'week') {
        v.row.fillRuleValue = v.value;

        if (v.value == 'year') v.row.fillRuleLength = 4;
        if (v.value == 'month') v.row.fillRuleLength = 2;
        if (v.value == 'date') v.row.fillRuleLength = 2;
        if (v.value == 'week') v.row.fillRuleLength = 2;
      }
    }
  }

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: false, showCancelBtn: data?.showFooter, showOkBtn: data?.showFooter, defaultFullscreen: true });
    isUpdate.value = !!data?.isUpdate;
    formDisabled.value = !data?.showFooter;
    if (unref(isUpdate)) {
      selectSysFillRuleId.value = data.record.sysFillRuleId;
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });

      requestSubTableData(queryBasFillRuleConfigDetail, { id: data?.record?.id }, basFillRuleConfigDetailTable);
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
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  // 重置
  async function reset() {
    selectSysFillRuleId.value = undefined;
    activeKey.value = 'basFillRuleConfigDetail';
    unref(basFillRuleConfigDetail).getXTable().remove();

    await resetFields();
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      basFillRuleConfigDetailList: allValues.tablesValue[0].tableData,
    };
  }

  // 保存
  async function save(values, isUpdate) {
    setModalProps({ confirmLoading: true });
    //提交表单
    await saveOrUpdate(values, isUpdate);
    //关闭弹窗
    closeModal();
    //刷新列表
    emit('success');
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      if (values.basFillRuleConfigDetailList.length < 1) {
        $message.createMessage.error('参数列表不能为空');
        return;
      }

      if (values.isDefault == 'Y') {
        let ruleConfig = await getDefaultBySysFillRuleId({ sysFillRuleId: values.sysFillRuleId });
        if (ruleConfig) {
          if (unref(isUpdate)) {
            if (values.id == ruleConfig.id) {
              save(values, isUpdate.value);
            } else {
              $message.createConfirm({
                iconType: 'warning',
                title: '确认继续',
                content: '当前系统编码业务已存在默认的版本规则，是否将其设置成非默认版本？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  save(values, isUpdate.value);
                },
              });
            }
          } else {
            $message.createConfirm({
              iconType: 'warning',
              title: '确认继续',
              content: '当前系统编码业务已存在默认的版本规则，是否将其设置成非默认版本？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                save(values, isUpdate.value);
              },
            });
          }
        } else {
          save(values, isUpdate.value);
        }
      } else {
        save(values, isUpdate.value);
      }
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
