<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <a-button
          v-if="selectedRowKeys && selectedRowKeys.length > 0"
          type="primary"
          preIcon="ant-design:printer-outlined"
          @click="handlePrint"
          :loading="loading"
          >打印</a-button
        >
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)"/>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <!-- 编辑弹窗   -->
    <CoilProdReportModal @register="registerEditModal" @success="handleSuccess" />
    <!-- 打印弹窗 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerPrintModal"
      destroyOnClose
      :title="'选择打印标签'"
      :centered="true"
      :width="600"
      @ok="handlePrintSubmit"
    >
      <BasicForm @register="registerPrintForm" style="padding: 3%" />
    </BasicModal>
  </div>
</template>

<script lang="ts" name="bi-reports-coilprodreport" setup>
  import { ActionItem, BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { coilProdReport, coilProdReportExportUrl, mesFlowCardDetailDelete } from './CoilProdReport.api';
  import { columns, formSchema, printFormSchema } from './CoilProdReport.data';
  import { BasicModal, useModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { ref, unref, onMounted, onUnmounted } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { defHttp } from '@/utils/http/axios';
  import { printJimuReport } from '@/utils';
  import { getToken } from '@/utils/auth';
  import { TableAction } from '@/components/Table';
  // @ts-ignore Vue SFC 默认导出，Vetur 可能误报 has no default export
  import CoilProdReportModal from './model/CoilProdReportModal.vue';
  import { ajaxGetDictItems } from '@/utils/dict/index';
  import { useUserStore } from '@/store/modules/user';

  const $message = useMessage();
  const loading = ref<boolean>(false);
  const userStore = useUserStore();

  // 注册编辑弹窗
  const [registerEditModal, { openModal:openEditModal }] = useModal();
  // 注册打印弹窗（保留代码结构，但当前不使用）
  const [registerPrintModal, { closeModal: closePrintModal }] = useModal();


  // 注册打印表单（保留代码结构，但当前不使用）
  const [registerPrintForm] = useForm({
    labelWidth: 100,
    schemas: printFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //注册table数据
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '各个工序的钢卷加工统计报表',
      api: coilProdReport,
      columns: columns,
      canResize: true,
      showActionColumn: true,
      formConfig: {
        schemas: formSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: false, // 不显示展开/收起按钮，所有查询输入框都显示
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      rowSelection: {
        type: 'checkbox',
      },
      actionColumn: {
        width: 160,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '各个工序的钢卷加工统计报表',
      url: coilProdReportExportUrl,
    },
  });

  const [registerTable, { getSelectRows, reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 页面加载时预加载字典数据
  onMounted(() => {
    // 预加载 operation_status 字典
    const dictItems = userStore.getAllDictItems || {};
    if (!dictItems['operation_status']) {
      ajaxGetDictItems('operation_status', {}).then((result) => {
        if (result && result.length > 0) {
          dictItems['operation_status'] = result;
          userStore.setAllDictItems(dictItems);
        }
      });
    }
    // 预加载 plant_name 字典
    if (!dictItems['plant_name']) {
      ajaxGetDictItems('plant_name', {}).then((result) => {
        if (result && result.length > 0) {
          dictItems['plant_name'] = result;
          userStore.setAllDictItems(dictItems);
        }
      });
    }

    // 监听字典加载完成事件，触发表格重新渲染
    const handleDictLoaded = () => {
      // 延迟一下再刷新，确保字典数据已更新到 store
      setTimeout(() => {
        reload();
      }, 100);
    };
    window.addEventListener('dict-loaded', handleDictLoaded);
    
    // 组件卸载时移除监听器
    onUnmounted(() => {
      window.removeEventListener('dict-loaded', handleDictLoaded);
    });
  });

  /**
   * 获取table操作列
   * @param record
   * @returns
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'mes_flow_card_detail:edit', // 通过权限指令控制显示
      },
      {
        label: '删除',
        color: 'error',
        auth: 'mes_flow_card_detail:delete',
        popConfirm: {
          title: '是否确认删除该条工序加工记录？',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  async function handleDelete(record: any) {
    if (record?.id == null || record.id === '') {
      $message.createMessage.warning('无法删除：缺少主键');
      return;
    }
    try {
      await mesFlowCardDetailDelete({ id: record.id });
      $message.createMessage.success('删除成功');
      reload();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(record: Recordable) {
    console.log('handleEdit called', record);
    try {
      openEditModal(true, {
        record,
        isUpdate: true,
        showFooter: true,
      });
      console.log('openEditModal called successfully');
    } catch (error) {
      console.error('Error opening edit modal:', error);
      $message.createMessage.error('打开编辑弹窗失败：' + (error as Error).message);
    }
  }

  function handleSuccess() {
    reload();
  }

  /** 打印弹窗确定（当前保留结构未使用，点击确定关闭弹窗） */
  function handlePrintSubmit() {
    closePrintModal();
  }

  /**
   * 打印-直接打印（使用指定模板）
   */
  async function handlePrint() {
    loading.value = true;
    try {
      if (!unref(selectedRowKeys) || unref(selectedRowKeys).length <= 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        return;
      }

      // 获取选中的行数据
      const selectedRows = getSelectRows();
      if (!selectedRows || selectedRows.length === 0) {
        $message.createMessage.warning('请选择待打印的记录!');
        return;
      }

      // 提取选中行的钢卷号
      const coilNumbers: string[] = [];
      selectedRows.forEach((row: any) => {
        // if (row.internalCoilNumber && row.internalCoilNumber !== null && row.internalCoilNumber !== '') {
        //   coilNumbers.push(row.internalCoilNumber);
        // }
        if (row.newCoilNo && row.newCoilNo !== '') {
          coilNumbers.push(row.newCoilNo);
        }
      });

      if (coilNumbers.length === 0) {
        $message.createMessage.warning('选中的记录中没有有效的钢卷号!');
        return;
      }

      // 获取报表ID
      defHttp
        .get({
          url: '/template/basTemplate/getReportIdByCode',
          params: { code: 'SystemDefaultTemplate', type: 'gx_bd' },
        })
        .then((res) => {
          printJimuReport(res, { printAll: true, id: `${coilNumbers.join(',')}` }, getToken(), false, () => {
            loading.value = false;
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
</script>

<style scoped></style>
