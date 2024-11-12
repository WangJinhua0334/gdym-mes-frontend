<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </div>
  <!-- 表单区域 -->
  <PisProjectPromotionModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" name="project-pisProject" setup>
  import { ActionItem, BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { effectColumns, searchFormSchema } from './PisProject.data';
  import { list } from './PisProject.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useModal } from '/@/components/Modal';
  import PisProjectPromotionModal from './components/PisProjectPromotionModal.vue';

  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: list,
      columns: effectColumns,
      canResize: true,
      formConfig: {
        schemas: searchFormSchema,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        title: '操作',
        width: 150,
        fixed: 'right',
      },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 效果确认完成
   */
  function handlePromotion(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    const arr: ActionItem[] = [];
    if ((record.promotionDesc == null || record.promotionDesc == '') && (record.status == 'succeed' || record.status == 'fail')) {
      arr.push({
        label: '推广确认',
        onClick: handlePromotion.bind(null, record),
        auth: 'pis:pis_project:editPromotion',
      });
    }
    return arr;
  }
</script>

<style scoped></style>
