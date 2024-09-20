<script lang="tsx">
  import { defineComponent, ref, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchModal from './AppSearchModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'AppSearch',
    setup() {
      const showModal = ref(false);
      const { t } = useI18n();

      function changeModal(show: boolean) {
        showModal.value = show;
      }
      /**
       * 韩文龙  2023-11-07
       * 增加ctrl+f唤起搜索菜单功能
       * 添加开始
       */
      document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey && e.key == 'f') || (e.ctrlKey && e.key == 'F')) {
          //console.log('Ctrl+f');
          changeModal(showModal.value ? false : true);
          e.preventDefault();
        }
      });
      /**添加结束 */
      return () => {
        return (
          <div class="p-1" onClick={changeModal.bind(null, true)}>
            <Tooltip>
              {{
                title: () => t('common.searchText'),
                default: () => <SearchOutlined />,
              }}
            </Tooltip>
            <AppSearchModal onClose={changeModal.bind(null, false)} visible={unref(showModal)} />
          </div>
        );
      };
    },
  });
</script>
