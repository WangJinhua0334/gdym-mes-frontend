<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1000" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #itemColor="{ model, field }">
        <div class="item-tool">
          <div
            v-for="(item, index) in Colors"
            :style="{ color: item[0] }"
            :class="model.itemColor === item[0] ? 'item-active' : ''"
            class="item-color"
            @click="itemColorClick(item)"
          >
            <div class="item-color-border"></div>
            <div class="item-back" :style="{ background: item[0] }"></div>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, Colors } from '../MesStrategy.data';
  import { saveOrUpdate } from '../MesStrategy.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 130,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  /**
   * 颜色点击事件
   *
   * @param index
   * @param item
   * @param model
   */
  function itemColorClick(item) {
    console.log(item);
    setFieldsValue({ itemColor: item[0] });
  }
</script>

<style lang="less" scoped>
  /*begin 字典颜色配置样式*/
  .item-tool {
    display: flex;
    flex-wrap: wrap;
    .item-color {
      width: 18px;
      display: flex;
      justify-content: center;
      cursor: pointer;
      align-items: center;
      margin-right: 10px;
    }
    .item-back {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
  .item-color-border {
    visibility: hidden;
  }
  .item-active .item-color-border {
    visibility: visible;
    position: absolute;
    border: 1px solid;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  /*end 字典颜色配置样式*/
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
