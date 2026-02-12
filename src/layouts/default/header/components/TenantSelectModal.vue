<template>
  <BasicModal v-bind="config" :maxHeight="500" :title="currTitle" v-model:visible="visible" wrapClassName="tenantSelectModal">
    <a-form ref="formRef" v-bind="layout" :colon="false" class="tenantSelectForm">
      <a-form-item :validate-status="validate_status">
        <!--label内容-->
        <template #label>
          <a-tooltip placement="topLeft">
            <template #title>
              <span>请选择要切换的租户</span>
            </template>
            <a-avatar style="background-color: #87d068" :size="30"> 租户 </a-avatar>
          </a-tooltip>
        </template>
        <!--租户下拉内容-->
        <a-select v-model:value="tenantSelected" placeholder="请选择租户" :class="{ 'valid-error': validate_status == 'error' }">
          <template #suffixIcon>
            <Icon icon="ant-design:gold-outline" />
          </template>
          <template v-for="tenant in tenantList" :key="tenant.id">
            <a-select-option :value="tenant.id">{{ tenant.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button @click="close">关闭</a-button>
      <a-button @click="handleSubmit" type="primary">确认</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { BasicModal } from '/@/components/Modal';
  import { selectDepart } from '/@/views/system/depart/depart.api';
  import { getUserTenants } from '/@/views/system/tenant/tenant.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { Icon } from '/@/components/Icon';

  const userStore = useUserStore();
  const { createMessage, notification } = useMessage();
  const emit = defineEmits(['success']);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const config = {
    maskClosable: false,
    closable: true,
    canFullscreen: false,
    width: '500px',
    minHeight: 20,
    maxHeight: 20,
  };
  const currTitle = ref('租户切换');

  const isMultiTenant = ref(false);
  const currentTenantName = ref('');
  const tenantSelected = ref();
  const tenantList = ref([]);
  const validate_status = ref('');

  //弹窗显隐
  const visible = ref(false);
  
  /**
   * 弹窗打开前处理（优化：减少不必要的等待）
   */
  function show() {
    // 如果租户列表已加载，直接显示弹窗
    if (tenantList.value.length > 0) {
      updateTitle();
      visible.value = true;
      return;
    }
    // 否则先加载租户列表
    loadTenantList().then(() => {
      updateTitle();
      visible.value = true;
    });
  }
  
  /**
   * 更新标题
   */
  function updateTitle() {
    if (unref(isMultiTenant)) {
      currTitle.value =
        unref(currentTenantName) && unref(currentTenantName).length > 0 ? `租户切换（当前租户 :${unref(currentTenantName)}）` : '租户切换';
    }
  }
  
  /**
   *加载租户信息（优化：使用缓存）
   */
  async function loadTenantList() {
    // 如果已经有租户列表，直接返回
    if (tenantList.value.length > 0) {
      return;
    }
    const result = await getUserTenants();
    if (!result.list || result.list.length == 0) {
      return;
    }
    let tenantId = userStore.getTenant;
    let currentTenant = result.list.filter((item) => item.id == tenantId);
    currentTenantName.value = currentTenant && currentTenant.length > 0 ? currentTenant[0].name : '';
    tenantList.value = result.list;
    tenantSelected.value = tenantId;
    isMultiTenant.value = true;
  }

  /**
   * 提交数据（优化：先关闭弹窗再刷新，提升用户体验）
   */
  async function handleSubmit() {
    if (unref(isMultiTenant) && unref(tenantSelected) == null) {
      validate_status.value = 'error';
      return false;
    }
    
    // 如果选择的是当前租户，直接关闭
    if (unref(tenantSelected) == userStore.getTenant) {
      close();
      return;
    }
    
    // 显示加载提示
    const hide = createMessage.loading('正在切换租户...', 0);
    
    try {
      await departResolve();
      if (unref(isMultiTenant)) {
        userStore.setTenant(unref(tenantSelected));
      }
      hide();
      createMessage.success('切换成功');
      emit('success');
      close();
      // 延迟一下再刷新，让用户看到成功提示
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (e) {
      hide();
      console.log('切换租户出现问题', e);
      createMessage.error('切换租户失败');
    }
  }
  /**
   *切换选择部门（优化：简化Promise处理）
   */
  async function departResolve() {
    const result = await selectDepart({
      username: userStore.getUserInfo.username,
      orgCode: userStore.getUserInfo.orgCode,
      loginTenantId: unref(tenantSelected),
    });
    if (result.userInfo) {
      const userInfo = result.userInfo;
      userStore.setUserInfo(userInfo);
      return;
    } else {
      requestFailed(result);
      userStore.logout();
      throw new Error('切换租户失败');
    }
  }
  /**
   * 请求失败处理
   */
  function requestFailed(err) {
    notification.error({
      message: '切换失败',
      description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
      duration: 4,
    });
  }
  /**
   * 关闭model
   */
  function close() {
    tenantClear();
  }

  /**
   *初始化数据
   */
  function tenantClear() {
    currTitle.value = '租户切换';

    isMultiTenant.value = false;
    currentTenantName.value = '';
    tenantSelected.value = '';
    tenantList.value = [];
    validate_status.value = '';

    visible.value = false;
  }

  defineExpose({
    show,
  });
</script>
<style lang="less" scoped>
  .tenantSelectForm {
    margin-bottom: -20px;
  }

  .tenantSelectModal {
    top: 20px;
  }

  .valid-error :deep(.ant-select-selection__placeholder) {
    color: #f5222d;
  }
</style>
