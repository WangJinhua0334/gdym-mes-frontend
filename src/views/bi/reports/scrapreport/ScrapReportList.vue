<template>
  <BasicModal v-bind="$attrs" @register="registerViewModal" destroyOnClose :title="'详情'" :width="1000" :defaultFullscreen="true">
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" name="lotscrap-mesLotScrap" setup>
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { scrapColumns, searchFormSchema } from './ScrapReport.data';
  import { list, getExportUrl } from './ScrapReport.api';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive } from 'vue';

  //表单赋值
  const [registerViewModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setTimeout(() => {
      getForm().setFieldsValue({ prodCode: data.record.code, date: data.column.dataIndex });
      reload();
    }, 500);
    setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false });
  });

  //注册table数据
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '报废明细',
      api: list,
      columns: scrapColumns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      showActionColumn: false,
    },
    exportConfig: {
      name: '在制报废品',
      url: getExportUrl,
    },
  });

  const [registerTable, { reload, getForm }, { rowSelection, selectedRowKeys }] = tableContext;
</script>

<style scoped></style>
