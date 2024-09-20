<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :searchInfo="searchInfo" style="padding: 0px">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleCreate" v-auth="'org.jeecg.modules:eam_fixture_type:addFixture'" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <!-- <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
          <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <!-- <a-menu-item key="1" @click="handlewarehousing">
                <Icon icon="ant-design:delete-outlined"></Icon>
                入库
              </a-menu-item>
                <a-menu-item key="1" @click="handneck">
                <Icon icon="ant-design:delete-outlined"></Icon>
                领用
              </a-menu-item> -->
              <!-- <a-menu-item key="2" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item> -->
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ text }">
        <div v-html="text"></div>
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <EamFixtureModal @register="registerModal" @success="handleSuccess" @typesucc="reloadType"></EamFixtureModal>
    <!-- 查看区域-->
    
    <EamFixtureModalView @register="registerViewModal" ></EamFixtureModalView>

    <!-- 领用区域-->
    <EamFixtureNeck @register="registerNeckModal" @success="handleSuccess"></EamFixtureNeck>

    
    <!-- 工装校验区域 -->
    <EamFixtureInspModal @register="registerEaminspModal" @success="handleSuccess"></EamFixtureInspModal>

     <!--报废区域 -->
    <EamFixtureScraped @register="registerscrapModal" @success="handleSuccess"></EamFixtureScraped>
  </div>
</template>

<script lang="ts" name="eam-Fixture" setup>
import { ref, computed, unref, inject, watch } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { useModal } from '/@/components/Modal';
import EamFixtureModal from './components/EamFixtureModal.vue';
import EamFixtureInspModal from './components/EamFixtureInspModal.vue';
import EamFixtureScraped from './scraped/EamFixtureScraped.vue';
import EamFixtureNeck from './neck/EamFixtureNeck.vue'
import EamFixtureRecordModal from './components/EamFixtureRecordModal.vue';
import EamFixtureModalView  from './components/view/EamFixtureModalView.vue'
import { eamFixtureFormSchema, emaFixtureColumns, emaFixtureSelectFormSchema } from './EamFixtureType.data';
import { eamFixtureList, eamFixtureDeleteOne, eamFixtureDeleteBatch,warehousing,neck,refund} from './EamFixtureType.api';
import { isEmpty } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
import { downloadFile } from '/@/utils/common/renderUtils';
import { start } from 'repl';

//接收主表id
const mainId = inject('mainId') || '';
 // Emits声明
const emit = defineEmits(['typesucc']);
//提示弹窗
const $message = useMessage();
//弹窗model
const [registerModal, { openModal }] = useModal();

//工装校验弹出
const [registerEaminspModal, { openModal: openEaminspModal }] = useModal();
//报废弹出
const [registerscrapModal, { openModal: openScrapModal }] = useModal();
//查看弹出
const [registerViewModal, { openModal: openViewModal }] = useModal();

const [registerNeckModal, { openModal: openNeckModal }] = useModal();

const searchInfo = {};
// 列表页面公共参数、方法
const { prefixCls, tableContext, onImportXls, onExportXls } = useListPage({
  tableProps: {
    api: eamFixtureList,
    columns: emaFixtureColumns,
    canResize: false,
    useSearchForm: true,
    formConfig: {
      schemas: emaFixtureSelectFormSchema,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
    actionColumn: {
      fixed:'right',
      width: 140,
    },
    pagination: {
      current: 1,
      pageSize: 5,
      pageSizeOptions: ['5', '20', '50', '100'],
    },
  },
});

//注册table数据
 const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

watch(mainId, () => {
  searchInfo['typeId'] = unref(mainId);
  reload();
});

//刷新父组件，型号数据
function reloadType(){
  emit('typesucc');
}
/**
 * 展开事件
 * */
function onOpenMoPlan() {
  openEaminspModal(true, {
    showFooter: true,
    moRecord: rowSelection.selectedRows[0],
  });
}
 /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openViewModal(true, {
       record,
       isUpdate: true,
       showFooter: false,
     });
   }
