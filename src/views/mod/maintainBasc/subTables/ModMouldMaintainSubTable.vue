<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" v-auth="'mod:mod_mould:contentCheck'" @click="handleConnect" preIcon="ant-design:api-outlined"> 关联模具</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleConnect">
                <Icon icon="ant-design:delete-outlined" />
                删除关联
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'mod:mod_mould:deleteContentCheck'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>

    <!--模具选择弹窗-->
    <JPopupOnlReportCustomModal
      @register="registerProdSelectModal"
      :title="'模具选择'"
      :code="modSelectModalProps.code"
      :groupId="modSelectModalProps.uniqGroupId"
      :multi="modSelectModalProps.multi"
      :sorter="modSelectModalProps.sorter"
      :param="modSelectModalProps.params"
      :columns="modSelectModalProps.columns"
      :queryInfo="modSelectModalProps.queryInfo"
      :method="modSelectModalProps.method"
      :url="modSelectModalProps.url"
      :options="modSelectModalProps.options"
      destroyOnClose
      @ok="modSelectCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, unref, watchEffect } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { modMouldColumns } from '../ModMouldMaintain.data';
  import { modMouldList, modContentMaintain, modDeleteContentMaintain } from '../ModMouldMaintain.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { isEmpty } from '/@/utils/is';
  import { buildUUID } from '/@/utils/uuid';
  import { useModal } from '/@/components/Modal';
  import JPopupOnlReportCustomModal from '/@/components/Form/src/jeecg/components/modal/JPopupOnlReportCustomModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });
  /**注册物料选择弹窗 */
  const [registerProdSelectModal, { openModal: openProdSelectModal }] = useModal();
  const queryParam = reactive<any>({});

  watchEffect(() => {
    if (props.id) {
      queryParam.maintainId = props.id;
    }
  });

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: modMouldList,
      columns: modMouldColumns,
      canResize: false,
      showActionColumn: false,
      beforeFetch: (params) => {
        return Object.assign(params, queryParam);
      },
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  //提示弹窗
  const $message = useMessage();
  const modSelectModalCode = computed(() => buildUUID());
  /**物料选择弹出配置 */
  const modSelectModalProps = {
    code: unref(modSelectModalCode),
    uniqGroupId: 'uniq_' + unref(modSelectModalCode),
    multi: true,
    sorter: '',
    params: {},
    columns: [
      {
        title: '编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '描述',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status_dictText',
      },
      {
        title: '存放位置',
        align: 'center',
        dataIndex: 'location',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '描述',
        mode: 'single',
        view: 'string',
      },
    ],
    method: 'get',
    url: '/mod/type/listModMouldByMainId',
    options: [],
  };

  /**
   * 关联事件
   */
  function handleConnect() {
    if (isEmpty(unref(props.id))) {
      $message.createMessage.warning('请选择一个数据');
      return;
    }

    openProdSelectModal(true);
  }
  /**
   * 批量删除关联
   */
  async function batchHandleConnect() {
    await modDeleteContentMaintain({ maintainId: unref(props.id), id: selectedRowKeys.value.join(',') }, handleSuccess);
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
  }

  /**模具选择回调 */
  async function modSelectCallBack(rows) {
    if (rows && rows.length > 0) {
      const itemIds: any[] = [];
      for (let row of rows) {
        itemIds.push(row.id);
      }

      try {
        await modContentMaintain({ maintainId: unref(props.id), id: itemIds.join(',') }).then(() => {
          handleSuccess();
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }
</script>
