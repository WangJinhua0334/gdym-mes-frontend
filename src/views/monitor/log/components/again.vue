<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="'重新请求'" @ok="handleSubmit" :width="1000">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="标题">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item label="请求地址">
        <a-input v-model:value="formState.url" />
      </a-form-item>
      <a-form-item label="请求方法">
        <a-input v-model:value="formState.method" disabled />
      </a-form-item>
      <a-form-item label="请求内容">
        <a-textarea v-model:value="formState.inParam" :rows="8" />
      </a-form-item>
      <a-form-item label="返回内容">
        <a-textarea v-model:value="formState.returnParam" :rows="5" />
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { again } from '../log.api';
  import { ref, unref } from 'vue';

  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { span: 18 };
  const emit = defineEmits(['register', 'success']);
  const formState = ref({
    id: '',
    title: '',
    url: '',
    method: '',
    inParam: '',
    returnParam: '',
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    const itemData = unref(data.record);
    formState.value.title = itemData.title;
    formState.value.url = (itemData.ip ? itemData.ip : '') + itemData.requestUrl;
    formState.value.method = itemData.method;
    formState.value.id = itemData.id;

    let xhr = new XMLHttpRequest();
    xhr.open('Get', itemData.requestParam, false); // public文件夹下的绝对路径
    xhr.overrideMimeType('text/html;charset=utf-8');
    xhr.send(null);

    if (xhr.responseText) {
      if (xhr.responseText.lastIndexOf('入参参数') == -1) {
        xhr = new XMLHttpRequest();
        xhr.open('Get', itemData.requestParam, false); // public文件夹下的绝对路径
        xhr.overrideMimeType('text/html;charset=gb2312');
        xhr.send(null);
        if (xhr.responseText) {
          const strData = xhr.responseText.replace('入参参数：', '').split('出参参数：');
          formState.value.inParam = strData[0];
          formState.value.returnParam = strData[1];
        }
      } else {
        const strData = xhr.responseText.replace('入参参数：', '').split('出参参数：');
        formState.value.inParam = strData[0];
        formState.value.returnParam = strData[1];
      }
    }
    setModalProps({ confirmLoading: false, showCancelBtn: true, showOkBtn: true, defaultFullscreen: false });
  });

  //表单提交事件
  async function handleSubmit(v) {
    try {
      setModalProps({ confirmLoading: true });
      const params = {};
      params['id'] = formState.value.id;
      params['inParam'] = formState.value.inParam;
      params['url'] = formState.value.url.replace('FromMDM', 'ByInternal'); //由于从MDM传过来的有加密，所以再次进行切换调用系统内部接口
      params['method'] = formState.value.method;
      await again(params).then((data) => {
        formState.value.returnParam = JSON.stringify(data);
        emit('success');
      });
    } catch (error) {
      formState.value.returnParam = JSON.stringify(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped></style>
