<template>
  <!--下拉搜素-->
  <a-select v-bind="$attrs" v-model:value="selectedValue" show-search :mode="multi ? 'multiple' : ''"
    :placeholder="placeholder" option-label-prop="label" :filterOption="false" @search="searchMerchantList"
    @popupScroll="popupScroll" @change="handleAsyncChange" :max-tag-count="maxTagCount"
    @dropdownVisibleChange="dropdownVisibleChange">
    <a-select-option disabled>
      <div style="display: flex">
        <p style="width: 30px; text-align: center" v-if="isShowNum">序号</p>
        <p style="flex: 1; text-align: center" v-for="d in columns" :key="d.name" :value="d">{{ d.name }}</p>
      </div>
    </a-select-option>
    <a-select-option v-for="(item, index) in options" :key="item.id" :value="item[rowKey]"
      :label="setResultValue(labelKey.map((v) => item[v]).join('|'))">
      <div style="display: flex">
        <p style="width: 30px; text-align: center" v-if="isShowNum">{{ index + 1 }}</p>
        <a-tooltip v-for="val in columns" :key="val.code" :value="val">
          <template #title>{{ item[val.code] }}</template>
          <p style="flex: 1; text-align: center; overflow: hidden">{{ item[val.code] }} </p>
        </a-tooltip>
      </div>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { defineComponent, ref, unref, watch, onMounted } from 'vue';
import { propTypes } from '/@/utils/propTypes';
import { defHttp } from '/@/utils/http/axios';
import { useAttrs } from '/@/hooks/core/useAttrs';
import { cloneDeep, debounce, method } from 'lodash-es';

