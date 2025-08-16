<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:binding'" @click="handleBinding">物料条码绑定 </a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:generate'" @click="handleGenerate">物料条码生成</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:generatebymo'" @click="handleGenerateByMo">物料条码生成(按工单)</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:generatebyPick'" @click="handleGenerateByPick"
          >物料条码生成(按领料单)</a-button
        >
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:patchwork'" @click="handlePatchwork">补打</a-button>
        <a-button type="primary" v-auth="'org.jeecg.modules:mes_lwms_lot:exportXls'" @click="onExportXls"> 导出 </a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载 </a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <MesLwmsLotBindingModal @register="bindingModal" @success="handleSuccess" />
    <MesLwmsLotGenerateModal @register="generateModal" @success="handleSuccess" />
    <MesLwmsLotGenerateByMoModal @register="generateByMoModal" @success="handleSuccess" />
    <MesLwmsLotGenerateByPickModal @register="generateByPickModal" @success="handleSuccess" />
    <MesLwmsLotSplitModal @register="splitModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="lwmslot-mesLwmsLot" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MesLwmsLotBindingModal from './components/MesLwmsLotBindingModal.vue';
  import MesLwmsLotGenerateModal from './components/MesLwmsLotGenerateModal.vue';
  import MesLwmsLotGenerateByMoModal from './components/MesLwmsLotGenerateByMoModal.vue';
  import MesLwmsLotGenerateByPickModal from './components/MesLwmsLotGenerateByPickModal.vue';
  import MesLwmsLotSplitModal from './components/MesLwmsLotSplitModal.vue';
  import { columns, searchFormSchema } from './MesLwmsLot.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './MesLwmsLot.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { getAreaTextByCode } from '../../../components/Form/src/utils/Area';
  import { getToken } from '/@/utils/auth';
  import { message } from 'ant-design-vue';
  import { defHttp } from '/@/utils/http/axios';
  import { printJimuReport } from '/@/utils';

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [bindingModal, { openModal: openBindingModal }] = useModal();
  const [generateModal, { openModal: openGenerateModal }] = useModal();
  const [generateByMoModal, { openModal: openGenerateByMoModal }] = useModal();
  const [generateByPickModal, { openModal: openGenerateByPickModal }] = useModal();
  const [splitModal, { openModal: openSplitModal }] = useModal();

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '在制库条码表',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: true,
      actionColumn: {
        title: '操作',
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '在制库条码表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload, setLoading }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 绑定条码事件事件
   */
  function handleBinding() {
    openBindingModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 生成条码事件事件
   */
  function handleGenerate() {
    openGenerateModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 生成条码事件事件(按工单)
   */
  function handleGenerateByMo() {
    openGenerateByMoModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 生成条码事件事件(按工单)
   */
  function handleGenerateByPick() {
    openGenerateByPickModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 条码补打事件
   */
  function handlePatchwork() {
    if (!selectedRowKeys.value.length) {
      message.error('请先选择一条数据');
      return;
    }
    setLoading(true);
    try {
      // TODO
      defHttp.get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'lwms_lot_sn' } }).then((res) => {
        printJimuReport(res, { printAll: true, id: `${unref(selectedRowKeys.value).join(',')}` }, getToken(), false, () => {
          setLoading(false);
        });
      });
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  /**
   * 条码拆分
   */
  function handleSplit(record: Recordable) {
    openSplitModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '拆分',
        onClick: handleSplit.bind(null, record),
        auth: 'mes:lwmslot:split',
      },
    ];
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
</script>

<style scoped></style>
