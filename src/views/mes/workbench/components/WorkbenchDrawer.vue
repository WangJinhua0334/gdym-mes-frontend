<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :maskClosable="false" @ok="handleSubmit" @cancel="handleClose">
    <Component :is="component" :componentData="componentData" @success="handleSubmit" @close="handleClose" @setModalProps="setComponentProps" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getComponent } from './components.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  // 声明Emits
  const emit = defineEmits(['success', 'register', 'snfoucs']);
  const component = ref();
  const componentData = ref();

  //提示弹窗
  const $message = useMessage();
  const record = ref();

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    record.value = data.record;
    if (record.value.component == '' || record.value.component == null) {
      closeDrawer();
      $message.createMessage.warning('未配置组件信息');
      return;
    }
    // 获取组件信息
    getComponent(record.value.component).then((componentTemp) => {
      componentData.value = null;
      component.value = null;

      if (!componentTemp) {
        closeDrawer();
        $message.createMessage.warning('未找到组件');
        return;
      }

      componentData.value = data;
      component.value = componentTemp;
    });

    setDrawerProps({
      loading: false,
      title: record.value.name,
      width: record.value.width,
    });
  });

  // 设置属性转换
  function setComponentProps(props) {
    if (props.confirmLoading || props.confirmLoading == false) {
      props.loading = props.confirmLoading;
    }

    setDrawerProps(props);
  }
  //重构关闭方法
  function handleClose() {
    componentData.value = null;
    component.value = null;

    closeDrawer();
    emit('snfoucs');
  }
  /**
   * 提交
   */
  async function handleSubmit() {
    //提交之后，清除配置的参数，close关闭事件，好像不会自动清除
    componentData.value = null;
    component.value = null;

    closeDrawer();
    emit('success');
  }
</script>
<style lang="less" scoped>
.ant-drawer-content{
  background: transparent !important;
}
  .ant-drawer-body {
    // background: rgba(31, 41, 92, .8) !important;
    position: relative;
    z-index: 2;
    background-color: transparent !important;
    .footer {
      background: rgba(31, 41, 92, .3) !important;
      z-index: 999;
      border-top: 1px solid #000 !important;
    }
  }
  .ant-drawer-body::after{
    content: "";
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
  .ant-drawer-header{
    background-color: rgba(31, 41, 92, .5) !important;
    border-bottom: 1px solid #000 !important;
  }
  .ant-drawer-mask{
    background-color: rgba(0, 0, 0, 0.3) !important;
  }
  .ant-col label {
  color: #fff !important;
}
.ant-drawer-close{
  color: #fff;
}
</style>
