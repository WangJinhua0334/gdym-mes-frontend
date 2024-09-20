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
  import { mesMoPlanTaskFormSchema, mesMoPlanTaskColumns } from '../MesMoPlan.data';
  import { pageMoPlanTask } from '../MesMoPlan.api';

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
          parameters['moPlanId'] = props.id;
        }

        return pageMoPlanTask(parameters);
      },
      rowKey: 'id',
      columns: mesMoPlanTaskColumns,
      canResize: true,
      showIndexColumn: true,
      showTableSetting: false,
      showActionColumn: false,
      useSearchForm: true,
      formConfig: {
        schemas: mesMoPlanTaskFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
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
