<template>
  <!-- <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose @ok="handleSubmit" :maskClosable="false"> </BasicModal> -->
  <div>
    <BasicForm @register="registerForm" style="width: 100%"/>
    <div class="btn-box">
      <div class="btn btn1" @click="handleSubmit">确定</div>
      <div class="btn btn2" @click="switchCencl">取消</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { swichUserSchema } from '../Workbench.data';
  import { checkUser } from '../Workbench.api';
  import { useUserWorkbenchStore } from '/@/store/modules/userWorkbench';
  import { useMessage } from '/@/hooks/web/useMessage';

  const userStoreWorkbench = useUserWorkbenchStore();
  const $message = useMessage();

  // Emits声明
  const emit = defineEmits(['callback', 'register']);
  const [registerForm, { validate }] = useForm({
    labelWidth: 100,
    schemas: swichUserSchema,
    showActionButtonGroup: false,
    wrapperCol: { span: 24 },
    layout: 'vertical',
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
    //重置modal
    setModalProps({
      confirmLoading: false,
      title: '切换用户',
      minHeight: 200,
      width: 500,
      centered: true,
    });
  });

  // async function handleSubmit() {
  //   let values = await validate();
  //   try {
  //     setModalProps({ confirmLoading: true });

  //     checkUser({ username: values.username, password: values.password }).then((data) => {
  //       // 缓存工作台用户信息
  //       userStoreWorkbench.setUserInfo(data);
  //       console.log(data)
  //       emit('callback', data);
  //       $message.createMessage.success('切换成功');

  //       closeModal();
  //     });
  //   } finally {
  //     setModalProps({ confirmLoading: false });
  //   }
  // }
  async function handleSubmit() {
    let values = await validate();
    checkUser({ username: values.username, password: values.password }).then((data) => {
        // 缓存工作台用户信息
        userStoreWorkbench.setUserInfo(data);
        console.log(data)
        emit('callback', data);
        $message.createMessage.success('切换成功');
      });
  }
  async function switchCencl(){
    emit('callback', false);
  }
</script>

<style lang="less" scoped>
.btn-box{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btn{
    width: 90px;
    height: 32px;
    border-radius: 6px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    float: left;
    cursor: pointer;
}
.btn1{
    background-color: #1890FF;
    color: #fff;
}
.btn2{
    background-color: #fff;
    color: #7D8EA8;
    margin-left: 10px;
}
</style>
