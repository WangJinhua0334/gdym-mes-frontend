<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
      <template #expandedRowRender="{ record }">
        <a-tabs tabPosition="top">
          <a-tab-pane tab="设备报废项" key="eamEquipScrapItem" forceRender>
            <eamEquipScrapItemSubTable :id="expandedRowKeys[0]" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <!-- 内嵌table区域 end -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'org.jeecg.modules:eam_equip_scrap_apply:add'" @click="handleAdd" preIcon="ant-design:plus-outlined">
          新增</a-button
        >
        <a-button
          type="primary"
          v-auth="'org.jeecg.modules:eam_equip_scrap_apply:approval'"
          @click="handleApproval"
          preIcon="ant-design:plus-outlined"
        >
          审批</a-button
        >
        <a-button
          type="primary"
          v-auth="'org.jeecg.modules:eam_equip_scrap_apply:cancel_approval'"
          @click="handleCancelApproval"
          preIcon="ant-design:plus-outlined"
        >
          弃审</a-button
        >
        <a-button type="primary" v-auth="'org.jeecg.modules:eam_equip_scrap_apply:print'" @click="print" preIcon="ant-design:plus-outlined">
          报废单打印</a-button
        >
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
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
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <EamEquipScrapApplyModal @register="registerModal" @success="handleSuccess"></EamEquipScrapApplyModal>
  </div>
</template>

<script lang="ts" name="eam-EquipScrapApply" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import EamEquipScrapApplyModal from './components/EamEquipScrapApplyModal.vue';
  import EamEquipScrapItemSubTable from './subTables/EamEquipScrapItemSubTable.vue';
  import { columns, searchFormSchema } from './EamEquipScrapApply.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, approval, cancelApproval } from './EamEquipScrapApply.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { message, Modal } from 'ant-design-vue';
  import { defHttp } from '/@/utils/http/axios';
  import { printJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { ModalOptionsEx } from '/@/hooks/web/useMessage';
  import { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
  import { getIcon } from '@iconify/iconify';
  import { cancelMaintain } from '/@/views/eam/equipmaintainplan/EamEquipMaintainPlan.api';
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '设备报废申请',
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
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '设备报废申请',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 展开事件
   * */
  function handleExpand(expanded, record) {
    expandedRowKeys.value = [];
    if (expanded === true) {
      expandedRowKeys.value.push(record.id);
    }
  }
  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 审核事件
   */
  async function handleApproval() {
    createConfirm({
      iconType: 'warning',
      title: '确认审核',
      content: '是否审核选中报废申请',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return approval({ ids: selectedRowKeys.value }).then(() => {
          reload();
        });
      },
    });
  }
  /**
   * 弃审事件
   */
  async function handleCancelApproval() {
    createConfirm({
      iconType: 'warning',
      title: '确认弃审',
      content: '是否弃审选中报废申请',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return cancelApproval({ ids: selectedRowKeys.value }).then(() => {
          reload();
        });
      },
    });
  }
  /**
   * 打印
   */
  async function print() {
    if (!selectedRowKeys.value || selectedRowKeys.value?.length == 0 || selectedRowKeys.value?.length > 1) {
      message.warning('请选择一条记录打印');
      return;
    }
    defHttp
      .get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'eam_equip_scrap_print' } })
      .then((res) => {
        printJimuReport(res, { id: `${selectedRowKeys.value[0]}` }, getToken(), false, () => {
          reload();
        });
      });
  }

  /**
   * @description: Create confirmation box
   */
  function createConfirm(options: ModalOptionsEx): ReturnType<ModalFunc> {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt: ModalFuncProps = {
      centered: true,
      icon: getIcon(iconType),
      ...options,
      content: options.content,
    };
    return Modal.confirm(opt);
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    if (record.status == 'audited') {
      message.warning('无法编辑已审核通过的报废单');
      return;
    }
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    if (record.status == 'audited') {
      message.warning('无法删除已审核通过的报废单');
      return;
    }
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'org.jeecg.modules:eam_equip_scrap_apply:edit',
      },
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth: 'org.jeecg.modules:eam_equip_scrap_apply:delete',
      },
    ];
  }
</script>

<style scoped></style>
