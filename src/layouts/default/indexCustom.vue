<template>
  <div class="bg" :class="{ 'bg-dark': themeColor == 'dark', 'bg-light': themeColor == 'light' }">
    <Header :class="getHeaderClass" :style="{ background: getHeaderTheme }">
      <!-- left start -->
      <div :class="`${prefixCls}-left`">
        <!-- logo -->
        <div class="header-logo"><img :src="homeBrandLogo" alt="优联软件" /></div>
      </div>
      <!-- left end -->

      <!-- action  -->
      <div :class="`${prefixCls}-action`">
        <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" />

        <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />

        <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />

        <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

        <LockScreen v-if="getUseLockPage" />

        <AppLocalePicker v-if="getShowLocalePicker" :reload="true" :showText="false" :class="`${prefixCls}-action__item`" />

        <UserDropDown :theme="getHeaderTheme" />

        <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
      </div>
    </Header>
    <div class="cont-menu">
      <!--   /home对应的页面的菜单容器   -->
      <div class="menu-box" v-for="(item, index) in newMenuList" :key="index">
        <div class="item-top">
          <div class="menu-item" v-for="(val, num) in item" :key="num">
            <div
              class="item"
              @click="tabClick(val, index)"
              :class="{ 'item-dark-active': val.isclick, 'item-enter': val.ismouse, 'item-out': !val.ismouse }"
              v-if="!val.meta.hideMenu"
            >
              <div @mouseenter="mouseenter(val)" @mouseleave="mouseleave(val)">
                <p v-cloak>
                  <Icon v-cloak v-if="val.meta.icon" :icon="val.meta.icon" class="icon" :size="size" />
                  <Icon v-cloak v-else icon="bi:file-earmark-text" class="icon" :size="size" />
                </p>
                <p>{{ val.title }}</p>
              </div>
              <div>
                <p
                  v-if="Array.isArray(val.children) && val.children[0]"
                  @click="tabSubClick(val.children[0], $event)"
                  :class="{
                    'item-p-active': val.children[0].isclick,
                    'item-p-enter': val.children[0].ismouse,
                    'item-p-out': !val.children[0].ismouse,
                  }"
                  @mouseenter="mouseenterSub(val.children[0])"
                  @mouseleave="mouseleaveSub(val.children[0])"
                  >{{ val.children[0].title }}</p
                >
                <p v-if="!Array.isArray(val.children) && !val.children[0]"></p>
                <p
                  v-if="Array.isArray(val.children) && val.children[1]"
                  @click="tabSubClick(val.children[1], $event)"
                  :class="{
                    'item-p-active': val.children[1].isclick,
                    'item-p-enter': val.children[1].ismouse,
                    'item-p-out': !val.children[1].ismouse,
                  }"
                  @mouseenter="mouseenterSub(val.children[1])"
                  @mouseleave="mouseleaveSub(val.children[1])"
                  >{{ val.children[1].title }}</p
                >
                <p v-if="!Array.isArray(val.children) || !val.children[1]"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoginSelect ref="loginSelectRef" @success="loginSelectOk" />
</template>

