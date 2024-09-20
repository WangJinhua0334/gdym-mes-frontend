<template>
  <JPopupCustom style="width: 100%" v-bind="popupProps" />
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { JPopupCustom } from '/@/components/Form';
  import { JVxeComponent } from '/@/components/jeecg/JVxeTable/types';
  import { useJVxeComponent, useJVxeCompProps } from '/@/components/jeecg/JVxeTable/hooks';
  import { dispatchEvent, vModel } from '/@/components/jeecg/JVxeTable/utils';
  import { isEmpty, isArray, isObject } from '/@/utils/is';

  export default defineComponent({
    name: 'JVxePopupCustomCell',
    components: { JPopupCustom },
    props: useJVxeCompProps(),
    setup(props: JVxeComponent.Props) {
      const { innerValue, row, originColumn, cellProps, handleChangeCommon } = useJVxeComponent(props);
      const popupProps = computed(() => {
        return {
          ...cellProps,
          value: innerValue.value,
          field: originColumn.value.field || originColumn.value.key,
          code: originColumn.value.popupCode,
          columns: originColumn.value.columns,
          rowKey: originColumn.value.rowKey,
          labelKey: [originColumn.value.labelKey],
          linkmap: originColumn.value.linkmap,
          method: originColumn.value.method,
          params: originColumn.value.params,
          url: originColumn.value.url,
          queryInfo: originColumn.value.queryInfo,
          multi: originColumn.value.multi,
          groupId: 'j-vxe-popupCustom',
          sorter: originColumn.value.sorter,
          isAcademician: true, // 行内编辑模式
          setFieldsValue: (values: any) => {
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
        popupProps,
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
