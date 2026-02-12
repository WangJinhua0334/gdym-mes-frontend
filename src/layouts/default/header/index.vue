<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo v-if="getShowHeaderLogo || getIsMobile" :class="`${prefixCls}-logo`" :theme="getHeaderTheme" :style="getLogoWidth" />
      <LayoutTrigger
        v-if="(getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile"
        :theme="getHeaderTheme"
        :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
      <!-- 当前租户显示和切换 -->
      <span
        v-if="getShowContent && getShowBreadTitle && !getIsMobile"
        :class="[prefixCls, 'headerIntroductionClass', 'tenant-switch']"
        style="background: transparent; cursor: pointer; display: inline-flex; align-items: center;"
        @click="showTenantSelectModal"
      >
        当前租户：{{ currentTenantName || '未知' }}
        <Icon icon="ant-design:down-outlined" style="margin-left: 4px;" />
      </span>
    </div>
    <!-- left end -->

    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu :isHorizontal="true" :theme="getHeaderTheme" :splitType="getSplitType" :menuMode="getMenuMode" />
    </div>
    <!-- menu-end -->

    <!-- action  -->
    <div :class="`${prefixCls}-action`">
      <Icon @click="goBack" :class="`${prefixCls}-action__item `" icon="material-symbols:first-page" size="30" />
      <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" />

      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />

      <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />

      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

      <LockScreen v-if="getUseLockPage" />

      <AppLocalePicker v-if="getShowLocalePicker" :reload="true" :showText="false" :class="`${prefixCls}-action__item`" />

      <UserDropDown :theme="getHeaderTheme" />

      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
      <!-- ai助手 -->
      <!--<Aide></Aide>-->
    </div>
  </Header>
  <LoginSelect ref="loginSelectRef" @success="loginSelectOk"></LoginSelect>
  <!-- 租户切换弹窗 -->
  <TenantSelectModal ref="tenantSelectModalRef" @success="handleTenantSelectSuccess" />
