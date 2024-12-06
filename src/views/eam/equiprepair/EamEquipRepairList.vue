<template>
  <div>
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection">
     <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleReportRepair" v-auth="'org.jeecg.modules:eam_equip_repair:report'" preIcon="ant-design:plus-outlined"> 报修</a-button>
        <a-button type="primary" @click="handleReportRepairConfirm" v-auth="'org.jeecg.modules:eam_equip_repair:report_confirm'" preIcon="ant-design:plus-outlined"> 报修确认</a-button>
          <a-button type="primary" @click="handleRepair" v-auth="'org.jeecg.modules:eam_equip_repair:equip'" preIcon="ant-design:plus-outlined"> 维修</a-button>
          <a-button type="primary" @click="handleEvaluate" v-auth="'org.jeecg.modules:eam_equip_repair:evaluate'" preIcon="ant-design:plus-outlined"> 评价</a-button>
          <a-button type="primary" @click="handleCancel" v-auth="'org.jeecg.modules:eam_equip_repair:cancel'" preIcon="ant-design:plus-outlined"> 取消</a-button>
      </template>
       <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{text}">
         <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{text}">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{text}">
         <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
         <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <EamEquipRepairModal @register="registerRepairModal" @success="handleSuccess"></EamEquipRepairModal>

    <EamReportEquipRepairModal @register="registerEquipRepairModal" @success="handleSuccess"></EamReportEquipRepairModal>
    <EamReportEquipRepairConfirmModal @register="registerEquipRepairConfirmModal" @success="handleSuccess"></EamReportEquipRepairConfirmModal>
    <EamEquipRepairEvaluateModal @register="registerEvaluateModal" @success="handleSuccess"></EamEquipRepairEvaluateModal>
  </div>
</template>

<script lang="ts" name="eam-EquipRepair" setup>
  import {ref, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage'
  import {useModal} from '/@/components/Modal';
  import EamEquipRepairModal from './components/EamEquipRepairModal.vue'
  import {columns, searchFormSchema} from './EamEquipRepair.data';
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    reportEquipCancel
  } from './EamEquipRepair.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import EamReportEquipRepairModal
    from "/@/views/eam/equiprepair/components/EamReportEquipRepairModal.vue";
  import EamReportEquipRepairConfirmModal
    from "/@/views/eam/equiprepair/components/EamReportEquipRepairConfirmModal.vue";
  import {message} from "ant-design-vue";
  import EamEquipRepairEvaluateModal
    from "/@/views/eam/equiprepair/components/EamEquipRepairEvaluateModal.vue";
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerRepairModal, {openModal:openRepairModal}] = useModal();
  const [registerEquipRepairModal, {openModal:openEquipRepairModal}] = useModal();
  const [registerEquipRepairConfirmModal, {openModal:openEquipRepairConfirmModal}] = useModal();
  const [registerEvaluateModal, {openModal:openEvaluateModal}] = useModal();
   //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '设备维修',
           api: list,
           columns,
           canResize:false,
           formConfig: {
                //labelWidth: 120,
                schemas: searchFormSchema,
                autoSubmitOnEnter:true,
                showAdvancedButton:true,
                fieldMapToNumber: [
                ],
                fieldMapToTime: [
                ],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
           },
        },
        exportConfig: {
            name:"设备维修",
            url: getExportUrl,
        },
        importConfig: {
            url: getImportUrl,
            success: handleSuccess
        },
    })

  const [registerTable, {reload,getSelectRows},{ rowSelection, selectedRowKeys }] = tableContext


  /**
   * 报修事件
   */
  function handleReportRepair() {
    openEquipRepairModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 报修确认事件
   */
  function handleReportRepairConfirm() {
    if (selectedRowKeys.value?.length !== 1){
      message.warning("请选择一条记录")
      return;
    }
    const selectRows = getSelectRows();
    const record = selectRows[0];
    if (record.status != 'wait_confirm'){
      message.error("当前状态非待确认状态");
      return;
    }
    openEquipRepairConfirmModal(true, {
      record,
      showFooter: true,
    });
  }

   /**
    * 维修事件
    */
  function handleRepair() {
     if (selectedRowKeys.value?.length !== 1){
       message.warning("请选择一条记录")
       return;
     }
     const selectRows = getSelectRows();
     const record = selectRows[0];
     if (record.status != 'wait_repair'){
       message.error("当前状态非待维修状态");
       return;
     }
     openRepairModal(true, {
       record:selectRows[0],
       showFooter: true,
     });
  }

   /**
    * 维修评价
    */
  function handleEvaluate() {
     if (selectedRowKeys.value?.length !== 1){
       message.warning("请选择一条记录")
       return;
     }
     const selectRows = getSelectRows();
     const record = selectRows[0];
     if (record.status != 'wait_evaluate'){
       message.error("当前状态非待评价状态");
       return;
     }
     openEvaluateModal(true, {
       record:selectRows[0],
       showFooter: true,
     });
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     if (record.status != 'wait_confirm'){
       message.error("当前状态非待确认状态");
       return;
     }
     openEquipRepairModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 取消事件
    */
   async function handleCancel() {
     if (selectedRowKeys.value?.length !== 1) {
       message.warning("请选择一条记录")
       return;
     }
     const selectRows = getSelectRows();
     const record = selectRows[0];
     if (record.status == 'finished') {
       message.error("维修单已处于完结状态,无法取消");
       return;
     }
     await reportEquipCancel({id: record.id})
   }
   /**
    * 详情
   */
  // function handleDetail(record: Recordable) {
  //    openModal(true, {
  //      record,
  //      isUpdate: true,
  //      showFooter: false,
  //    });
  //  }
   /**
    * 删除事件
    */
  async function handleDelete(record) {
     await deleteOne({id: record.id}, handleSuccess);
   }
   /**
    * 批量删除事件
    */
  async function batchHandleDelete() {
     await batchDelete({ids: selectedRowKeys.value},handleSuccess);
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
  function getTableAction(record){
       return [
         {
           label: '编辑',
           onClick: handleEdit.bind(null, record),
           auth:'org.jeecg.modules:eam_equip_repair:edit'
         }
       ]
   }


  /**
   * 下拉操作栏
   */
  function getDropDownAction(record){
    return [
      // {
      //   label: '详情',
      //   onClick: handleDetail.bind(null, record),
      // },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth:'org.jeecg.modules:eam_equip_repair:delete'
      }
    ]
  }

</script>

<style scoped>

</style>
