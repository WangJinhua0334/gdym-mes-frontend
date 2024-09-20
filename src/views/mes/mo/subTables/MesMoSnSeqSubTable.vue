<template>
  <div>
    <!--引用表格-->
    <BasicTable bordered @register="registerTable" :rowSelection="null" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { mesMoSnSeqColumns } from '../MesMoSn.data';
  import { querySeqPageList } from '../MesMoSn.api';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      api: (parameters) => {
        if (props.id && props.id != '') {
          parameters['snId'] = props.id;
        }

        return querySeqPageList(parameters);
      },
      rowKey: 'id',
      columns: mesMoSnSeqColumns,
      showIndexColumn: true,
      showTableSetting: false,
      canResize: true,
      useSearchForm: false,
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
