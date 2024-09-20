<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="remoteshutdown1" preIcon="ant-design:poweroff-outlined">一键关机</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)"/>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="RemoteWorkPostList" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, searchFormSchema } from './RemoteWorkPost.data';
  import { list,remoteshutdown,remoteshutdownone } from './RemoteWorkPost.api';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  //注册table数据
  const { prefixCls, tableContext } = useListPage({
    tableProps: {
      title: '工位',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      //showActionColumn:false,
    },
  });

  const [registerTable, { reload }] = tableContext;

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 关机事件
   */
   async function remoteshutdown1() {
    let params={};
    params["telnetIp"]="";
    params["telnetUser"]="Administrator";
    params["telnetPwd"]="";
    await remoteshutdown(params, handleSuccess);
  }

  /**
   * 删除事件
   */
   async function remoteshutdownone1(record) {
    await remoteshutdownone({ ip: record.ip }, handleSuccess);
  }

  /**
   * 操作栏
   */
   function getTableAction(record) {
    return [
      {
        label: '关机',
        onClick: remoteshutdownone1.bind(null, record)
      },
    ];
  }
</script>

<style scoped></style>
