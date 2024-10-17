<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef" />
    <!-- 子表单区域 -->
    <!--引用表格-->
    <BasicTable @register="registerTableSn">
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <a-button @click="closeModal" style="float: right; margin-right: 20px">关闭</a-button>
    <a-button @click="saveData" type="primary" style="float: right; margin-right: 20px">提交</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, reactive, onMounted, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { formSchema, doEnterPress, columns } from './MesProductInAdd.data';
  import { scan, save } from './MesProductInAdd.api';
  // // Emits声明
  const emit = defineEmits(['close']);

  import { useMessage } from '/@/hooks/web/useMessage';
  //提示弹窗
  const $message = useMessage();

  const snList = ref([] as any);

  function closeModal() {
    emit('close');
  }
  async function saveData() {
    if (!unref(snList) || unref(snList).length < 1) {
      $message.createMessage.warning('没有需要提交的数据');
      return;
    }
    let savedObj = { ...getFieldsValue() };
    savedObj.mesProductInDetailList = unref(snList);
    await save(savedObj);
    closeModal();
  }
  async function reset() {
    await resetFields();
    snList.value = undefined;
    setTableData([]);
  }

  onMounted(() => {
    reset();
  });

  watch(
    () => doEnterPress.value,
    () => {
      if (doEnterPress.value) {
        scan({ sn: unref(getFieldsValue().sn) }).then((res) => {
          if (res) {
            if (unref(snList) && unref(snList).length > 0) {
              let arr = unref(snList).filter((s) => s.lotSn == res.lot.sn);
              if (arr && arr.length > 0) {
                return;
              }
            }
            let obj = {} as any;
            obj.lotId = res.lot.id;
            obj.lotSn = res.lot.sn;
            obj.lotQty = res.lot.qty;
            obj.batch = res.lot.batch;
            obj.moId = res.lot.moId;
            obj.prodId = res.lot.prodId;
            obj.moId_dictText = res.mesMo.code;
            obj.prodId_dictText = res.basProduct.code + '[' + res.basProduct.version + ']';
            obj.prodName_dictText = res.basProduct.name;
            if (!unref(snList)) {
              snList.value = [];
            }
            unref(snList).push(obj);
            setTableData(unref(snList));
            setFieldsValue({ sn: '' });
          }
        });
      }
    },
    { immediate: false, deep: true }
  );

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '',
      columns,
      canResize: false,
      immediate: false,
      showTableSetting: false,
      useSearchForm: false,
      showActionColumn: true,
      pagination: false,
      actionColumn: {
        width: 80,
        fixed: 'right',
      },
    },
  });
  const [registerTableSn, { setTableData }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    let arr = unref(snList).filter((s) => s.lotSn != record.lotSn);
    snList.value = arr;
    setTableData(unref(snList));
  }

  /**
   * 操作栏
   */
  function getTableAction(record) {
    let ret = {
      label: '删除',
      popConfirm: {
        title: '是否删除?',
        confirm: handleDelete.bind(null, record),
      },
    };
    let arr = [] as any;
    arr.push(ret);
    return arr;
  }
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
