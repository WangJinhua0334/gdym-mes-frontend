<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" v-auth="'org.jeecg.modules:eam_equip_spot_check_plan:add'" preIcon="ant-design:plus-outlined">
          添加点检计划
        </a-button>
        <a-button
          type="primary"
          @click="handleSpotCheck"
          v-auth="'org.jeecg.modules:eam_equip_spot_check_plan:spot_check'"
          preIcon="ant-design:plus-outlined"
        >
          点检
        </a-button>
        <a-button
          type="primary"
          @click="handleCancelSpotCheck"
          v-auth="'org.jeecg.modules:eam_equip_spot_check_plan:spot_check'"
          preIcon="ant-design:plus-outlined"
        >
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
    <EamEquipSpotCheckPlanModal @register="registerModal" @success="handleSuccess"></EamEquipSpotCheckPlanModal>
    <EamEquipSpotCheckModal @register="registerSpotCheckModal" @success="handleSuccess"></EamEquipSpotCheckModal>
  </div>
</template>

<script lang="ts" name="eam-EquipSpotCheckPlan" setup>
  import { ref, computed, unref, h } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import EamEquipSpotCheckPlanModal from './components/EamEquipSpotCheckPlanModal.vue';
  import { columns, searchFormSchema } from './EamEquipSpotCheckPlan.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, cancelSpotCheck } from './EamEquipSpotCheckPlan.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { getAreaTextByCode } from '../../../components/Form/src/utils/Area';
  import EamEquipSpotCheckModal from '/@/views/eam/equipspotcheckplan/components/EamEquipSpotCheckModal.vue';
  import { message, Modal } from 'ant-design-vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { defHttp } from '/@/utils/http/axios';
  import { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
  import { ModalOptionsEx } from '/@/hooks/web/useMessage';
  import { getIcon } from '@iconify/iconify';

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerSpotCheckModal, { openModal: openSpotCheckModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      title: '设备点检计划',
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
  });

  const [registerTable, { reload, getSelectRows }, { rowSelection, selectedRowKeys }] = tableContext;

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
   * 点检事件
   */
  function handleSpotCheck() {
    if (selectedRowKeys.value?.length !== 1) {
      message.warning('请选择一条记录');
      return;
    }
    const selectRows = getSelectRows();
    const record = selectRows[0];
    if (record.status != 'wait_spot_check') {
      message.error('当前状态非待点检状态');
      return;
    }
    record.acOperateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    record.acOperateBy = useUserStoreWithOut().getUserInfo?.username;
    openSpotCheckModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    if (record.status != 'wait_spot_check') {
      message.error('当前状态非待点检状态');
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
      isDetail: true,
      showFooter: false,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    if (record.status != 'wait_spot_check' && record.status != 'cancelled') {
      message.error('当前状态无法删除');
      return;
    }
    await deleteOne({ id: record.id }, handleSuccess);
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
        auth: 'org.jeecg.modules:eam_equip_spot_check_plan:edit',
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否确认取消',
          confirm: handleCancel.bind(null, record),
        },
        auth: 'org.jeecg.modules:eam_equip_spot_check_plan:cancel_spot_check',
      },
    ];
  }

  function handleCancel(record) {
    cancelSpotCheck({ ids: [record.id] }).then(() => {
      handleSuccess();
    });
  }

  function handleCancelSpotCheck() {
    createConfirm({
      iconType: 'warning',
      title: '确认取消',
      content: '是否取消选中点检计划',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return cancelSpotCheck({ ids: selectedRowKeys.value }).then(() => {
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
      icon: getIcon(iconType),
      ...options,
      content: options.content,
    };
    return Modal.confirm(opt);
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
        auth: 'org.jeecg.modules:eam_equip_spot_check_plan:delete',
      },
    ];
  }
</script>

<style scoped></style>
