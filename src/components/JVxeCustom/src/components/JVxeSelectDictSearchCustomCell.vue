<template>
  <JSearchSelectCustom style="width: 100%" v-bind="selectProps" />
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { JSearchSelectCustom } from '/@/components/Form';
  import { JVxeComponent } from '/@/components/jeecg/JVxeTable/types';
  import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks';
  import { dispatchEvent, vModel } from '/@/components/jeecg/JVxeTable/utils';
  import { isEmpty, isArray, isObject } from '/@/utils/is';

  export default defineComponent({
    name: 'JVxeSelectCustomCell',
    components: { JSearchSelectCustom },
    props: useJVxeCompProps(),
    setup(props: JVxeComponent.Props) {
      const { innerValue, row, originColumn, cellProps, handleChangeCommon } = useJVxeComponent(props);
      const selectProps = computed(() => {
        return {
          ...cellProps,
          value: innerValue.value,
          field: originColumn.value.field || originColumn.value.key,
          code: originColumn.value.popupCode,
          columns: originColumn.value.columns,
          rowKey: originColumn.value.rowKey,
          labelKey: [originColumn.value.labelKey],
          linkmap: originColumn.value.linkmap,
          async: originColumn.value.async,
          dictOptions: originColumn.value.dictOptions,
          method: originColumn.value.method,
          params: originColumn.value.params,
          url: originColumn.value.url,
          multi: originColumn.value.multi,
          groupId: 'j-vxe-selectCustom',
          isAcademician: true, // 行内编辑模式
          allowClear: originColumn.value.allowClear || true, //允许清空选择
          /*setFieldsValue: (values) => {
            if (!isEmpty(values)) {
              let popupValue = '' || [];
              let selectValue = '' || [];
              let arr = [];
              if (values && values.length != 0) {
                values.forEach((item) => {
                  Object.keys(item).forEach((key) => {
                    if (originColumn.value.multi) {
                      if (key === originColumn.value.rowKey) {
                        popupValue.push(item[originColumn.value.labelKey]);
                        row.value[originColumn.value.key + '_dictText'] = popupValue.join(', ');
                        selectValue.push(item[originColumn.value.rowKey]);
                        row.value[originColumn.value.key] = selectValue.join(', ');
                        if (originColumn.value.linkmap) {
                          originColumn.value.linkmap.forEach((val) => {
                            for (let v in val) {
                              arr.push(item[v]);
                              setTimeout(() => {
                                row.value[val[v]] = arr.join(', ');
                              }, 200);
                            }
                          });
                        }
                      }
                    } else {
                      // 当前列直接赋值，其他列通过vModel赋值
                      if (key === originColumn.value.rowKey) {
                        popupValue = item[originColumn.value.labelKey];
                        row.value[originColumn.value.key + '_dictText'] = popupValue;
                      } else {
                        if (originColumn.value.linkmap) {
                          originColumn.value.linkmap.forEach((val) => {
                            for (let key in val) {
                              row.value[val[key]] = item[key];
                            }
                          });
                        }
                        selectValue = item[originColumn.value.rowKey];
                        row.value[originColumn.value.key] = item[originColumn.value.rowKey];
                      }
                    }
                  });
                });
              } else {
                if (originColumn.value.linkmap) {
                  originColumn.value.linkmap.forEach((val) => {
                    for (let key in val) {
                      row.value[val[key]] = null;
                    }
                  });
                }
              }
              vModel(popupValue, row, originColumn.value.key + '_dictText');
              handleChangeCommon(selectValue);
            }
          },*/
          setFieldsValue: (values: any) => {
            console.log(values);

            // 清空值，values: null | {} | []
            if (!values || isEmpty(values)) {
              row.value[originColumn.value.key] = null;
              row.value[originColumn.value.key + '_dictText'] = null;
              if (originColumn.value.linkmap) {
                originColumn.value.linkmap.forEach((val) => {
                  for (let key in val) {
                    row.value[val[key]] = null;
                  }
                });
              }

              vModel('', row, originColumn.value.key + '_dictText');
              handleChangeCommon('');
            }
            // 设置选中值
            else if (isArray(values)) {
              const linkageValue = {}; // 联动值

              const popupValue: any[] = []; // 显示值
              const selectedValue: any[] = []; // 选中值
              values.forEach((item) => {
                selectedValue.push(item[originColumn.value.rowKey]);
                popupValue.push(item[originColumn.value.labelKey]);

                if (originColumn.value.linkmap) {
                  originColumn.value.linkmap.forEach((val) => {
                    for (let key in val) {
                      if (Object.keys(linkageValue).findIndex((p) => p === val[key]) < 0) {
                        linkageValue[val[key]] = [];
                      }

                      linkageValue[val[key]].push(item[key]);
                    }
                  });
                }
              });

              row.value[originColumn.value.key] = selectedValue.join(',');
              row.value[originColumn.value.key + '_dictText'] = popupValue.join(', ');

              if (Object.keys(linkageValue).length > 0) {
                const linkKeys = Object.keys(linkageValue);
                for (const key of linkKeys) {
                  row.value[key] = linkageValue[key].join(', ');
                }
              }

              vModel(popupValue, row, originColumn.value.key + '_dictText');
              handleChangeCommon(selectedValue);
            }
          },
          getFieldsValue: function () {
            return row.value;
          },
          queryBefore: originColumn.value.queryBefore,
        };
      });

      return {
        selectProps,
      };
    },
    //【组件增强】注释详见：JVxeComponent.Enhanced
    enhanced: {
      aopEvents: {
        editActived({ $event }) {
          dispatchEvent({
            $event,
            props: this.props,
            className: '.ant-input',
            isClick: true,
          });
        },
      },
    } as JVxeComponent.EnhancedPartial,
  });
</script>
