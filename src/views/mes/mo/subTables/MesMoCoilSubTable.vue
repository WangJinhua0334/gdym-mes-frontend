<template>
  <div>
    <!--引用表格-->
    <BasicTable  @register="registerTable" :rowSelection="null" />
  </div>
</template>

<script lang="ts" setup>
import {watch } from 'vue';
import { BasicTable } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import {
  mesMoBomColumns,
  mesMoWorkOrderDetailSearchFormSchema,
  mesMoWorkOrderDetailColumns, mesMoWorkOrderDetailSearchFormColumns
} from "../MesMo.data";
import { workOrderDetailList } from "../MesMo.api";

//
const props = defineProps({
  id: { // 父表格的行序号（不等同于 数据表的记录 id）
    type: String,
    default: '',
  },
  orderNo: { // 生产工单号
    type: String,
    default: '',
  }
});

//注册table数据
const { prefixCls, tableContext } = useListPage({
  tableProps: {
    api: (parameters) => {
      parameters['mainId'] = props.id;
      parameters['orderNo'] = props.orderNo;
      return workOrderDetailList(parameters);
    },
    rowKey: 'id',
    columns: mesMoWorkOrderDetailColumns,  // 半成品生产工单明细表格的列字段设置
    showIndexColumn: true,
    showTableSetting: false,
    canResize: true,
    useSearchForm: true,
    formConfig: {
      schemas: mesMoWorkOrderDetailSearchFormColumns,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
    showActionColumn: false,
    pagination: true,
  },
});

const [registerTable, { reload }] = tableContext;

watch(
  () => props.id,
  () => {
    if (props.id && props.id != '') {
      reload();
    }
  }
);
</script>