<script lang="ts">
  import { Layout } from 'ant-design-vue';
  import { defineComponent, computed, unref, ref, onMounted, toRaw } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { transformRouteToMenu } from '/@/router/helper/menuHelper';
  import { AppSearch } from '/@/components/Application';
  import { AppLocalePicker } from '/@/components/Application';
  import { UserDropDown, FullScreen, Notify, ErrorAction, LockScreen } from './header/components';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useLocale } from '/@/locales/useLocale';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  import LoginSelect from '/@/views/sys/login/LoginSelect.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useUserStore } from '/@/store/modules/user';
  import { Icon } from '@/components/Icon';
  import homeBrandLogo from '/@/assets/images/unionware-logo-home.png';

  export default defineComponent({
    name: 'DefaultIndex',
    components: {
      Icon,
      Header: Layout.Header,
      // DownOutlined,
      // UserOutlined,
      // BellOutlined,
      // LayoutBreadcrumb,
      UserDropDown,
      AppLocalePicker,
      FullScreen,
      Notify,
      AppSearch,
      ErrorAction,
      LockScreen,
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
      LoginSelect,
    },
    setup() {
      const { prefixCls } = useDesign('layout-header');
      const manager = ref('');
      const manageList = ref([{}]);
      const menuList = ref([{}]); // 菜单列表
      const newMenuList = ref([]);
      const tabIndex = ref(-1);
      const clicked = ref(false);
      const userImg = ref('');
      const menuChildren = ref([]);
      const loadingMore = ref(false);
      const tanIndex = ref(0);
      const go = useGo();
      const { getHeaderTheme, getShowSearch, getShowNotice, getShowFullScreen, getUseLockPage, getShowHeader } = useHeaderSetting();

      const size = ref(60);
      const { getDarkMode, getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();
      const { getShowLocalePicker } = useLocale();
      // gettileTheme.value为自定义的主题颜色取亮色暗色主题，如不设置则取自带的主题色
      const themeColor = computed(() => {
        return getDarkMode.value ? getDarkMode.value : 'light';
      });
      const getHeaderClass = computed(() => {
        const theme = getHeaderTheme.value ? getHeaderTheme.value : 'light';
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: 'flex',
            // [`${prefixCls}--mobile`]: unref(getIsMobile),
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
      const getMenuList = function () {
        defHttp
          .get({
            url: '/sys/permission/getUserPermissionByToken',
            params: {},
          })
          .then((res) => {
            menuList.value = transformRouteToMenu(res.menu);
            //隐藏的菜单就不进行站位处理，过滤掉隐藏的菜单
            menuList.value = menuList.value.filter((item) => !item.hideMenu);

            menuList.value.forEach((item, index) => {
              item.isclick = false;
              item.ismouse = false;
              if (item.title == '首页') {
                tanIndex.value = index;
              }
              if (item.children && item.children.length > 0) {
                item.children = item.children.filter((p) => !p.hideMenu);
                item.children.forEach((itemSub, indexSub) => {
                  itemSub.isclick = false;
                  itemSub.ismouse = false;
                });
              }
            });
            menuList.value.splice(tanIndex.value, 1);
            newMenuList.value = split_array(menuList.value, 4);
          });
      };
      getMenuList();
      const getUserDeatil = function () {
        defHttp
          .get({
            url: '/sys/user/getUserInfo',
            params: {},
          })
          .then((res) => {
            userImg.value = res.userInfo.avatar;
            manager.value = res.userInfo.realname;
            manageList.value = [
              {
                name: res.userInfo.realname,
                id: res.userInfo.id,
                username: res.userInfo.username,
              },
            ];
          });
      };
      getUserDeatil();
      function split_array(arr, len) {
        let arr_length = arr.length;
        let newArr = [];
        for (let i = 0; i < arr_length; i += len) {
          newArr.push(arr.slice(i, i + len));
        }
        return newArr;
      }

      const mouseenter = (item) => {
        item.ismouse = true;
      };
      const mouseleave = (item) => {
        item.ismouse = false;
      };
      const mouseenterSub = (item) => {
        item.ismouse = true;
      };
      const mouseleaveSub = (item) => {
        item.ismouse = false;
      };
      const tabClick = (item, index, goHome = true) => {
        tabIndex.value = index;
        menuChildren.value = item.children;
        if (!item.isclick) {
          menuList.value.forEach((val) => {
            val.isclick = false;
            val.ismouse = false;
          });
          item.isclick = true;
          item.ismouse = true;
        } else {
          item.isclick = false;
          item.ismouse = false;
          tabIndex.value = -1;
        }
        sessionStorage.setItem('routerName', item.name);

        // 菜单跳转，最多支持三级菜单跳转
        let path: string = PageEnum.BASE_HOME;
        if (item.redirect) {
          path = item.redirect;
        } else {
          for (const val of menuChildren.value) {
            if (val.children && val.children.length > 0) {
              if (path == PageEnum.BASE_HOME) {
                path = val.children[0].path;
              }
              if (val.children.findIndex((child) => child.path == item.redirect) > -1) {
                path = item.redirect;
                break;
              }
            } else {
              path = item.children[0].path;
            }
          }
        }
        go(path, true);
      };

      const tabSubClick = (item, event) => {
        event.stopPropagation();
        menuChildren.value = item.children;
        if (!item.isclick) {
          item.isclick = true;
          item.ismouse = true;
        } else {
          item.isclick = false;
          item.ismouse = false;
        }
        sessionStorage.setItem('routerName', item.name);

        // 菜单跳转，最多支持三级菜单跳转
        let path: string = item.path;
        go(path, true);
      };
      /**
       * 首页多租户部门弹窗逻辑
       */
      const loginSelectRef = ref();

      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();

      function showLoginSelect() {
        //update-begin---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
        //判断是否是登陆进来
        const loginInfo = toRaw(userStore.getLoginInfo) || {};
        const orgCode = localStorage.getItem('orgCode');
        if (!orgCode) {
          if (!!loginInfo.isLogin) {
            loginSelectRef.value.show(loginInfo);
          }
        }
        //update-end---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
      }
      function loginSelectOk() {
        console.log('成功。。。。。');
      }
      function onResize() {
        if (window.innerHeight < 600) {
          size.value = 40;
        } else if (window.innerHeight > 600 && window.innerHeight < 900) {
          size.value = 50;
        } else if (window.innerHeight > 900) {
          size.value = 60;
        }
      }
      onMounted(() => {
        showLoginSelect();
        onResize();
        window.addEventListener('resize', onResize);
      });

      return {
        homeBrandLogo,
        themeColor,
        prefixCls,
        getShowSearch,
        getUseErrorHandle,
        getShowNotice,
        getShowFullScreen,
        getUseLockPage,
        getShowLocalePicker,
        getShowSetting,
        getHeaderTheme,
        getHeaderClass,
        manageList,
        manager,
        newMenuList,
        mouseenter,
        mouseleave,
        mouseenterSub,
        mouseleaveSub,
        tabClick,
        tabSubClick,
        tabIndex,
        clicked,
        userImg,
        menuChildren,
        getUserDeatil,
        loginSelectOk,
        loginSelectRef,
        loadingMore,
        size,
        getDarkMode,
      };
    },
  });
</script>
<style lang="less">
  @import './header/index.less';

  .bg-dark {
    background-image: url('../../assets/images/index/bg-dark.png');
  }

  .bg-light {
    background-image: url('../../assets/images/index/bg-light.png');
  }
  div,
  p {
    margin: 0;
    padding: 0;
  }
  .bg {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    overflow: auto;

    .header-logo {
      width: auto;
      max-width: min(280px, 42vw);
      margin-left: 25px;
      img {
        display: block;
        width: auto;
        max-width: 100%;
        height: auto;
        max-height: 40px;
        object-fit: contain;
      }
    }

    .cont-menu {
      width: 100%;
      height: 70%;
      position: relative;
      translate: 0 20%;
      .menu-box {
        width: 100%;

        .item-top {
          display: flex;
          align-items: center;
          .menu-item {
            flex: 1;
            margin-right: 20px;
            margin-bottom: 20px;
            .item {
              display: flex;
              width: 100%;
              height: 21vh;
              border-radius: 2vh;
              background: #ffffff;
              // background-image: url('../../assets/images/index/b3.png');
              // background-position: center center;
              // background-repeat: no-repeat;
              // background-size: 100% 100%;
              cursor: pointer;
              p {
                text-align: center;
                line-height: 2vh;
                font-family: 'MicrosoftYaHei-Bold';
                font-weight: bold;
                img {
                  margin: 0 auto;
                }
              }
            }
            .item > div {
              display: flex;
              width: 50%;
              flex-direction: column;
              align-items: center; /* 内部内容垂直居中 */
              justify-content: center; /* 内部内容水平居中 */
              height: 100%; /* 确保内容高度充满整个容器 */
            }
            .item > div:last-child {
              height: 70%;
            }
            .item > div p {
              text-align: center;
              line-height: 2vh;
              font-family: 'MicrosoftYaHei-Bold';
              font-weight: bold;
              display: flex;
              align-items: center; /* 垂直居中 */
              justify-content: center; /* 水平居中 */
              height: 40%; /* 每个 p 标签占据一半的高度 */
              padding: 2vh;
            }
            .item-p-out {
              margin-top: 2vh; /* 确保 p 标签没有默认的 margin */
              font-weight: normal;
              width: 90%;
              border-radius: 1vh;
              background: var(--vxe-table-column-current-background-color);
              font-size: 1.9vh;
            }
            .item-p-enter {
              margin-top: 2vh; /* 确保 p 标签没有默认的 margin */
              font-weight: normal;
              width: 90%;
              border-radius: 1vh;
              background: linear-gradient(135deg, #ddc334, #ffeb3b) !important;
              color: #ffffff !important;
              animation: changeImg 500ms linear;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
              font-size: 1.9vh;
            }
            .item-p-active {
              margin-top: 2vh; /* 确保 p 标签没有默认的 margin */
              font-weight: normal;
              width: 90%;
              border-radius: 1vh;
              background: linear-gradient(135deg, #ddc334, #ffeb3b) !important;
              color: #ffffff !important;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
              font-size: 1.9vh;
            }
            .item-enter {
              background: linear-gradient(135deg, #ddc334, #ffeb3b) !important;
              border-radius: 2vh;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
              animation: changeImg 500ms linear;
              p {
                color: #ffffff;
                .icon {
                  color: #ffffff;
                }
              }
              div:last-child p {
                color: @primary-color;
              }
            }
            .item-out {
              transition: all 1s;
              p {
                color: @primary-color;
                .icon {
                  color: @primary-color;
                }
              }
            }
            .item-active {
              background: linear-gradient(135deg, #ddc334, #ffeb3b) !important;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
              p {
                color: #ddc334;
                .icon {
                  color: #ffffff;
                }
              }
              div:last-child p {
                color: @primary-color;
              }
            }
          }
        }
      }
      @keyframes changeImg {
        0% {
          opacity: 0.25;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
  @media screen and (max-height: 600px) {
    .bg {
      padding: 10px 100px 0 100px;
      .cont-menu {
        .icon {
          font-size: 40px !important;
        }
        .item {
          // padding-top: 3vh;

          p {
            font-size: 1.9vh;
          }
        }
      }
    }
  }
  @media screen and (min-height: 600px) and (max-height: 900px) {
    .bg {
      padding: 10px 120px 0 120px;
      .cont-menu {
        .icon {
          font-size: 50px !important;
        }
        .item {
          // padding-top: 4vh;

          p {
            font-size: 2.1vh;
          }
        }
      }
    }
  }

  @media screen and (min-height: 900px) {
    .bg {
      padding: 10px 170px 0 170px;
      .cont-menu {
        .icon {
          font-size: 60px !important;
        }
        .item {
          // padding-top: 4vh;

          p {
            font-size: 2.7vh;
          }
        }
      }
    }
  }
</style>