export default defineComponent({
  name: 'JSearchSelectCustom',
  inheritAttrs: false,
  props: {
    value: [Array, String],
    async: propTypes.bool.def(true),
    dictOptions: {
      type: Array,
      default: () => [],
    },
    url: propTypes.string,
    method: propTypes.string.def('get'),
    isShowNum: propTypes.bool.def(false),
    columns: {
      type: Array,
      default: () => [],
    },
    rowKey: propTypes.string.def('id'),
    labelKey: {
      type: Array,
      default: () => [],
    },
    pageSize: propTypes.number.def(10),
    placeholder: propTypes.string.def('请选择'),
    setFieldsValue: propTypes.func,
    maxTagCount: propTypes.number.def(2),
    formElRef: propTypes.object,
    //是否在有值后立即触发change
    immediateChange: propTypes.bool.def(false),
    //update-begin-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1
    //支持传入查询参数，如排序信息
    params: {
      type: Object,
      default: () => { },
    },
    queryBefore: propTypes.func,
    getFieldsValue: propTypes.func,
    searchField: propTypes.string.def('name'),
    multi: propTypes.bool.def(false),
    linkmap: {
      type: Array,
      default: () => [],
    },
    isAcademician: propTypes.bool.def(false),
    //update-end-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1
    selectAll: propTypes.bool.def(false),  //是否默认全选
  },
  emits: ['change', 'update:value', 'linkage'],
  setup(props, { emit, refs }) {
    const selectedValue = ref([]); //选中值
    const linkageselectedValue = ref([]); //选中之后的数组对象
    const pageNum = ref(1); //页码
    const totalCount = ref(props.dictOptions.length); //总数
    const options = ref<any[]>([...props.dictOptions]); //下拉选项
    const attrs = useAttrs();

    watch(
      () => props.dictOptions,
      () => {
        totalCount.value = props.dictOptions.length;
        options.value = props.dictOptions;
      },
      { immediate: true }
    );

    /**
     * 监听value
     */
    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (!newVal || newVal.length <= 0) {
          selectedValue.value = [];
          if (props.multi && props.selectAll) {
            pageNum.value = 1;
            options.value = [];
            loadData().then((res) => {
              let data = res.result.records;
              if (res.result && data.length > 0) {
                totalCount.value = res.result.total;
                options.value = data;
                options.value.forEach(item => {
                    selectedValue.value.push(item.id)
                  })
                  callback();
                }
            });
          }
          return;
        }
        let flag = true;
        if (options.value.length > 0) {
          if (Array.isArray(newVal)) {
            let addArr = newVal;
            if (Array.isArray(oldVal) && oldVal.length > 0) {
              addArr = newVal.filter((p: string) => oldVal.indexOf(p) < 0);
            }
            if (addArr.length > 0) {
              for (let i = 0; i < addArr.length; i++) {
                const element = addArr[i];

                flag = options.value.findIndex((p) => p[props.rowKey] === element) >= 0;
                if (!flag) break;
              }
            }
          } else {
            flag = options.value.findIndex((p) => p[props.rowKey] === newVal) >= 0;
          }
        } else {
          flag = false;
        }

        if (!props.async || flag) {
          initSelectValue();
        } else {
          const currentParams = deepParams();
          let callBackValue = props.value;
          if (props.value && !Array.isArray(props.value) && props.value.indexOf(',') >= 0) {
            callBackValue = props.value.split(',');
          }
          currentParams[props.rowKey] = callBackValue;
          defHttp[props.method]({
            url: props.url,
            params: { ...currentParams, pageNo: 1, pageSize: Array.isArray(callBackValue) ? callBackValue.length : 1 },
          }).then((res) => {
            if (res && res.records.length > 0) {
              options.value = res.records;
              selectedValue.value = [];
              res.records.forEach((element, index) => {
                if (props.multi) {
                  if (newVal.indexOf(element[props.rowKey]) >= 0) {
                    selectedValue.value.push(element[props.rowKey]);
                  }
                } else {
                  selectedValue.value = newVal;
                }
              });
            }
          });
        }
      },
      { immediate: true }
    );
    /**
     * 异步查询数据
     */
    function deepClone(obj) {
      let result = typeof obj.splice === 'function' ? [] : {};
      if (obj && typeof obj === 'object') {
        for (let key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key]); //如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
          } else {
            result[key] = obj[key]; //如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
          }
        }
        return result;
      }
      return obj;
    }
    function function_exists(fname = '') {
      let res = false;
      try {
        if (typeof eval(fname) == 'function') {
          // 存在
          res = true;
        } else {
          // 不存在
          res = false;
        }
      } catch (e) {
        // 不存在
        res = false;
      }
      return res;
    }
    function deepParams() {
      const formData = props.getFieldsValue();
      let currentParams = deepClone(props.params);
      const keys = Object.keys(currentParams);
      for (let key in keys) {
        if (currentParams[keys[key]].includes('${') && currentParams[keys[key]].indexOf('${') == 0) {
          const firstNum = currentParams[keys[key]].indexOf('{') + 1;
          const lasttNum = currentParams[keys[key]].indexOf('}');
          currentParams[keys[key]] = formData[currentParams[keys[key]].substring(firstNum, lasttNum)];
        }
      }
      if (function_exists(props.queryBefore)) {
        currentParams = props.queryBefore(currentParams);
      } else {
        currentParams = currentParams;
      }

      return currentParams;
    }
    function loadData() {
      const currentParams = deepParams();
      return defHttp[props.method](
        {
          url: props.url,
          params: { ...currentParams, pageNo: pageNum.value, pageSize: props.pageSize },
        },
        { isTransformResponse: false }
      );
    }
    /**
     * 初始化value
     */
    function initSelectValue() {
      let { value } = props;
      if (Array.isArray(value)) {
        selectedValue.value = value.filter((item) => {
          return !!item;
        });
      } else if (typeof value == 'string') {
        selectedValue.value = value.split(',');
      } else {
        selectedValue.value = value;
      }
      return;
    }

    //回写选中的值
    function setResultValue(source) {
      let idx = source.indexOf('|');
      let retValue = '';
      if (idx >= 0) {
        let str = source.split('|');
        for (let j = 0; j < str.length; j++) {
          if (str[j]) {
            if (j > 0) {
              retValue = retValue + '[';
            }
            retValue = retValue + str[j];
            if (j > 0) {
              retValue = retValue + ']';
            }
          }
        }
      } else {
        retValue = source;
      }
      return retValue;
    }

    // 远程搜索
    const searchMerchantList = debounce(async function (val) {
      if (!props.async) {
        if (!val || val === '') {
          options.value = props.dictOptions;
        } else {
          const searchCols = [props.rowKey];
          props.columns.forEach((p: any) => searchCols.push(p.code));

          const filterOptions = props.dictOptions.filter((item: any) => {
            for (const i in searchCols) {
              const key = searchCols[i];
              if (key === props.rowKey && item[key] === val) {
                return true;
              } else if (key != props.rowKey && item[key].toString().indexOf(val) >= 0) {
                return true;
              }
            }
          });

          options.value = filterOptions;
        }
      } else {
        pageNum.value = 1;
        options.value = [];
        const currentParams = deepParams();
        defHttp[props.method]({
          url: props.url,
          params: { ...currentParams, pageNo: pageNum.value, pageSize: props.pageSize, searchValue: val },
        }).then((res) => {
          if (res.records.length > 0) {
            options.value = res.records;
          }
        });
      }
    }, 1000);
    /**
     * 下拉打开时
     */

    
    function dropdownVisibleChange(open: any) {
      if (open) {
        if (!!props.async) {
          pageNum.value = 1;
          options.value = [];
          loadData().then((res) => {
            let data = res.result.records;
            if (res.result && data.length > 0) {
              totalCount.value = res.result.total;
              options.value = data;
            }

          });
        } else {
          totalCount.value = props.dictOptions.length;
          options.value = props.dictOptions;
        }
      }
    }
    /**
     * 异步改变事件
     * */
    function handleAsyncChange(value) {
      selectedValue.value = value;
      linkageselectedValue.value = [];
      let linkageValue = {},
        arr = [];

      if (value && value.length != 0) {
        if (!props.multi) {
          options.value.forEach((item) => {
            if (value == item[props.rowKey]) {
              linkageselectedValue.value.push(item);
              props.linkmap.forEach((val) => {
                for (let key in val) {
                  linkageValue[val[key]] = item[key];
                }
              });
            }
          });
        } else {
          options.value.forEach((item) => {
            selectedValue.value.forEach((val) => {
              if (val == item[props.rowKey]) {
                linkageselectedValue.value.push(item);
              }
            });
          });
          linkageselectedValue.value.forEach((val) => {
            props.linkmap.forEach((item) => {
              for (let key in item) {
                arr.push(val[key]);
                linkageValue[item[key]] = arr.join(', ');
              }
            });
          });
        }
      } else {
        selectedValue.value = null;
        linkageselectedValue.value = null;
        props.linkmap.forEach((val) => {
          for (let key in val) {
            linkageValue[val[key]] = null;
          }
        });
      }
      if (props.isAcademician) {
        props.setFieldsValue(linkageselectedValue.value);
      } else {
        props.setFieldsValue(linkageValue);
      }
      callback();
    }
    /**
     *回调方法
     * */
    function callback() {
      emit('change', unref(selectedValue));
      emit('update:value', unref(selectedValue));
      emit('linkage', unref(linkageselectedValue));
    }
    // 滚动加载
    const popupScroll = (e: any) => {
      //已经有的下拉项目 大于等于后台返回的下拉项总长度,那么就返回不请求了
      if (options.value.length >= totalCount.value) return;
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      if (scrollHeight - scrollTop === clientHeight) {
        //到达了底部,请求数据
        pageNum.value++; //分页器自增1
        loadData().then((res) => {
          let data = res.result.records;
          if (res.result && data.length > 0) {
            options.value = [...options.value, ...data];
          }
        });
      }
    };
    /**
     * 过滤选中option
     */
    function filterOption(input, option) {
      return option?.children[0]?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    return {
      attrs,
      options,
      selectedValue,
      linkageselectedValue,
      handleAsyncChange,
      popupScroll,
      dropdownVisibleChange,
      totalCount,
      searchMerchantList,
      filterOption,
      setResultValue,
    };
  },
});
</script>

<style lang="less"></style>
