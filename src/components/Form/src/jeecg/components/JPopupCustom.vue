<!--popup组件-->
<template>
  <div class="components-input-demo-presuffix">
    <!--输入框-->
    <!-- <a-input @click="handleOpen" v-model:value="showText" :placeholder="placeholder" readOnly v-bind="attrs">
      <template #prefix>
        <Icon icon="ant-design:cluster-outlined"></Icon>
      </template>
      </a-input> -->
    <a-row class="j-select-row" type="flex" :gutter="12">
      <a-col class="left">
        <a-select
          v-model:value="selectedValue"
          :placeholder="placeholder"
          :filterOption="false"
          :show-arrow="false"
          option-label-prop="label"
          :mode="multi ? 'multiple' : '-'"
          disabled
        >
          <a-select-option
            v-for="(item, index) in options"
            :key="index"
            :value="item[rowKey]"
            :label="setResultValue(labelKey.map((v) => item[v]).join('|'))"
          />
        </a-select>
        <!-- <Icon type="close-circle" /> -->
      </a-col>
      <a-col class="right" v-if="!disabled">
        <Icon icon="ant-design:close-circle-filled" class="close" @click="handleEmpty" title="清空" v-if="value" />
        <Icon icon="ant-design:search-outlined" @click="handleOpen" size="24" style="margin-top: 5px" :color="themeColor" />
      </a-col>
    </a-row>

    <!-- update-begin-author:taoyan date:2022-5-31 for: VUEN-1157 popup 选中后，有两个清除图标；后边这个清除，只是把输入框中数据清除，实际值并没有清除 -->
    <!-- <template #suffix>
                <Icon icon="ant-design:close-circle-outlined" @click="handleEmpty" title="清空" v-if="showText"></Icon>
              </template>-->
    <!-- update-begin-author:taoyan date:2022-5-31 for: VUEN-1157 popup 选中后，有两个清除图标；后边这个清除，只是把输入框中数据清除，实际值并没有清除 -->
    <!--popup弹窗-->
    <JPopupOnlReportCustomModal
      @register="regModal"
      :code="value"
      :multi="multi"
      :sorter="sorter"
      :groupId="uniqGroupId"
      :param="currentParams"
      :columns="columns"
      :method="method"
      :queryInfo="queryInfo"
      :url="url"
      @ok="callBack"
      :options="options"
      :rowKey="rowKey"
      :tableTitleRender="tableTitleRenderValue"
      v-bind="attrs"
    />
  </div>
