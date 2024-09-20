<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @cancel="handleCancel" @ok="handleOk">
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <a-tabs v-show="showMaterialTab" v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="前加工物料" key="materialInfo" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="materialInfo"
          :loading="materialInfoTable.loading"
          :columns="materialInfoTable.columns"
          :dataSource="materialInfoTable.dataSource"
          :max-height="450"
          :disabled="false"
          :rowNumber="true"
          :sortKey="''"
          :rowSelection="false"
        >
          <!--字段回显插槽-->
          <template #resultSwitch="record">
            <a-switch
              :disabled="record.row.batchQty <= 1"
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="Y"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="N"
              v-model:checked="record.value"
              @change="record.triggerChange"
            />
          </template>
          <template #mustSwitch="record">
            <a-switch
              v-model:checkedValue="record.column.customValue[0]"
              checked-children="是"
              v-model:unCheckedValue="record.column.customValue[1]"
              un-checked-children="否"
              v-model:checked="record.value"
              disabled
              @change="record.triggerChange"
            />
          </template>
        </JVxeTable>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts';
  import { formSchema, materialJVxeColumns, moSnList, doEnterPressing } from './MesMoPlanCreateSn.data';
  import { getProductCreateSnData, listMaterialCreateSnData, createSn } from '../MesMoPlan.api';
  import { defHttp } from '/@/utils/http/axios';
  import { getToken } from '/@/utils/auth';
  import { loopPrintJimuReport } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);

  const showMaterialTab = ref(true);

  const refKeys = ref(['materialInfo']);
  const activeKey = ref('materialInfo');
  const materialInfo = ref();

  const tableRefs = { materialInfo };
  const materialInfoTable = reactive({
    loading: false,
    dataSource: [],
    columns: materialJVxeColumns,
  });

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });

  /**子表格方法配置*/
  const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(null, null, tableRefs, activeKey, refKeys);

  /**表单赋值*/
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await reset();

    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: true });

    await getProductCreateSnData({ id: data.record.id }).then(async (productRes) => {
      if (productRes.moSnList && productRes.moSnList.length > 0) {
        moSnList.value = productRes.moSnList;
      }

      await setFieldsValue({ ...productRes });
      requestSubTableData(listMaterialCreateSnData, { id: data.record.id }, materialInfoTable, (materialRes) => {
        if (materialRes.result.length <= 0) {
          showMaterialTab.value = false;

          setProps({ baseColProps: { span: 12 } });
          setModalProps({ defaultFullscreen: false });
        }

        if (!unref(showMaterialTab) && productRes.qty <= 0) {
          $message.createMessage.error('生产任务流转卡已分配完毕！');
          handleCancel();
        }
      });
    });
  });

  // 监听批次数量值改变事件
  watch(
    () => doEnterPressing.value,
    () => {
      toggleQty(doEnterPressing.value);
    },
    { immediate: false, deep: true }
  );
  /**
   * 批次数量改变时，列表数量改变事件
   */
  function toggleQty(batchNum) {
    const data = materialInfo.value.getTableData();
    //循环data
    data.forEach((item) => {
      item.batchQty = (item.qty / getFieldsValue().qty) * batchNum;
    });
    materialInfoTable.dataSource = data;
  }

  //设置标题
  const title = computed(() => '分配流转卡');

  /**提交参数构造 */
  function classifyIntoFormData(allValues) {
    let main = Object.assign({}, allValues.formValue);
    return {
      ...main, // 展开
      materialDtoList: allValues.tablesValue[0].tableData,
    };
  }

  /**表单提交事件*/
  async function requestAddOrEdit(values) {
    try {
      setModalProps({ confirmLoading: true });

      //提交表单
      await createSn(values).then((res) => {
        //关闭弹窗
        handleCancel();
        //刷新列表
        emit('success', res);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function handleOk() {
    try {
      const main = await validate();
      const parameters = { ...main, materialDtoList: [] };
      if (unref(showMaterialTab)) {
        let hasErr = false;
        await materialInfo.value.validateTable().then((errMap) => {
          if (errMap && errMap.qty.length > 0) hasErr = true;
        });

        if (hasErr) return;

        parameters.materialDtoList = materialInfo.value.getTableData();
      }

      setModalProps({ confirmLoading: true });

      //提交表单
      await createSn(parameters).then(async (res) => {
        if (!unref(res)) {
          return;
        }

        const ids = Object.keys(res);
        /**注释掉分配流转卡后的打印功能 开始 */
        // defHttp
        //   .get({
        //     url: '/template/basTemplate/getReportIdByIds',
        //     params: { ids: ids.join(','), type: 'mo_sn' },
        //   })
        //   .then(async (reportRs) => {
        //     // 打印数据集 { reportId, parameters }
        //     const printSet: any = {};

        //     const templateIds = Object.keys(reportRs);
        //     for (const templateId of templateIds) {
        //       const reportId = reportRs[templateId];
        //       printSet[reportId] = { id: `'${res[templateId].join("','")}'` };
        //     }

        //     loopPrintJimuReport(printSet, getToken, () => {
        //       //清除流转卡缓存
        //       moSnList.value = [];
        //       //设置非加载中
        //       setModalProps({ confirmLoading: false });
        //       //打印提示
        //       $message.createMessage.success('打印成功!');
        //       //关闭弹窗
        //       closeModal();
        //       //刷新列表
        //       emit('success', res);
        //     });
        //   });
        /**注释掉分配流转卡后的打印功能 结束 */
        //清除流转卡缓存
        moSnList.value = [];
        //设置非加载中
        setModalProps({ confirmLoading: false });
        //关闭弹窗
        handleCancel();
        //刷新列表
        emit('success', res);
      });
    } catch (error: any) {
      console.log(error);
      setModalProps({ confirmLoading: false });
    }
  }

  function handleCancel() {
    moSnList.value = [];
    showMaterialTab.value = true;
    closeModal();
  }

  async function reset() {
    await resetFields();
    materialInfoTable.dataSource = [];
    materialInfo?.value?.getXTable()?.updateData();
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
</style>
