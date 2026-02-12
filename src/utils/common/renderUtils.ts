import { h } from 'vue';
import { Avatar, Tag, Tooltip, Image, Switch } from 'ant-design-vue';
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import { Tinymce } from '/@/components/Tinymce';
import Icon from '/@/components/Icon';
import { getDictItemsByCode, ajaxGetDictItems } from '/@/utils/dict/index';
import { filterMultiDictText } from '/@/utils/dict/JDictSelectUtil.js';
import { isEmpty } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();

// 字典加载缓存，避免重复请求
const dictLoadingCache = new Map<string, Promise<any[]>>();

const render = {
  /**
   * 渲染列表头像
   */
  renderAvatar: ({ record }) => {
    if (record.avatar) {
      const avatarList = record.avatar.split(',');
      return h(
        'span',
        avatarList.map((item) => {
          return h(Avatar, {
            src: getFileAccessHttpUrl(item),
            shape: 'square',
            size: 'default',
            style: { marginRight: '5px' },
          });
        })
      );
    } else {
      return h(
        Avatar,
        { shape: 'square', size: 'default' },
        {
          icon: () => h(Icon, { icon: 'ant-design:file-image-outlined', size: 30 }),
        }
      );
    }
  },
  /**
   * 根据字典编码 渲染
   * @param v 值
   * @param code 字典编码
   * @param renderTag 是否使用tag渲染
   */
  renderDict: (v, code, renderTag = false) => {
    let text = '';
    let color = '';
    let array = getDictItemsByCode(code);
    
    // 如果缓存中没有字典数据，尝试异步加载（但同步返回，避免阻塞渲染）
    if (!array || array.length === 0) {
      // 检查是否正在加载中，避免重复请求
      if (!dictLoadingCache.has(code)) {
        const loadingPromise = (async () => {
          try {
            // 动态导入 useUserStore，避免循环依赖
            const userModule = await import('/@/store/modules/user');
            const userStore = userModule.useUserStore();
            const result: any[] = await ajaxGetDictItems(code, {}, {});
            if (result && result.length > 0) {
              // 更新字典缓存
              const allDictItems = userStore.getAllDictItems;
              const dictItems: Record<string, any[]> = (allDictItems && typeof allDictItems === 'object' && !Array.isArray(allDictItems)) ? allDictItems as Record<string, any[]> : {};
              dictItems[code] = result;
              userStore.setAllDictItems(dictItems);
              // 触发页面更新（通过事件通知表格重新渲染）
              window.dispatchEvent(new CustomEvent('dict-loaded', { detail: { code } }));
            }
            dictLoadingCache.delete(code);
            return result;
          } catch (error) {
            dictLoadingCache.delete(code);
            return [];
          }
        })();
        dictLoadingCache.set(code, loadingPromise);
      }
      // 返回空值，等待字典数据加载完成后，表格会重新渲染
      return isEmpty(text) || !renderTag ? h('span', text) : h(Tag, { color }, () => text);
    }
    
    const obj = array.filter((item) => {
      return item.value == v;
    });
    if (obj.length > 0) {
      text = obj[0].text;
      color = obj[0].color;
    }
    //【jeecgboot-vue3/issues/903】render.renderDict使用tag渲染报警告问题 #903
    return isEmpty(text) || !renderTag ? h('span', text) : h(Tag, { color }, () => text);
  },
  /**
   * 渲染图片
   * @param text
   */
  renderImage: ({ text }) => {
    if (!text) {
      return h(Image, {
        width: 30,
        height: 30,
        src: '',
        fallback:
          'data:image/png;base64,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',
      });
    }
    const avatarList = text.split(',');
    return h(
      'span',
      avatarList.map((item) => {
        return h(Image, {
          src: getFileAccessHttpUrl(item),
          width: 30,
          height: 30,
          style: { marginRight: '5px' },
          previewMask: () => {
            return h(Icon, { icon: 'ant-design:eye-outlined', size: 20 });
          },
        });
      })
    );
    //update-end-author:taoyan date:2022-5-24 for:  VUEN-1084 【vue3】online表单测试发现的新问题 41、生成的代码，树默认图大小未改
  },
  /**
   * 渲染 Tooltip
   * @param text
   * @param len
   */
  renderTip: (text, len = 20) => {
    if (text) {
      let showText = text + '';
      if (showText.length > len) {
        showText = showText.substr(0, len) + '...';
      }
      return h(Tooltip, { title: text }, () => showText);
    }
    return text;
  },
  /**
   * 渲染a标签
   * @param text
   */
  renderHref: ({ text }) => {
    if (!text) {
      return '';
    }
    const len = 20;
    if (text.length > len) {
      text = text.substr(0, len);
    }
    return h('a', { href: text, target: '_blank' }, text);
  },
  /**
   * 根据字典渲染
   * @param v
   * @param array
   */
  renderDictNative: (v, array, renderTag = false) => {
    let text = '';
    let color = '';
    const obj = array.filter((item) => {
      return item.value == v;
    });
    if (obj.length > 0) {
      text = obj[0].label;
      color = obj[0].color;
    }
    return isEmpty(text) || !renderTag ? h('span', text) : h(Tag, { color }, () => text);
  },
  /**
   * 渲染富文本
   */
  renderTinymce: ({ model, field }) => {
    return h(Tinymce, {
      showImageUpload: false,
      height: 300,
      value: model[field],
      onChange: (value: string) => {
        model[field] = value;
      },
    });
  },
  //原先的方法禁用
  // renderSwitch: (text, arr) => {
  //   return text ? filterMultiDictText(arr, text) : '';
  // },
  renderCategoryTree: (text, code) => {
    const array = getDictItemsByCode(code);
    return filterMultiDictText(array, text);
  },
  renderTag(text, color) {
    return isEmpty(text) ? h('span', text) : h(Tag, { color }, () => text);
  },

  /**
   * 渲染 <a-switch> 组件
   * @param v 值
   * @param arr 字典数组
   * @param disabled 是否禁用，默认为 true
   * @returns {VNode} 返回 Vue 的 VNode 对象
   */
  renderSwitch: (v, arr, disabled = true) => {
    // 查找已选中的项和未选中的项
    const checkedItem = arr.find((item) => item.isChecked);
    const uncheckedItem = arr.find((item) => !item.isChecked);

    // 如果没有找到已选中的项或未选中的项，使用默认值
    const defaultCheckedItem = { text: '是', value: 'Y', isChecked: true };
    const defaultUncheckedItem = { text: '否', value: 'N', isChecked: false };

    const checked = checkedItem || defaultCheckedItem;
    const unchecked = uncheckedItem || defaultUncheckedItem;

    return h(Switch, {
      disabled: disabled,
      checkedValue: checked.value,
      unCheckedValue: unchecked.value,
      checkedChildren: checked.text,
      unCheckedChildren: unchecked.text,
      checked: v,
    });
  },
};

/**
 * 文件下载
 */
function downloadFile(url) {
  if (!url) {
    createMessage.warning('未知的文件');
    return;
  }
  if (url.indexOf(',') > 0) {
    url = url.substring(0, url.indexOf(','));
  }
  url = getFileAccessHttpUrl(url.split(',')[0]);
  if (url) {
    window.open(url);
  }
}

export { render, downloadFile };
