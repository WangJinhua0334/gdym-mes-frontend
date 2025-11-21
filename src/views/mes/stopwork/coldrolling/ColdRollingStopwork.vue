<script setup lang="ts" name="mo-ColdRollingStopwork">
  import { getFormSchema, getDetailJVxeColumns, formSchema, printFormSchema } from './ColdRollingStopwork.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { saveOrUpdate } from '@/views/mes/stopwork/coldrolling/ColdRollingStopwork.api';
  import { useMessage } from '@/hooks/web/useMessage';
  import { JVxeTable } from '@/components/jeecg/JVxeTable';
  import { computed, onMounted, reactive, ref, watch, nextTick } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import { buildUUID } from '@/utils/uuid';
  import dayjs from 'dayjs';
  import { defHttp } from '@/utils/http/axios';
  import { loopPrintJimuReport } from '@/utils';
  import { getToken } from '@/utils/auth';
  // 提示方法声明
  const $message = useMessage();
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const formDisabled = ref(false);
  // 控制是否显示钢卷号列
  const showCoilNoColumn = ref(false);
  const detailJVxeColumns = computed(() => getDetailJVxeColumns(showCoilNoColumn.value));

  const activeKey = ref('mesProductPickDetail');
  const mesProductPickDetail = ref();
  const mesProductPickDetailTable = reactive({
    loading: false,
    dataSource: [],
    columns: detailJVxeColumns,
  });
  // 保存上一次质量汇报的值
  const lastQualityReport = ref('');
  // 编辑模式标识
  const isEditMode = ref(false);
  // 当前编辑的行ID
  const editingRowId = ref('');
  // 选中的行数据
  const selectedRows = ref<any[]>([]);
  // 表格数据
  const tableData = ref<any[]>([]);
  // 控制打印按钮显示（只有请求成功后才显示）
  const showPrintButton = ref(false);
  // 控制提交按钮加载状态
  const submitLoading = ref(false);
  // 打码完工按钮禁用状态（成功后禁用）
  const submitDisabled = ref(false);

  // 计算属性：是否显示编辑按钮（表格有数据且选中了一行，且未提交成功）
  const showEditButton = computed(() => {
    return tableData.value.length > 0 && selectedRows.value.length === 1 && !submitDisabled.value;
  });

  // 计算属性：是否启用打印按钮（选中了至少一行）
  const enablePrintButton = computed(() => {
    return selectedRows.value && selectedRows.value.length > 0;
  });
  //表单配置 冷轧扫码完工表单
  const [registerForm, { validate, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: getFormSchema(),
    showActionButtonGroup: false,
    baseColProps: { span: 8 },
    disabled: false,
  });
  // 注册弹框
  const [registerModal, { openModal, closeModal }] = useModal();
  //冷轧扫码完工新增引用弹框
  const [registerExtendedFormModal, { validate: validateExtendedForm, resetFields, setFieldsValue: setExtendedFieldsValue }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    disabled: false,
  });

  //注册弹框打印
  const [registerModaldy, { setModalProps, closeModal: closeDyModal, openModal: openDyModal }] = useModal();
  //打印表单配置
  const [registerFormdy, { validate: validatePrintForm }] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  /*// 冷轧扫码完工提交事件
async function handleSubmit() {
  try {
    // 验证表单
    const values = await validate();
    // 调用提交方法
    await requestAddOrEdit(values);
  } catch (error) {
    // 处理验证错误
    console.log('表单验证失败:', error);
  }
}*/

  // 冷轧扫码完工提交事件
  async function handleSubmit() {
    // 防止重复提交
    if (submitLoading.value) {
      return;
    }

    try {
      // 验证表单（验证阶段不显示 loading）
      const mainFormValues = await validate();
      if (!mainFormValues.flowCardId) {
        $message.createMessage.warning('请先扫码钢卷号');
        return;
      }
      if (mesProductPickDetail.value.getTableData().length === 0) {
        $message.createMessage.warning('请先添加产出品');
        return;
      }
      // 获取子表数据
      let detailData: any[] = [];
      if (mesProductPickDetail.value) {
        detailData = mesProductPickDetail.value.getTableData();
      }
      // 判断产出品总重 和领料重量是否一致，如果不相等，则抛出异常
      // 获取子表中钢卷号的 weight之和（转换为数值类型）
      const totalWeight = detailData.reduce((acc, cur: any) => {
        // 将字符串转换为浮点数进行累加
        return acc + parseFloat(cur.weight || '0');
      }, 0);

      // 将主表重量也转换为数值类型进行比较
      const mainWeight = parseFloat(mainFormValues.weight || '0');

      // 使用适当的精度比较浮点数
      if (Math.abs(totalWeight - mainWeight) > 0.001) {
        $message.createMessage.warning('产出品总重和领料重量不一致，请检查！');
        return;
      }

      // 验证通过后，开始提交请求，此时显示 loading
      submitLoading.value = true;

      // 组装完整数据 - 将主表数据和子表数据平级合并
      const submitData = {
        ...mainFormValues,
        productInfoList: detailData,
      };
      // 调用提交方法
      const success = await requestAddOrEdit(submitData);
      // 只有请求成功后才显示打印按钮
      if (success) {
        // 提交成功后，禁用"打码完工"按钮
        submitDisabled.value = true;
        showPrintButton.value = true;
        // 清空选中行，确保打印按钮默认禁用（需要重新选中行才能打印）
        selectedRows.value = [];
        // 清空表格选中状态
        if (mesProductPickDetail.value && typeof mesProductPickDetail.value.clearSelection === 'function') {
          mesProductPickDetail.value.clearSelection();
        }
        // $message.createMessage.success('提交成功');
      } else {
        // 提交失败时，确保按钮可以再次点击
        submitDisabled.value = false;
        // $message.createMessage.error('提交失败，请重试');
      }
    } catch (error) {
      // 处理验证错误
      console.log('表单验证失败:', error);
      // 请求失败时不显示打印按钮
      showPrintButton.value = false;
      // 确保按钮可以再次点击
      submitDisabled.value = false;
      $message.createMessage.error('提交失败，请检查数据');
    } finally {
      // 无论成功或失败，都要重置加载状态
      submitLoading.value = false;
    }
  }
  /**表单提交事件*/
  async function requestAddOrEdit(values) {
    try {
      //提交表单
      await saveOrUpdate(values);
      //刷新列表
      emit('success');
      // 添加完工成功提示
      $message.createMessage.success('完工成功');
      // 返回成功标识
      return true;
    } catch (error) {
      console.log(error);
      // 返回失败标识
      return false;
    }
  }

  //新增按钮点击事件
  function handleAddDetail() {
    // 获取表单数据中的钢卷号
    const formData = getFieldsValue();
    const flowCardId = formData.flowCardId || '';
    if (!formData.oldCoilNo) {
      $message.createMessage.warning('请先输入钢卷号');
      return;
    }
    // 将 coilNo根据 - 只划分一次子串，只保留后面这段
    const str = formData.oldCoilNo;
    const coilNo = str.substring(3);
    // const oldMaterialId = formData.materialId;
    // 获取当前子表的数据源长度作为序号（确保每次都获取最新的数据长度）
    const currentDataSource = mesProductPickDetail.value ? mesProductPickDetail.value.getTableData() : mesProductPickDetailTable.dataSource;
    const currentIndex = Array.isArray(currentDataSource) ? currentDataSource.length + 1 : 1;
    // 拼接新的钢卷号
    const newCoilNo = currentIndex > 9 ? `20-${coilNo}-${currentIndex}` : `20-${coilNo}-0${currentIndex}`;

    // 设置为新增模式
    isEditMode.value = false;
    editingRowId.value = '';

    // 先打开弹框
    openModal(true, {});
    // 延迟设置值，确保弹框已打开并且表单已初始化
    setTimeout(() => {
      setExtendedFieldsValue({
        newCoilNo: newCoilNo,
        flowCardId: flowCardId,
        weight: formData.weight || '', // 设置重量默认值为表单中的重量
        destination: '1', // 设置流转去向默认值为入库
        qualityReport: lastQualityReport.value, // 恢复上一次的质量汇报值
      });
    }, 100);
  }

  //编辑按钮点击事件
  function handleEditDetail() {
    if (!mesProductPickDetail.value) {
      $message.createMessage.warning('表格未初始化');
      return;
    }

    // 优先使用已保存的选中行数据
    let currentSelectedRows = selectedRows.value;

    // 如果保存的选中行为空，尝试从表格获取
    if (!currentSelectedRows || currentSelectedRows.length === 0) {
      try {
        // 尝试使用 getSelectionData 方法
        if (typeof mesProductPickDetail.value.getSelectionData === 'function') {
          currentSelectedRows = mesProductPickDetail.value.getSelectionData();
        } else if (typeof mesProductPickDetail.value.getSelectRows === 'function') {
          currentSelectedRows = mesProductPickDetail.value.getSelectRows();
        }
      } catch (e) {
        console.error('获取选中行失败:', e);
      }
    }

    if (!currentSelectedRows || currentSelectedRows.length === 0) {
      $message.createMessage.warning('请先选择要编辑的行');
      return;
    }
    if (currentSelectedRows.length > 1) {
      $message.createMessage.warning('只能选择一行进行编辑');
      return;
    }

    const selectedRow = currentSelectedRows[0];
    if (!selectedRow || !selectedRow.id) {
      $message.createMessage.warning('选中的行数据无效');
      return;
    }

    // 设置为编辑模式
    isEditMode.value = true;
    editingRowId.value = selectedRow.id;

    // 先重置表单，确保表单是干净的状态
    resetFields();

    // 打开弹框
    openModal(true, {});

    // 延迟填充数据，确保弹框和表单都已完全初始化
    setTimeout(() => {
      try {
        setExtendedFieldsValue({
          newCoilNo: selectedRow.newCoilNo || '',
          weight: selectedRow.weight || '',
          newMaterialId: selectedRow.newMaterialId || '',
          newMaterialNumber: selectedRow.newMaterialNumber || '',
          newMaterialName: selectedRow.newMaterialName || '',
          newModelNumber: selectedRow.newModelNumber || '',
          destination: selectedRow.destination || '',
          qualityReport: selectedRow.qualityReport || '',
        });
      } catch (e) {
        console.error('填充编辑数据失败:', e);
        $message.createMessage.error('填充编辑数据失败，请重试');
      }
    }, 200);
  }

  // 监听表格选中行变化
  function handleSelectRowChange(event: any) {
    // 确保正确获取选中行数据
    if (event && event.selectedRows) {
      selectedRows.value = event.selectedRows;
    } else if (event && Array.isArray(event)) {
      // 如果 event 本身就是数组
      selectedRows.value = event;
    } else {
      selectedRows.value = [];
    }
  }

  // 更新表格数据
  function updateTableData() {
    if (mesProductPickDetail.value) {
      try {
        const data = mesProductPickDetail.value.getTableData();
        if (data && Array.isArray(data)) {
          tableData.value = data;
        }
      } catch (e) {
        // 如果获取失败，使用 dataSource
        tableData.value = mesProductPickDetailTable.dataSource || [];
      }
    } else {
      tableData.value = mesProductPickDetailTable.dataSource || [];
    }
  }

  // 监听表格数据源变化
  watch(
    () => mesProductPickDetailTable.dataSource,
    () => {
      updateTableData();
    },
    { deep: true, immediate: true }
  );

  //子表单弹框确定按钮点击事件
  async function handleModalOk() {
    try {
      const values = await validateExtendedForm();
      // 验证必填字段
      if (!values.weight) {
        $message.createMessage.warning('请填写重量');
        return;
      }
      if (!values.destination) {
        $message.createMessage.warning('请选择流转去向');
        return;
      }
      // 获取字典标签（如果需要显示中文）
      let destinationLabel = values.destination;

      if (isEditMode.value) {
        // 编辑模式：更新现有行
        if (mesProductPickDetail.value && editingRowId.value) {
          // 使用 setValues 方法更新行数据
          mesProductPickDetail.value.setValues([
            {
              rowKey: editingRowId.value,
              values: {
                newCoilNo: values.newCoilNo || '',
                weight: values.weight || '',
                newMaterialId: values.newMaterialId || '',
                newMaterialNumber: values.newMaterialNumber || '',
                newMaterialName: values.newMaterialName || '',
                newModelNumber: values.newModelNumber || '',
                destination: destinationLabel || values.destination || '',
                qualityReport: values.qualityReport || '',
              },
            },
          ]);
          $message.createMessage.success('修改成功');
        }
      } else {
        // 新增模式：添加新行
        const rowData = {
          id: buildUUID(),
          newCoilNo: values.newCoilNo || '', // 钢卷号
          weight: values.weight || '', // 重量
          newMaterialId: values.newMaterialId || '', //物料id
          newMaterialNumber: values.newMaterialNumber || '', //物料编码
          newMaterialName: values.newMaterialName || '', // 物料名称
          newModelNumber: values.newModelNumber || '', // 规格型号
          destination: destinationLabel || values.destination || '', // 流转去向
          qualityReport: values.qualityReport || '', // 质检报告
        };
        // 添加到表格
        mesProductPickDetail.value.addRows([rowData]);
      }

      // 保存质量汇报的值，以便下次使用
      if (values.qualityReport) {
        lastQualityReport.value = values.qualityReport;
      }

      // 更新表格数据
      setTimeout(() => {
        updateTableData();
      }, 100);

      // 关闭弹窗并重置表单
      closeModal();
      resetFields();
      // 重置编辑模式
      isEditMode.value = false;
      editingRowId.value = '';
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  }
  // 弹框取消事件处理
  function handleModalCancel() {
    // 重置表单数据
    resetFields();
    // 重置编辑模式
    isEditMode.value = false;
    editingRowId.value = '';
    // 关闭弹窗
    closeModal();
  }
  onMounted(() => {
    // 延迟一点时间确保表单完全初始化
    setTimeout(() => {
      setFieldsValue({
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    }, 100);
  });

  /**
   * 新增打印提交
   */
  async function handleSubmitdy() {
    // 立即设置加载状态，让按钮显示加载图标
    await nextTick();
    setModalProps({ confirmLoading: true });

    try {
      // 验证表单
      const values = await validatePrintForm();

      // 验证打印模板是否选择
      if (!values.templateId) {
        $message.createMessage.warning('请选择打印模板!');
        setModalProps({ confirmLoading: false });
        return;
      }

      // 获取选中的行数据
      if (!mesProductPickDetail.value) {
        $message.createMessage.warning('表格未初始化!');
        setModalProps({ confirmLoading: false });
        return;
      }

      // 优先使用已保存的选中行数据
      let currentSelectedRows = selectedRows.value;

      // 如果保存的选中行为空，尝试从表格获取
      if (!currentSelectedRows || currentSelectedRows.length === 0) {
        try {
          // 尝试使用 getSelectionData 方法（JVxeTable 的标准方法）
          if (typeof mesProductPickDetail.value.getSelectionData === 'function') {
            currentSelectedRows = mesProductPickDetail.value.getSelectionData();
          } else if (typeof mesProductPickDetail.value.getSelectRows === 'function') {
            currentSelectedRows = mesProductPickDetail.value.getSelectRows();
          }
        } catch (e) {
          console.error('获取选中行失败:', e);
        }
      }

      if (!currentSelectedRows || currentSelectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        setModalProps({ confirmLoading: false });
        return;
      }

      // 检查是否选中了行
      if (!currentSelectedRows || currentSelectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        setModalProps({ confirmLoading: false });
        return;
      }

      // 获取主表单的 oldCoilNo（旧钢卷号）作为打印参数
      const mainFormValues = getFieldsValue();
      if (!mainFormValues.oldCoilNo || mainFormValues.oldCoilNo === null || mainFormValues.oldCoilNo === '') {
        $message.createMessage.warning('主表单中缺少旧钢卷号，无法打印!');
        setModalProps({ confirmLoading: false });
        return;
      }

      const oldCoilNo = mainFormValues.oldCoilNo;

      // 获取报表ID
      const reportRs = await defHttp.get({
        url: '/template/basTemplate/getReportIdByIds',
        params: { ids: values.templateId, type: 'gx_sn' },
      });

      console.log('获取报表ID成功:', reportRs);
      console.log('打印参数 - 旧钢卷号:', oldCoilNo);

      // 检查报表ID是否为空
      if (!reportRs || Object.keys(reportRs).length === 0) {
        $message.createMessage.error('获取报表ID失败，请检查打印模板配置!');
        setModalProps({ confirmLoading: false });
        return;
      }

      // 打印数据集 { reportId, parameters }，使用旧钢卷号作为参数
      const printSet: any = {};

      const templateIds = Object.keys(reportRs);
      for (const templateId of templateIds) {
        const reportId = reportRs[templateId];
        printSet[reportId] = { id: oldCoilNo };
      }

      console.log('打印数据集:', printSet);

      // 调用打印功能，等待打印完成
      await loopPrintJimuReport(printSet, getToken, () => {
        // 打印完成后的回调
        setModalProps({ confirmLoading: false });
        closeDyModal();
        $message.createMessage.success('打印成功!');
      });
    } catch (error: any) {
      // 重置加载状态
      setModalProps({ confirmLoading: false });

      // 根据错误类型显示不同的提示
      if (error?.errorFields || error?.errorInfo) {
        // 表单验证失败，validate 内部会处理错误提示，不需要额外处理
      } else if (error?.message) {
        $message.createMessage.error(error.message || '操作失败，请重试!');
      } else {
        // 其他错误（如网络错误）
        console.error('打印流程出错:', error);
        $message.createMessage.error('操作失败，请重试!');
      }
    }
  }

  /**
   * 打印-直接打印（跳过模板选择）
   */
  function handlePrint() {
    try {
      // 设置加载状态（虽然没有弹窗，但为了防止重复点击，可以使用 submitLoading 或其他 loading）
      // 这里暂时不需要额外的 loading 变量，因为 loopPrintJimuReport 会处理打印

      // 获取选中的行数据
      if (!mesProductPickDetail.value) {
        $message.createMessage.warning('表格未初始化!');
        return;
      }

      // 优先尝试从表格获取选中行
      let currentSelectedRows: any[] | null = null;
      try {
        if (typeof mesProductPickDetail.value.getSelectRows === 'function') {
          currentSelectedRows = mesProductPickDetail.value.getSelectRows();
        } else if (typeof mesProductPickDetail.value.getSelectionData === 'function') {
          currentSelectedRows = mesProductPickDetail.value.getSelectionData();
        }
      } catch (e) {
        console.error('获取选中行失败:', e);
      }

      // 如果表格中没有选中行，使用已保存的选中行数据
      if (!currentSelectedRows || currentSelectedRows.length === 0) {
        currentSelectedRows = selectedRows.value;
      }

      // 检查是否选中了行
      if (!currentSelectedRows || currentSelectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        return;
      }

      // 获取主表单的 oldCoilNo（旧钢卷号）作为打印参数
      const mainFormValues = getFieldsValue();
      if (!mainFormValues.oldCoilNo || mainFormValues.oldCoilNo === null || mainFormValues.oldCoilNo === '') {
        $message.createMessage.warning('主表单中缺少旧钢卷号，无法打印!');
        return;
      }

      const oldCoilNo = mainFormValues.oldCoilNo;
      const templateId = '1986615937373085698'; // 固定模板 ID

      // 获取报表ID
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByIds',
          params: { ids: templateId, type: 'gx_sn' },
        })
        .then(async (reportRs) => {
          console.log('获取报表ID成功:', reportRs);
          console.log('打印参数 - 旧钢卷号:', oldCoilNo);

          // 检查报表ID是否为空
          if (!reportRs || Object.keys(reportRs).length === 0) {
            $message.createMessage.error('获取报表ID失败，请检查打印模板配置!');
            return;
          }

          // 打印数据集 { reportId, parameters }，使用旧钢卷号作为参数
          const printSet: any = {};

          const templateIds = Object.keys(reportRs);
          for (const templateId of templateIds) {
            const reportId = reportRs[templateId];
            printSet[reportId] = { id: oldCoilNo };
          }

          console.log('打印数据集:', printSet);

          // 调用打印功能，会显示浏览器打印对话框
          loopPrintJimuReport(printSet, getToken, () => {
            $message.createMessage.success('打印成功!');
          });
        })
        .catch((error) => {
          console.error('获取报表ID失败:', error);
          $message.createMessage.error('获取报表ID失败，请重试!');
        });
    } catch (error) {
      console.log(error);
    }
  }
  function clearTableDate() {
    setFieldsValue({
      flowCardId: undefined,
      oldCoilNo: undefined,
      materialId: undefined,
      materialNumber: undefined,
      materialName: undefined,
      modelNumber: undefined,
      // exceptedWeight: undefined,
      weight: undefined,
      // limitedProportion: undefined,
      // rangeValue: 3,
      equipmentId: undefined,
      equipmentNumber: undefined,
      qualityReport: undefined,
      // operatorNumber: undefined,
      // tenantId: undefined,
      endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 或者设置为 undefined
    });
    resetFields();
    setFieldsValue({
      startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    // 清空子表数据源
    mesProductPickDetailTable.dataSource = [];

    // 如果有子表实例，也可以调用其清空方法
    if (mesProductPickDetail.value) {
      mesProductPickDetail.value.reload([]);
    }

    // 清空选中行
    selectedRows.value = [];
    // 显式清空本地表格数据缓存与选择状态
    tableData.value = [];
    try {
      if (mesProductPickDetail.value && typeof mesProductPickDetail.value.clearSelection === 'function') {
        mesProductPickDetail.value.clearSelection();
      }
    } catch (e) {}
    // 更新表格数据
    updateTableData();
    // 清空数据时，隐藏打印按钮
    showPrintButton.value = false;
    // 重置"打码完工"按钮的禁用状态，允许再次提交
    submitDisabled.value = false;
    // 确保提交加载状态复位
    submitLoading.value = false;
    // 确保表单未被禁用
    formDisabled.value = false;
    // 隐藏钢卷号列
    showCoilNoColumn.value = false;
  }
</script>
<template>
  <div class="custom-form-wrapper">
    <BasicForm @register="registerForm" :width="896" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane tab="产出品明细" key="mesProductPickDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          round="true"
          ref="mesProductPickDetail"
          :loading="mesProductPickDetailTable.loading"
          :columns="detailJVxeColumns"
          :dataSource="mesProductPickDetailTable.dataSource"
          :height="250"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="!formDisabled"
          :toolbar="!formDisabled && !submitDisabled"
          :toolbar-config="{ slot: ['prefix', 'suffix'], btn: submitDisabled ? [] : ['remove', 'clearSelection'] }"
          @select-row-change="handleSelectRowChange"
        >
          <template #toolbarPrefix>
            <a-button type="primary" @click="handleAddDetail" preIcon="ant-design:plus-outlined"> 新增</a-button>
            <a-button v-if="showEditButton" type="primary" @click="handleEditDetail" preIcon="ant-design:edit-outlined" style="margin-left: 8px">
              编辑</a-button
            >
          </template>
        </JVxeTable>
        <!-- 将按钮放在表格容器内右下角 -->
        <div class="button-wrapper">
          <div class="button-group">
            <a-button v-if="false" type="primary" @click="clearTableDate" class="clear-button">清空数据</a-button>
            <a-button v-if="showPrintButton" type="primary" preIcon="ant-design:printer-outlined" :disabled="!enablePrintButton" @click="handlePrint"
              >打印</a-button
            >
            <a-button
              @click="handleSubmit"
              type="primary"
              class="submit-button"
              :loading="submitLoading"
              :disabled="submitDisabled || submitLoading"
              style="background-color: red"
              >打码完工</a-button
            >
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!--新增/编辑选择产品弹框-->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :title="isEditMode ? '编辑产出品明细' : '添加产出品明细'"
      :width="800"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <BasicForm @register="registerExtendedFormModal" ref="extendedFormRef" />
    </BasicModal>
  </div>
  <BasicModal v-bind="$attrs" @register="registerModaldy" destroyOnClose :title="'选择打印标签'" :centered="true" :width="600" @ok="handleSubmitdy">
    <BasicForm @register="registerFormdy" style="padding: 3%" />
  </BasicModal>
</template>

<style scoped>
  .custom-form-wrapper {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    height: calc(100vh - 40px); /* 使用固定高度而不是 min-height */
    box-sizing: border-box;
    overflow: hidden; /* 隐藏溢出内容 */
  }

  /* 修改样式部分 */
  .button-wrapper {
    position: absolute;
    bottom: -40px;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .button-group {
    display: flex;
    gap: 20px; /* 设置按钮间距离 */
  }

  .submit-button {
    margin-left: 0; /* 覆盖可能存在的默认左边距 */
  }

  /* 清空数据按钮文字居中 - Ant Design Vue 按钮默认居中，这里确保样式正确 */
  .clear-button {
    text-align: center;
  }
</style>