/**
 * 新增事件
 */
function handleCreate(record) {
  if (isEmpty(unref(mainId))) {
    $message.createMessage.warning('请选择一个主表信息');
    return;
  }
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
 * 校验事件
 */
function handleEaminspModal(record) {
  openEaminspModal(true, {
    fixtureId: record.id,
  });
}
/**
 * 入库事件
 */
async function handlewarehousing(record) {
  await warehousing({typeId: record.typeId,id: record.id,status:'InStock'},handleSuccess);
}
/**
 * 领用事件
 */
async function handneck(record) {
  openNeckModal(true, {
    record,
    isUpdate: true,
    showFooter: true,
  });
  // openNeckModal
  //await neck({typeId: record.typeId,id: record.id,status:'Used'},handleSuccess);
}
/**
 * 归还事件
 */
async function handrefund(record) {
  await refund({typeId: record.typeId,status:'refund',id: record.id},handleSuccess);
}
/**
 * 报废事件
 */
async function handlescraped(record) {
  await openScrapModal(true,{typeId: record.typeId,id:record.id});
}
/**
 * 删除事件
 */
async function handleDelete(record) {
  await eamFixtureDeleteOne({ id: record.id , typeId: record.typeId,status:'delete'}, handleSuccess);
}
/**
 * 批量删除事件
 */
async function batchHandleDelete() {
  await eamFixtureDeleteBatch({ ids: selectedRowKeys.value }, handleSuccess);
}
/**
 * 成功回调
 */
function handleSuccess() {
  reloadType();
  (selectedRowKeys.value = []) && reload();
}

/**
 * 操作栏
 */
function getTableAction(record) {
  let arr = getActionArray(record);
  return arr.slice(0,2);
}

function getDropDownAction(record) {
  let arr = getActionArray(record);

  return arr.slice(2);
}
/**
 * 下拉操作栏
 */
function getActionArray(record) {
    let actionArr = [];

      if(record.status != 'Created'&&record.status != 'Scraped'){
      actionArr.push({
      label: '校验',
      onClick: handleEaminspModal.bind(null, record),
      auth:"org.jeecg.modules:eam_fixture_type:insp",

      });
      }
 
      if(record.status == 'Created'){
       actionArr.push({
        label: '入库',
        popConfirm: {
        title: '确定入库吗？',
        confirm: handlewarehousing.bind(null, record),
        },
        auth:"org.jeecg.modules:eam_fixture_type:warehousingFixture",

      })
    }

      if(record.status == 'InStock'){
       actionArr.push({
        label: '领用',
        onClick: handneck.bind(null, record),
        auth:"org.jeecg.modules:eam_fixture_type:neckFixture",

      })
    }

     if(record.status == 'Used'){
       actionArr.push({
        label: '归还',
        popConfirm: {
        title: '确定归还吗？',
        confirm: handrefund.bind(null, record),
        },
        auth:"org.jeecg.modules:eam_fixture_type:refundFixture",

      })
    }

      if(record.status != 'Scraped'&&record.status != 'Created'){
        actionArr.push({
        label: '报废',
        onClick: handlescraped.bind(null, record),
        auth:"org.jeecg.modules:eam_fixture_type:scrapFixture",
        })
      }

      if(record.status != 'InStock' && record.status != 'Scraped' && record.status != 'refund' && record.status != 'Used'){
        actionArr.push({
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth:"org.jeecg.modules:eam_fixture_type:editFixture",
        });
        actionArr.push({
        label: '删除',
        popConfirm: {
        title: '是否确认删除?',
        confirm: handleDelete.bind(null, record),
       },
       auth:"org.jeecg.modules:eam_fixture_type:deleteFixture",

     });
    }
        actionArr.push({
        label: '详情',
        onClick: handleDetail.bind(null, record),
      });
      
    return actionArr;
}
</script>
<style scoped>
</style>
