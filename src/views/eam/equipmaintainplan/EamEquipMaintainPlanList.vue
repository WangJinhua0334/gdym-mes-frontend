<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" v-auth="'org.jeecg.modules:eam_equip_maintain_plan:add'" preIcon="ant-design:plus-outlined">
          添加保养计划
        </a-button>
        <a-button
          type="primary"
          @click="handleMaintain"
          v-auth="'org.jeecg.modules:eam_equip_maintain_plan:maintain'"
          preIcon="ant-design:plus-outlined"
        >
          保养
        </a-button>
        <a-button type="primary" @click="handleCancel" v-auth="'org.jeecg.modules:eam_equip_maintain_plan:cancel'" preIcon="ant-design:plus-outlined">
          取消
        </a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <EamEquipMaintainPlanModal @register="registerModal" @success="handleSuccess"></EamEquipMaintainPlanModal>
    <EamEquipMaintainModal @register="registerMaintainModal" @success="handleSuccess"></EamEquipMaintainModal>
  </div>
</template>

<script lang="ts" name="eam-EquipMaintainPlan" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import EamEquipMaintainPlanModal from './components/EamEquipMaintainPlanModal.vue';
  import { columns, searchFormSchema } from './EamEquipMaintainPlan.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, cancelMaintain } from './EamEquipMaintainPlan.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { message, Modal } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { cancelSpotCheck } from '/@/views/eam/equipspotcheckplan/EamEquipSpotCheckPlan.api';
  import { ModalOptionsEx } from '/@/hooks/web/useMessage';
  import { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
  import { getIcon } from '@iconify/iconify';
  import EamEquipMaintainModal from '/@/views/eam/equipmaintainplan/components/EamEquipMaintainModal.vue';
  // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerMaintainModal, { openModal: openMaintainModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '设备保养计划',
      api: list,
      columns,
      canResize: false,
      rowSelection: { type: 'radio' },
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 155,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '设备保养计划',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload, getSelectRows }, { rowSelection, selectedRowKeys }] = tableContext;

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
   * 保养事件
   */
  function handleMaintain() {
    if (selectedRowKeys.value?.length !== 1) {
      message.warning('请选择一条记录');
      return;
    }
    const selectRows = getSelectRows();
    const record = selectRows[0];
    if (record.status != 'wait_maintain') {
      message.error('当前状态非待保养状态');
      return;
    }
    record.acOperateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    record.acOperateBy = useUserStoreWithOut().getUserInfo?.username;
    openMaintainModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  function handleCancel() {
    createConfirm({
      iconType: 'warning',
      title: '确认取消',
      content: '是否取消选中点检计划',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return cancelMaintain({ ids: selectedRowKeys.value }).then(() => {
          handleSuccess();
        });
      },
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
      // @ts-ignore
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
    if (record.status != 'wait_maintain') {
      message.error('当前状态非待保养状态');
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
    openMaintainModal(true, {
      record,
      isDetail: true,
      showFooter: false,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
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
        auth: 'org.jeecg.modules:eam_equip_maintain_plan:edit',
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否确认取消',
          confirm: handleCancel.bind(null, record),
        },
        auth: 'org.jeecg.modules:eam_equip_maintain_plan:cancel',
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
        auth: 'org.jeecg.modules:eam_equip_maintain_plan:delete',
      },
    ];
  }
</script>

<style scoped></style>
