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
  import { mesMoBomSearchFormSchema, mesMoBomColumns } from '../MesMo.data';
  import { mesMoBomPage, mesMoCoil } from "../MesMo.api";

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
          parameters['mainId'] = props.id;
        }
        return mesMoCoil(parameters);
      },
      rowKey: 'id',
      columns: mesMoBomColumns,
      showIndexColumn: true,
      showTableSetting: false,
      canResize: true,
      useSearchForm: true,
      formConfig: {
        schemas: mesMoBomSearchFormSchema,
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
