<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleClose"
    wrapClassName="full-modal"
  >
    <Component
      ref="componentRef"
      :is="component"
      :componentData="componentData"
      @success="handleSubmit"
      @close="handleClose"
      @setModalProps="setComponentProps"
      class="workBenchModal"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getComponent } from './components.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  // Emits声明
  const emit = defineEmits(['register', 'success', 'snfoucs']);
  const component = ref();
  const componentData = ref();
  const componentRef = ref();

  //提示弹窗
  const $message = useMessage();
  const record = ref();

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    record.value = data.record;
    if (record.value.component == '' || record.value.component == null) {
      closeModal();
      $message.createMessage.warning('未配置组件信息');
      return;
    }

    // 获取组件信息
    getComponent(record.value.component).then((componentTemp) => {
      componentData.value = null;
      component.value = null;

      if (!componentTemp) {
        closeModal();
        $message.createMessage.warning('未找到组件');
        return;
      }
      componentData.value = data;
      component.value = componentTemp;
    });

    //重置modal
    setModalProps({
      loading: false,
      title: record.value.name,
      minHeight: record.value.height,
      width: record.value.width,
      centered: true,
      showCancelBtn: false,
      showOkBtn: false,
      footer: null,
      defaultFullscreen: record.value.location == 'full',
    });
  });

  //重构关闭方法
  function handleClose() {
    componentData.value = null;
    component.value = null;

    closeModal();
    emit('snfoucs');
  }

  // 设置属性转换
  function setComponentProps(props) {
    if (props.confirmLoading || props.confirmLoading == false) {
      props.loading = props.confirmLoading;
    }

    setModalProps(props);
  }

  function handleSubmit() {
    componentData.value = null;
    component.value = null;

    closeModal();
    emit('success');
  }
</script>

<style lang="less" scoped>
  .full-modal {
    .ant-modal-content{
      background-color: transparent !important;
    }
    .ant-modal-header {
      height: 60px !important;
      background-color: rgba(31, 41, 92, .5) !important;
      border-bottom: 1px solid #000 !important;
    }
    .anticon {
      color: #fff !important;
    }
    .ant-modal-body {
      height: calc(100% - 60px) !important;
      position: relative;
      z-index: 2;
    }
    .ant-modal-body::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('../image/bg.gif') center center no-repeat;
      background-size: 100% 100%;
      opacity: 0.5;
      z-index: -1;
      top: 0;
      left: 0;
    }
    .vxe-table--render-default.size--medium {
      max-height: 390px;
      overflow: auto;
    }
    .footer {
      background-color: #fff;
      z-index: 999;
    }
  }
</style>
