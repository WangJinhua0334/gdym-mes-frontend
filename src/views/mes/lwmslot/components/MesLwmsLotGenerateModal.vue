<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1600">
    <template #footer>
      <a-button @click="closeModal" type="ghost">取消</a-button>
      <a-button @click="handlePrint" type="primary" :loading="loading">打印</a-button>
    </template>
    <a-button type="primary" style="margin-bottom: 10px" preIcon="ant-design:plus-outlined" @click="addRows"> 新增 </a-button>
    <div>
      <JVxeTable
        keep-source
        resizable
        ref="lwmsLotBinding"
        :loading="lwmsLotBindingTable.loading"
        :columns="lwmsLotBindingTable.columns"
        :dataSource="lwmsLotBindingTable.dataSource"
        :height="340"
        :disabled="formDisabled"
        :rowNumber="true"
        :rowSelection="false"
        :toolbar="false"
      >
        <!-- 定义插槽 -->
        <template #action="props">
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗？" @confirm="handleDelete(props)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </JVxeTable>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { lwmsLotGenerateJVxeColumns } from '../MesLwmsLot.data';
  import { binding, generateLwmsSn, generateBatchNo, jmreport, saveOrUpdate } from '../MesLwmsLot.api';
  import { JVxeTable } from '/@/components/jeecg/JVxeTable';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { goJmReportViewPage, printJimuReport } from '/@/utils';
  import { getToken } from '/@/utils/auth';
  import { defHttp } from '/@/utils/http/axios';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const lwmsLotBinding = ref<any>(null);
  let loading = ref<boolean>(false);
  let batchNo = ref<string>('');
  const formDisabled = ref(false);
  const lwmsLotBindingTable = reactive<{
    loading: boolean;
    dataSource: any[];
    columns: any[];
  }>({
    loading: false,
    dataSource: [],
    columns: lwmsLotGenerateJVxeColumns,
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    batchNo.value = await generateBatchNo();
  });
  //设置标题
  const title = computed(() => '物料条码生成');

  //表单提交事件
  async function handlePrint() {
    try {
      loading.value = true;
      const values = lwmsLotBinding?.value?.getTableData();
      let validateTable = await lwmsLotBinding?.value?.validateTable();
      if (validateTable != null) {
        loading.value = false;
        return;
      }
      let res = await generateLwmsSn({ mesLwmsLots: values });
      let ids = res.ids;
      //console.log('ids', ids);
      defHttp.get({ url: '/template/basTemplate/getReportIdByCode', params: { code: 'SystemDefaultTemplate', type: 'lwms_lot_sn' } }).then((res) => {
        printJimuReport(res, { printAll: true, id: `${unref(ids).join(',')}` }, getToken(), false, () => {
          loading.value = false;
          //关闭弹窗
          closeModal();
          //刷新列表s
          emit('success');
        });
      });
    } catch (e) {
      console.log(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  const addRows = () => {
    const tableDataValues = lwmsLotBinding?.value?.getTableData();
    //console.log('tableDataValues', tableDataValues);
    const v = { id: tableDataValues.length || 1, batchNo: batchNo.value };
    lwmsLotBinding?.value?.addRows(v);
  };

  const handleDelete = (row) => {
    lwmsLotBinding?.value?.removeRows(row.row);
  };
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
