<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @cancel="handleClose" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" @submit="handleQuery" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="物料明细" key="mesMoCompleteKitList" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="mesMoCompleteKitList"
          :loading="mesMoCompleteKitTable.loading"
          :columns="mesMoCompleteKitTable.columns"
          :dataSource="mesMoCompleteKitTable.dataSource"
          @valueChange="valueChange"
          :height="'auto'"
          :rowNumber="true"
          :rowSelection="false"
          :toolbar="false"
          :showFooter="true"
          :footerMethod="footerMethod"
          :footerCellStyle="footerStyle"
          :disabled="false"
        >
          <template #action="{ row }">
            <div>
              <a @click="handleDistributedList(row)">历史记录</a>
            </div>
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>

  <DistributedListDrawer @register="registerDrawer" />
</template>

<script lang="ts" setup>
  import { ref, unref, computed, watch, reactive, onActivated, onDeactivated } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { distrubuteSearchFormSchema, getDistrubuteJVxeColumns } from '../MesMoCompleteKit.data';
  import { queryDistributeListByMoId, distribute } from '../MesMoCompleteKit.api';
  import DistributedListDrawer from './DistributedListDrawer.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const detailJVxeColumns = computed(() => getDistrubuteJVxeColumns());

  const refKeys = ref(['mesMoCompleteKitList']);
  const activeKey = ref('mesMoCompleteKitList');
  const mesMoCompleteKitList = ref();
  const tableRefs = { mesMoCompleteKitList };
  const mesMoCompleteKitTable = reactive({
    loading: false,
    dataSource: [],
    columns: detailJVxeColumns,
  });

  const [registerDrawer, { openDrawer }] = useDrawer();

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate, updateSchema }] = useForm({
    schemas: distrubuteSearchFormSchema,
    baseColProps: { span: 8 },
    showResetButton: false,
    showSubmitButton: true,
    submitButtonOptions: { text: '查询', preIcon: 'ant-design:search-outlined' },
    autoSubmitOnEnter: true,
    actionColOptions: { span: 6 },
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    const showMoIdField = !data?.moId;

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: true });

    //表单赋值
    if (!showMoIdField) {
      await setFieldsValue({ moId: data.moId });
      handleQuery();
    }

    updateSchema({ field: 'moId', show: showMoIdField });

    // 隐藏底部时禁用整个表单
    setProps({ disabled: false });
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
  const title = computed(() => '齐套检查');

  async function reset() {
    await resetFields();
    activeKey.value = 'mesMoCompleteKitList';
    mesMoCompleteKitTable.dataSource = [];
  }

  async function handleQuery() {
    try {
      const values = getFieldsValue();
      if (!values.moId) {
        $message.createMessage.warn('请选择齐套工单！');
        mesMoCompleteKitTable.dataSource = [];
        return;
      }

      mesMoCompleteKitTable.loading = true;
      queryDistributeListByMoId({ moId: values.moId, whId: values.whId })
        .then((res) => {
          mesMoCompleteKitTable.dataSource = res;
        })
        .finally(() => {
          mesMoCompleteKitTable.loading = false;
        });
    } catch (err: any) {
      console.error(err);
      $message.createMessage.error(err.message);
    }
  }

  async function handleDistributedList(row) {
    openDrawer(true, { ...row });
  }

  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    let completeKitList = allValues.tablesValue[0].tableData.find((item) => item.distributeQty > 0);

    return {
      ...main, // 展开
      moCompleteKitList: completeKitList,
    };
  }

  //表单提交事件
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });

      if (!values.moId) {
        $message.createMessage.error('请选择齐套工单！');
        return;
      } else if (!values.whId) {
        $message.createMessage.error('请选择仓库！');
        return;
      } else if (!values.moCompleteKitList || values.moCompleteKitList.length <= 0) {
        $message.createMessage.error('请输入分配数量！');
        return;
      }

      //提交表单
      await distribute(values);

      //关闭弹窗
      closeModal();

      //刷新列表
      emit('success');
    } catch (err) {
      console.error(err);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleClose() {
    closeModal();
  }

  // 列表值变更事件
  function valueChange(args) {
    const { oldValue, value, row, column } = args;
    if (column.property != 'distributeQty') return;

    if (oldValue == value) return;

    const preparedQty = Number(row.preparedQty ?? 0);
    const unitQty = Number(row.unitQty);
    row.kitQty = Math.floor((preparedQty + Number(value)) / unitQty);
  }

  function footerMethod({ columns, data }) {
    const footerData = [
      columns.map((column) => {
        if (column.property === 'invQty') {
          return '工单齐套数：';
        } else if (column.property === 'kitQty') {
          let kitQty = -1;
          data.forEach((item) => {
            if (kitQty == -1 || item.kitQty < kitQty) {
              kitQty = item.kitQty;
            }
          });

          return kitQty;
        }

        return null;
      }),
    ];

    return footerData;
  }

  function footerStyle({ column, columnIndex }) {
    if (columnIndex == 8) {
      return {
        'text-align': 'right',
        'font-size': '14px',
        'font-weight': 'bold',
      };
    } else {
      return {
        'font-size': '14px',
        'font-weight': 'bold',
      };
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

  :deep(.ant-picker) {
    width: 100%;
  }

  :deep(.footer-style) {
    font-size: 14px;
    font-weight: bold;
  }
</style>
