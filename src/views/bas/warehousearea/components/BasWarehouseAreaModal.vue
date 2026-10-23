<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
      <BasicForm @register="registerForm" ref="formRef"/>
  <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="库位" key="basWarehouseBin" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="basWarehouseBin"
          :loading="basWarehouseBinTable.loading"
          :columns="basWarehouseBinTable.columns"
          :dataSource="basWarehouseBinTable.dataSource"
          :height="340"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :toolbar="true"
          />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,reactive} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import { JVxeTable } from '/@/components/jeecg/JVxeTable'
    import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts'
    import {formSchema,basWarehouseBinJVxeColumns} from '../BasWarehouseArea.data';
    import {saveOrUpdate,queryBasWarehouseBin} from '../BasWarehouseArea.api';
    import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils'
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const lockWarehouse = ref(false);
    const formDisabled = ref(false);
    const refKeys = ref(['basWarehouseBin', ]);
    const activeKey = ref('basWarehouseBin');
    const basWarehouseBin = ref();
    const tableRefs = {basWarehouseBin, };
    const basWarehouseBinTable = reactive({
          loading: false,
          dataSource: [],
          columns:basWarehouseBinJVxeColumns
    })
    const areaFormSchema = formSchema.map((schema) =>
      schema.field === 'whId' ? { ...schema, dynamicDisabled: () => lockWarehouse.value } : schema
    );
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        //labelWidth: 150,
        schemas: areaFormSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 12}
    });
     //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await reset();
        setModalProps({confirmLoading: false,showCancelBtn:data?.showFooter,showOkBtn:data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        lockWarehouse.value = !!data?.lockWarehouse;
        formDisabled.value = !data?.showFooter;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
             requestSubTableData(queryBasWarehouseBin, {id:data?.record?.id}, basWarehouseBinTable)
        } else if (data?.record) {
            // 新增时允许调用方传入默认值，例如从仓库区域展开列表新增时预填仓库。
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //方法配置
    const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys);

    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

    async function reset(){
      await resetFields();
      activeKey.value = 'basWarehouseBin';
      basWarehouseBinTable.dataSource = [];
    }
    function classifyIntoFormData(allValues) {
         let main = Object.assign({}, allValues.formValue)
         return {
           ...main, // 展开
           basWarehouseBinList: allValues.tablesValue[0].tableData,
         }
       }
    //表单提交事件
    async function requestAddOrEdit(values) {
        try {
            setModalProps({confirmLoading: true});
            //提交表单
            await saveOrUpdate(values, isUpdate.value);
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }
</script>

<style lang="less" scoped>
	/** 时间和数字输入框样式 */
    :deep(.ant-input-number){
		width: 100%
	}

	:deep(.ant-calendar-picker){
		width: 100%
	}
</style>