</template>
<script lang="ts">
  import { defineComponent, unref, computed, ref, onMounted, toRaw } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { propTypes } from '/@/utils/propTypes';

  import { Layout } from 'ant-design-vue';
  import { AppLogo } from '/@/components/Application';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';

  import { AppSearch } from '/@/components/Application';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  import { AppLocalePicker } from '/@/components/Application';

  import { UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction, LockScreen } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Icon } from '/@/components/Icon';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';

  import LoginSelect from '/@/views/sys/login/LoginSelect.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Aide from '@/views/dashboard/ai/components/aide/index.vue';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useGo } from '/@/hooks/web/usePage';
  import { getLoginTenantName, getUserTenants } from '/@/views/system/tenant/tenant.api';
  import { selectDepart } from '/@/views/system/depart/depart.api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
      AppLogo,
      LayoutTrigger,
      LayoutBreadcrumb,
      LayoutMenu,
      UserDropDown,
      AppLocalePicker,
      FullScreen,
      Notify,
      AppSearch,
      ErrorAction,
      LockScreen,
      LoginSelect,
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
      Aide,
      Icon,
      TenantSelectModal: createAsyncComponent(() => import('./components/TenantSelectModal.vue')),
    },
    props: {
      fixed: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('layout-header');
      const userStore = useUserStore();
      const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();
      const { title } = useGlobSetting();

      const {
        getHeaderTheme,
        getShowFullScreen,
        getShowNotice,
        getShowContent,
        getShowBread,
        getShowHeaderLogo,
        getShowHeader,
        getShowSearch,
        getUseLockPage,
        getShowBreadTitle,
      } = useHeaderSetting();

      const { getShowLocalePicker } = useLocale();

      const { getIsMobile } = useAppInject();

      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        console.log(theme)
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme,
          },
        ];
      });

      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader);
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER;
      });

      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {};
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
        return { width: `${width}px` };
      });

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
      });

      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
      });

      /**
       * 首页多租户部门弹窗逻辑
       */
      const loginSelectRef = ref();
      const tenantSelectModalRef = ref();

      function showLoginSelect() {
        //update-begin---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
        //判断是否是登陆进来
        const loginInfo = toRaw(userStore.getLoginInfo) || {};
        if (!!loginInfo.isLogin) {
          loginSelectRef.value.show(loginInfo);
        }
        //update-end---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
      }

      function loginSelectOk() {
        console.log('成功。。。。。');
      }

      //添加返回按钮
      const go = useGo();
      function goBack() {
        // closeAll();
        sessionStorage.removeItem('routerName');
        go(PageEnum.CUSTOM_HOME);
      }

      // 当前租户名称
      const currentTenantName = ref<string>('');
      // 租户列表
      const tenantList = ref<any[]>([]);
      // 选中的租户ID
      const selectedTenantId = ref<string | number>('');
      const { createMessage } = useMessage();

      // 获取当前租户名称（优化：优先从租户列表中获取，减少API调用）
      async function loadTenantName() {
        // 如果租户列表已加载，直接从列表中获取名称
        if (tenantList.value.length > 0) {
          const currentTenantId = userStore.getTenant;
          const currentTenant = tenantList.value.find((item) => item.id == currentTenantId);
          if (currentTenant) {
            currentTenantName.value = currentTenant.name;
            return;
          }
        }
        // 否则调用API获取
        try {
          const tenantName = await getLoginTenantName();
          currentTenantName.value = tenantName || '未知';
        } catch (error) {
          console.error('获取租户名称失败:', error);
          currentTenantName.value = '未知';
        }
      }

      // 加载租户列表（优化：只在需要时加载，并缓存结果）
      async function loadTenantList() {
        // 如果已经有租户列表，直接返回
        if (tenantList.value.length > 0) {
          return;
        }
        try {
          const result = await getUserTenants();
          if (result && result.list && result.list.length > 0) {
            tenantList.value = result.list;
            const currentTenantId = userStore.getTenant;
            selectedTenantId.value = currentTenantId;
            // 更新当前租户名称
            const currentTenant = result.list.find((item) => item.id == currentTenantId);
            if (currentTenant) {
              currentTenantName.value = currentTenant.name;
            }
          }
        } catch (error) {
          console.error('获取租户列表失败:', error);
        }
      }

      // 显示租户选择弹窗（优化：预加载租户列表）
      async function showTenantSelectModal() {
        // 确保租户列表已加载
        await loadTenantList();
        if (tenantSelectModalRef.value) {
          tenantSelectModalRef.value.show();
        }
      }

      // 租户选择成功回调
      function handleTenantSelectSuccess() {
        // 重新加载租户名称
        loadTenantName();
        loadTenantList();
      }

      onMounted(() => {
        showLoginSelect();
        // 优化：并行加载租户名称和列表，提升加载速度
        Promise.all([loadTenantList(), loadTenantName()]);
      });

      return {
        prefixCls,
        getHeaderClass,
        getShowHeaderLogo,
        getHeaderTheme,
        getShowHeaderTrigger,
        getIsMobile,
        getShowBreadTitle,
        getShowBread,
        getShowContent,
        getSplitType,
        getSplit,
        getMenuMode,
        getShowTopMenu,
        getShowLocalePicker,
        getShowFullScreen,
        getShowNotice,
        getUseErrorHandle,
        getLogoWidth,
        getIsMixSidebar,
        getShowSettingButton,
        getShowSetting,
        getShowSearch,
        getUseLockPage,
        loginSelectOk,
        loginSelectRef,
        title,
        t,
        goBack,
        currentTenantName,
        tenantList,
        selectedTenantId,
        showTenantSelectModal,
        handleTenantSelectSuccess,
        tenantSelectModalRef,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
  //update-begin---author:scott ---date:2022-09-30  for：默认隐藏顶部菜单面包屑-----------
  //顶部欢迎语展示样式
  @prefix-cls: ~'@{namespace}-layout-header';

  .ant-layout .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    // update-begin--author:liaozhiyang---date:20240407---for：【QQYUN-8762】顶栏高度
    height: @header-height;
    // update-end--author:liaozhiyang---date:20240407---for：【QQYUN-8762】顶栏高度
    align-items: center;

    .headerIntroductionClass {
      margin-right: 4px;
      margin-bottom: 2px;
      border-bottom: 0px;
      border-left: 0px;
      pointer-events: auto;
    }

    .tenant-select {
      background: transparent !important;
      cursor: pointer !important;
      z-index: 10;
      
      :deep(.ant-select-selector) {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding-left: 0 !important;
        cursor: pointer !important;
      }
      
      :deep(.ant-select-selection-item) {
        padding-right: 20px !important;
        color: rgba(255, 255, 255, 1) !important;
        cursor: pointer !important;
      }
      
      :deep(.ant-select-selection-placeholder) {
        color: rgba(255, 255, 255, 1) !important;
      }
      
      :deep(.ant-select-arrow) {
        color: rgba(255, 255, 255, 1) !important;
        cursor: pointer !important;
      }
      
      :deep(.ant-select-selection-search) {
        cursor: pointer !important;
      }
      
      :deep(.ant-select-selection-search-input) {
        color: rgba(255, 255, 255, 1) !important;
      }
      
      &:hover :deep(.ant-select-selector) {
        border: none !important;
      }
      
      &:focus :deep(.ant-select-selector) {
        border: none !important;
        box-shadow: none !important;
      }
      
      :deep(.ant-select-selection) {
        cursor: pointer !important;
      }
    }
    
    &--dark {
      .tenant-select {
        :deep(.ant-select-selection-item) {
          color: rgba(255, 255, 255, 1) !important;
        }
        
        :deep(.ant-select-selection-placeholder) {
          color: rgba(255, 255, 255, 1) !important;
        }
        
        :deep(.ant-select-arrow) {
          color: rgba(255, 255, 255, 1) !important;
        }
        
        :deep(.ant-select-selection-search-input) {
          color: rgba(255, 255, 255, 1) !important;
        }
      }
    }
    
    &--light {
      .tenant-select {
        :deep(.ant-select-selection-item) {
          color: #000 !important;
        }
        
        :deep(.ant-select-selection-placeholder) {
          color: #000 !important;
        }
        
        :deep(.ant-select-arrow) {
          color: #000 !important;
        }
        
        :deep(.ant-select-selection-search-input) {
          color: #000 !important;
        }
      }
    }

    &--light {
      .headerIntroductionClass {
        color: #000;
      }
    }

    &--dark {
      .headerIntroductionClass {
        color: rgba(255, 255, 255, 1);
      }
      .anticon,
      .truncate {
        color: rgba(255, 255, 255, 1);
      }
      
      .tenant-switch {
        color: rgba(255, 255, 255, 1) !important;
        
        :deep(.anticon) {
          color: rgba(255, 255, 255, 1) !important;
        }
      }
    }
    //update-end---author:scott ---date::2022-09-30  for：默认隐藏顶部菜单面包屑--------------
  }
</style>
