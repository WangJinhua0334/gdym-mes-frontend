<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" v-auth="'org.jeecg.modules:eam_defect_category:add'" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls" v-auth="'org.jeecg.modules:eam_defect_category:exportXls'" > 导出</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
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
    <!--子表表格tab-->
    <div style="padding: 10px">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="设备故障小类" key="1" >
          <EamDefectCategoryListItem />
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 表单区域 -->
    <EamDefectCategoryModal @register="registerModal" @success="handleSuccess"/>
  </div>



</template>

<script lang="ts" name="eam-DefectCategory" setup>
  //ts语法
  import {ref, computed, unref, toRaw, nextTick, provide} from 'vue';
  import {BasicTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import EamDefectCategoryModal from './components/EamDefectCategoryModal.vue';
  import {columns,searchFormSchema} from './EamDefectCategory.data';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import {list, deleteEamDefectCategory, batchDeleteEamDefectCategory, getExportUrl,getImportUrl} from './EamDefectCategory.api';
  import EamDefectCategoryListItem from "/@/views/eam/defectcategory/EamDefectCategoryListItem.vue";
  //注册model
  const [registerModal, {openModal}] = useModal();
  //注册table数据
  const { prefixCls,tableContext,onExportXls } = useListPage({
    tableProps:{
      title: '设备故障分类',
      api: list,
      columns,
      canResize:false,
      rowSelection: {type: 'radio'},
      formConfig: {
        schemas: searchFormSchema,
        fieldMapToNumber: [
        ],
        fieldMapToTime: [
        ],
      },
      actionColumn: {
        width: 120,
        fixed:'right'
      },
      pagination:{
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20'],
      }
    },
    exportConfig: {
      name:"设备",
      url: getExportUrl,
    },
  })

  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  provide('mainId', mainId);
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
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
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
    await deleteEamDefectCategory({id: record.id}, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteEamDefectCategory({ids: selectedRowKeys.value},handleSuccess);
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
        auth: 'org.jeecg.modules:eam_defect_category:edit',
        onClick: handleEdit.bind(null, record),
      }
    ]
  }


  /**
   * 下拉操作栏
   */
  function getDropDownAction(record){
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }, {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
        auth:"org.jeecg.modules:eam_defect_category:delete",
      }
    ]
  }


</script>

<style scoped>

</style>