</template>
<script lang="ts">
  import JPopupOnlReportCustomModal from './modal/JPopupOnlReportCustomModal.vue';
  import { defineComponent, ref, reactive, onMounted, watchEffect, watch, computed, unref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  export default defineComponent({
    name: 'JPopupCustom',
    components: {
      JPopupOnlReportCustomModal,
    },
    inheritAttrs: false,
    props: {
      code: propTypes.string.def(''),
      value: [Array, String],
      sorter: propTypes.string.def(''),
      width: propTypes.number.def(1200),
      placeholder: propTypes.string.def('请选择'),
      multi: propTypes.bool.def(false),
      spliter: propTypes.string.def(','),
      groupId: propTypes.string.def(''),
      method: propTypes.string.def('get'),
      params: propTypes.object,
      queryBefore: propTypes.func,
      formElRef: propTypes.object,
      setFieldsValue: propTypes.func,
      getFieldsValue: propTypes.func,
      beforeOkCallBack: propTypes.func,
      afterClearCallBack: propTypes.func,
      isAcademician: propTypes.bool.def(false),
      disabled: propTypes.bool.def(false),
      queryInfo: {
        type: Array,
        default: () => [],
      },
      columns: {
        type: Array,
        default: () => [],
      },
      url: propTypes.string.def(''),
      rowKey: propTypes.string.def('id'),
      labelKey: {
        type: Array,
        default: () => [],
      },
      linkmap: {
        type: Array,
        default: () => [],
      },
      fuzzy: propTypes.bool.def(true),
      tableTitleRender: {
        type: Function,
        default: null,
      },
    },
    emits: ['change', 'update:value', 'register'],
    setup(props, { emit, refs }) {
      const { createMessage } = useMessage();
      const attrs = useAttrs();
      //pop是否展示
      const avalid = ref(true);
      //注册model
      const [regModal, { openModal }] = useModal();
      //表单值
      let { groupId, code } = props;
      //唯一分组groupId
      const uniqGroupId = computed(() => (groupId ? `${code}` : ''));
      // 选中的值
      let selectedValue;
      if (props.multi) {
        selectedValue = ref([]);
      } else {
        selectedValue = ref('');
      }

      // 隐藏下拉
      const options = ref([]);
      // 传给弹出框的params
      const currentParams = ref({});
      //选中之后的数组对象
      const linkageselectedValue = ref([]);
      let linkageValue = {};
      const { getThemeColor } = useRootSetting();
      const themeColor = computed(() => {
        return unref(getThemeColor.value);
      });

      /**
       * 判断popup配置项是否正确
       */
      onMounted(() => {
        if (props.value != null && props.value != undefined && props.value.length != 0) {
          let parameters = {};
          let currentParams = deepParams();

          let callBackValue = props.value;
          if (props.value && !Array.isArray(props.value) && props.value.indexOf(',') >= 0) {
            callBackValue = props.value.split(',');
          }

          parameters[props.rowKey] = callBackValue;
          defHttp[props.method]({
            url: props.url,
            params: { ...parameters, ...currentParams, pageNo: 1, pageSize: Array.isArray(callBackValue) ? callBackValue.length : 1 },
          }).then((res) => {
            options.value = res.records;
            if (props.multi) {
              if (Array.isArray(props.value)) {
                selectedValue.value = props.value;
              } else {
                selectedValue.value = props.value.split(',');
              }
            } else {
              selectedValue.value = props.value.toString();
            }
          });
        } else {
          if (props.multi) {
            selectedValue.value = [];
          } else {
            selectedValue.value = '';
          }
        }
      });
      /**
       * 监听value数值
       */
      watch(
        () => props.value,
        (val) => {
          if (val != null && val != undefined && val.length != 0) {
            let parameters = {};
            let currentParams = deepParams();

            let callBackValue = props.value;
            if (props.value && !Array.isArray(props.value) && props.value.indexOf(',') >= 0) {
              callBackValue = props.value.split(',');
            }

            parameters[props.rowKey] = callBackValue;
            defHttp[props.method]({
              url: props.url,
              params: { ...parameters, ...currentParams, pageNo: 1, pageSize: Array.isArray(callBackValue) ? callBackValue.length : 1 },
            }).then((res) => {
              options.value = res.records;
              if (props.multi) {
                if (typeof props.value == 'string') {
                  selectedValue.value = props.value.split(',');
                } else {
                  selectedValue.value = props.value;
                }
              } else {
                selectedValue.value = props.value.toString();
              }
            });
          } else {
            if (props.multi) {
              selectedValue.value = [];
            } else {
              selectedValue.value = '';
            }
          }
        },
        { immediate: false }
      );

      /**
       * 打开pop弹出框
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
      function handleOpen() {
        currentParams.value = deepParams();
        !props.disabled && openModal(true);
      }

      /**
       * 传值回调
       */
      function callBack(rows) {
        var ret = !props.beforeOkCallBack || props.beforeOkCallBack(rows);
        selectedValue.value = [];
        linkageselectedValue.value = [];
        let linkageValue = {},
          arr = [];
        if (ret) {
          options.value = rows;
          options.value.forEach((element) => {
            selectedValue.value.push(element[props.rowKey]);
          });
          if (!props.multi) {
            options.value.forEach((item) => {
              if (selectedValue.value[0] == item[props.rowKey]) {
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
                  // setTimeout(() => {
                  linkageValue[item[key]] = arr.join(', ');
                  // },200)
                }
              });
            });
          }
          if (props.isAcademician) {
            props.formElRef && props.formElRef.setFieldsValue(rows);
            props.setFieldsValue && props.setFieldsValue(rows);
          } else {
            props.formElRef && props.formElRef.setFieldsValue(linkageValue);
            props.setFieldsValue && props.setFieldsValue(linkageValue);
          }
        }
        emit('change', selectedValue.value);
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
      /**
       * TODO 清空
       */
      function handleEmpty() {
        if (props.multi) {
          selectedValue.value = [];
        } else {
          selectedValue.value = '';
        }

        options.value = [];

        linkageValue = {};
        props.linkmap.forEach((item: any) => {
          for (let key in item) {
            linkageValue[item[key]] = null;
          }
        });

        if (props.isAcademician) {
          props.formElRef && props.formElRef.setFieldsValue([]);
          props.setFieldsValue && props.setFieldsValue([]);
        } else {
          props.formElRef && props.formElRef.setFieldsValue(linkageValue);
          props.setFieldsValue && props.setFieldsValue(linkageValue);
        }
        emit('change', selectedValue.value);
      }
      // 从 props 或 attrs 中获取 tableTitleRender（componentProps 会作为 props 或 attrs 传递）
      const tableTitleRenderValue = computed(() => {
        // componentProps 中的属性会通过 attrs 传递，但 tableTitleRender 也可能在 props 中
        const value = props.tableTitleRender || (attrs as any)?.tableTitleRender;
        return value;
      });

      return {
        avalid,
        uniqGroupId,
        attrs,
        regModal,
        handleOpen,
        callBack,
        selectedValue,
        linkageselectedValue,
        tableTitleRender: tableTitleRenderValue,
        options,
        currentParams,
        handleEmpty,
        setResultValue,
        themeColor,
      };
    },
  });
</script>
<style lang="less" scoped>
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }

  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #f5222d;
  }

  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }

  .j-select-row {
    @width: 30px;

    .left {
      width: calc(100% - @width);

      > div {
        width: 100%;
      }
    }

    .right {
      width: @width;
      padding: 0 !important;
    }

    .full {
      width: 100%;
    }

    :deep(.ant-select-search__field) {
      display: none !important;
    }

    .close {
      padding: 8px;
      position: absolute;
      right: 90px;
      color: rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }
  }
</style>
