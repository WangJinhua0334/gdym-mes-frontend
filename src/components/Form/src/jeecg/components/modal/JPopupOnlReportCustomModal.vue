<template>
  <!--popup选择框-->
  <div>
    <BasicModal
      v-bind="$attrs"
      @register="register"
      :title="title"
      :width="1200"
      @ok="handleSubmit"
      @cancel="handleCancel"
      cancelText="关闭"
      wrapClassName="j-popup-modal"
      @visible-change="visibleChange"
    >
      <div class="jeecg-basic-table-form-container" v-if="showSearchFlag">
        <a-form ref="formRef" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <template v-for="(item, index) in queryInfo">
              <template v-if="item.hidden === '1'">
                <a-col :md="8" :sm="24" :key="'query' + index" v-show="toggleSearchStatus">
                  <SearchFormItem :formElRef="formRef" :queryParam="queryParam" :item="item" :dictOptions="dictOptions"> </SearchFormItem>
                </a-col>
              </template>
              <template v-else>
                <a-col :md="8" :sm="24" :key="'query' + index">
                  <SearchFormItem :formElRef="formRef" :queryParam="queryParam" :item="item" :dictOptions="dictOptions"> </SearchFormItem>
                </a-col>
              </template>
            </template>

            <a-col :md="8" :sm="8">
              <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                <a-col :lg="6">
                  <a-button type="primary" preIcon="ant-design:reload-outlined" @click="searchReset">重置</a-button>
                  <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery" style="margin-left: 8px">查询</a-button>
                  <a @click="handleToggleSearch" style="margin-left: 8px">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <Icon :icon="toggleSearchStatus ? 'ant-design:up-outlined' : 'ant-design:down-outlined'" />
                  </a>
                </a-col>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <BasicTable
        ref="tableRef"
        :canResize="false"
        :bordered="true"
        :loading="loading"
        :rowKey="combineRowKey"
        :columns="columns"
        :showIndexColumn="false"
        :dataSource="dataSource"
        :pagination="pagination"
        :rowSelection="rowSelection"
        @row-click="clickThenCheck"
        @change="handleChangeInTable"
      >
        <template #tableTitle></template>
      </BasicTable>
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, unref, ref, watch, watchEffect, reactive, computed, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { usePopBiz } from '/@/components/jeecg/OnLine/hooks/usePopBiz';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { defHttp } from '/@/utils/http/axios';
  import { filterMultiDictText } from '/@/utils/dict/JDictSelectUtil.js';

  export default defineComponent({
    name: 'JPopupOnlReportModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      SearchFormItem: createAsyncComponent(() => import('/@/components/jeecg/OnLine/SearchFormItem.vue'), { loading: false }),
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: ['multi', 'code', 'sorter', 'groupId', 'param', 'method', 'columns', 'queryInfo', 'url', 'options', 'rowKey'],
    emits: ['ok', 'register'],
    setup(props, { emit, refs }) {
      const { createMessage } = useMessage();
      const labelCol = reactive({
        xs: { span: 24 },
        sm: { span: 6 },
      });
      const wrapperCol = reactive({
        xs: { span: 24 },
        sm: { span: 18 },
      });
      //注册弹框
      const [register, { closeModal }] = useModalInner();
      const formRef = ref();
      const tableRef = ref();
      const toggleSearchStatus = ref(false);
      const attrs = useAttrs();
      const tableScroll = ref({ x: true });
      const getBindValue = Object.assign({}, unref(props), unref(attrs));
      const [{ filterObj, handleSumColumn }, { checkedKeys, selectRows, pagination, title, iSorter, queryParam, dictOptions }] =
        usePopBiz(getBindValue);

      const showSearchFlag = computed(() => unref(props.queryInfo) && unref(props.queryInfo).length > 0);

      const dataSource = ref([]);
      //表格加载
      const loading = ref(false);
      // 查询参数
      // const queryParam = ref<any>({});
      // 动态参数
      const dynamicParam = ref<any>({});
      // 表信息
      //定义表格信息
      const columns = ref<Array<object>>([]);
      //弹窗可视状态
      const visible = ref(false);
      const selectIds = ref([]);
      // 点击单元格选中行 popup需要 但是报表预览不需要
      let clickThenCheckFlag = true;
      if (!props.multi) {
        clickThenCheckFlag = false;
      }

      /**
       * 选择列配置
       */
      const rowSelection = {
        fixed: true,
        selectedRowKeys: checkedKeys,
        selectionRows: selectRows,
        onChange: onSelectChange,
        type: props.multi ? 'checkbox' : 'radio',
      };
      /**
       * 监听value值
       */
      watch(
        () => props.code,
        (val) => {
          selectIds.value = [];
          if (val) {
            for (let i = 0; i < val.length; i++) {
              selectIds.value.push(val[i]);
            }
          }
        }
      );
      /**
       *监听sorter排序字段
       */
      watchEffect(() => {
        if (props.sorter) {
          let arr = props.sorter.split('=');
          if (arr.length === 2 && ['asc', 'desc'].includes(arr[1].toLowerCase())) {
            iSorter.value = { column: arr[0], order: arr[1].toLowerCase() };
            // 排序字段受控
            unref(props.columns).forEach((col) => {
              if (col.dataIndex === unref(iSorter).column) {
                col['sortOrder'] = unref(iSorter).order === 'asc' ? 'ascend' : 'descend';
              } else {
                col['sortOrder'] = false;
              }
            });
          } else {
            console.warn('【JPopup】sorter参数不合法');
          }
        }
      });

      //update-begin-author:taoyan date:2022-5-31 for: VUEN-1156 popup 多数据有分页时，选中其他页，关闭popup 再点开，分页仍然选中上一次点击的分页，但数据是第一页的数据 未刷新
      watch(
        () => pagination.current,
        (current) => {
          if (current) {
            tableRef.value.setPagination({
              current: current,
            });
          }
        }
      );
      //update-end-author:taoyan date:2022-5-31 for: VUEN-1156 popup 多数据有分页时，选中其他页，关闭popup 再点开，分页仍然选中上一次点击的分页，但数据是第一页的数据 未刷新
      // 加载列信息
      function loadColumnsInfo() {
        let currColumns = props.columns;
        for (let a = 0; a < currColumns.length; a++) {
          // if (currColumns[a].customRender) {
          //   let dictCode = currColumns[a].customRender;
          //   currColumns[a].customRender = ({ text }) => {
          //     return filterMultiDictText(unref(dictOptions)[dictCode], text + '');
          //   };
          // }
          // 排序字段受控
          if (unref(iSorter) && currColumns[a].dataIndex === unref(iSorter).column) {
            currColumns[a].sortOrder = unref(iSorter).order === 'asc' ? 'ascend' : 'descend';
          }
        }
        if (currColumns[0].key !== 'rowIndex') {
          currColumns.unshift({
            title: '序号',
            dataIndex: 'rowIndex',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function ({ text }) {
              return parseInt(text) + 1;
            },
          });
        }
        columns.value = [...currColumns];
      }

      function visibleChange($event) {
        visible.value = $event;
        if (unref(visible)) {
          loadColumnsInfo();
          loadData();
        }
      }

      /**
       * 获取查询参数
       */
      function getQueryParams() {
        let paramTarget = {};
        let queryParams = {};
        if (unref(dynamicParam)) {
          //处理自定义参数
          Object.keys(unref(dynamicParam)).map((key) => {
            paramTarget['self_' + key] = unref(dynamicParam)[key];
          });
        }
        if (unref(queryParam)) {
          unref(props.queryInfo).map((item) => {
            Object.keys(unref(queryParam)).map((key) => {
              if (key === item.field) {
                if (item.fuzzy != undefined && !item.fuzzy) {
                  queryParams[key] = unref(queryParam)[key].trim();
                } else {
                  queryParams[key] = unref(queryParam)[key].trim();
                }
              }
            });
          });
        }
        let param = Object.assign(paramTarget, queryParams, unref(iSorter));
        param.pageNo = pagination.current;
        // 合计逻辑 [待优化 3.0]
        //  实际查询时不使用table组件的pageSize，而使用自定义的realPageSize,realPageSize会在第一次获取到数据后变化
        param.pageSize = pagination.realPageSize;
        return filterObj(param);
      }
      function loadData(arg?) {
        if (arg == 1) {
          pagination.current = 1;
        }
        let param = getQueryParams();
        loading.value = true;
        defHttp[props.method]({
          url: props.url,
          params: { ...param, ...props.param },
        }).then((res) => {
          loading.value = false;
          let data = res;
          setDataSource(data);
        });
      }
      /**
       * 设置dataSource
       */
      function setDataSource(data) {
        if (data) {
          pagination.total = Number(data.total);
          let currentPage = pagination?.current ?? 1;
          for (let a = 0; a < data.records.length; a++) {
            if (!data.records[a].rowIndex) {
              data.records[a].rowIndex = a + (currentPage - 1) * 10;
              if (selectIds.value.length != 0) {
                for (let i = 0; i < selectIds.value.length; i++) {
                  if (data.records[a][props.rowKey] == selectIds.value[i]) {
                    let rowKey = combineRowKey(data.records[a]);
                    checkedKeys.value.push(rowKey);
                    selectRows.value.push(data.records[a]);
                  }
                }
              }
            }
          }
          dataSource.value = data.records;
        } else {
          pagination.total = 0;
          dataSource.value = [];
        }
        // 合计逻辑 [待优化 3.0]
        handleSumColumn(props.columns, pagination.total);
      }
      function handleChangeInTable(page, filters, sorter) {
        //分页、排序、筛选变化时触发
        if (Object.keys(sorter).length > 0) {
          iSorter.value = {
            column: sorter.field,
            order: 'ascend' === sorter.order ? 'asc' : 'desc',
          };
          // 排序字段受控
          unref(props.columns).forEach((col) => {
            if (col['dataIndex'] === sorter.field) {
              col['sortOrder'] = sorter.order;
            }
          });
        }
        pagination.current = page.current;
        pagination.pageSize = page.pageSize;
        loadData();
      }
      function onSelectChange(selectedRowKeys) {
        if (!selectedRowKeys || selectedRowKeys.length == 0) {
          selectRows.value = [];
        } else {
          for (let i = 0; i < selectedRowKeys.length; i++) {
            let combineKey = combineRowKey(getRowByKey(selectedRowKeys[i]));
            let keys = unref(checkedKeys);
            if (combineKey && keys.indexOf(combineKey) < 0) {
              let row = getRowByKey(selectedRowKeys[i]);
              row && selectRows.value.push(row);
            }
          }
        }
        checkedKeys.value = selectedRowKeys;
      }
      /**
       * 行点击事件
       * @param record
       */
      function clickThenCheck(record) {
        if (clickThenCheckFlag === true) {
          let rowKey = combineRowKey(record);
          if (!unref(checkedKeys) || unref(checkedKeys).length == 0) {
            let arr1: any[] = [],
              arr2: any[] = [];
            arr1.push(record);
            arr2.push(rowKey);
            checkedKeys.value = arr2;
            selectRows.value = arr1;
          } else {
            if (unref(checkedKeys).indexOf(rowKey) < 0) {
              //不存在就选中
              checkedKeys?.value.push(rowKey);
              selectRows?.value.push(record);
            } else {
              //已选中就取消
              let rowKey_index = unref(checkedKeys).indexOf(rowKey);
              checkedKeys?.value.splice(rowKey_index, 1);
              selectRows?.value.splice(rowKey_index, 1);
            }
          }
        } else {
          let rowKey = combineRowKey(record);
          let rowKeys = [];
          selectRows.value = [];
          rowKeys.push(rowKey);
          if (!rowKeys || rowKeys.length == 0) {
            selectRows.value = [];
          } else {
            for (let i = 0; i < rowKeys.length; i++) {
              let combineKey = combineRowKey(getRowByKey(rowKeys[i]));
              let keys = unref(checkedKeys);
              if (combineKey && (keys.indexOf(combineKey) < 0 || keys.indexOf(combineKey) == 0)) {
                let row = getRowByKey(rowKeys[i]);
                row && selectRows?.value.push(row);
              }
            }
          }
          checkedKeys.value = rowKeys;
        }
      }
      /**
       * 根据key获取row信息
       * @param key
       */
      function getRowByKey(key) {
        let row = unref(dataSource).filter((record) => combineRowKey(record) === key);
        return row && row.length > 0 ? row[0] : '';
      }
      /**
       * 加载rowKey
       */
      function combineRowKey(record) {
        let res = record?.prodId || '';
        Object.keys(record).forEach((key) => {
          res = key == 'rowIndex' ? record[key] + res : res + record[key];
        });
        res = res.length > 50 ? res.substring(0, 50) : res;
        return res;
      }
      /**
       * 过滤没用选项
       *
       */
      function filterUnuseSelect() {
        selectRows.value = unref(selectRows).filter((item) => {
          let combineKey = combineRowKey(item);
          return unref(checkedKeys).indexOf(combineKey) >= 0;
        });
      }
      /**
       * emit事件 获取选中的行数据
       */
      function getOkSelectRows(): any[] {
        let arr = unref(selectRows);
        let selectedRowKeys = checkedKeys.value;
        if (!selectedRowKeys || selectedRowKeys.length <= 0) {
          return [];
        }
        if (!arr || arr.length <= 0) {
          return [];
        }
        let rows: any = [];
        for (let key of selectedRowKeys) {
          for (let i = 0; i < arr.length; i++) {
            let combineKey = combineRowKey(arr[i]);
            if (key === combineKey) {
              rows.push(toRaw(arr[i]));
              break;
            }
          }
        }
        return rows;
      }

      function handleToggleSearch() {
        toggleSearchStatus.value = !unref(toggleSearchStatus);
      }
      /**
       * 取消/关闭
       */
      function handleCancel() {
        closeModal();
        checkedKeys.value = [];
        selectRows.value = [];
      }
      /**
       *确认提交
       */
      function handleSubmit() {
        filterUnuseSelect();
        if (!props.multi && unref(selectRows) && unref(selectRows).length > 1) {
          createMessage.warning('只能选择一条记录');
          return false;
        }
        if (!unref(selectRows) || unref(selectRows).length == 0) {
          createMessage.warning('至少选择一条记录');
          return false;
        }
        //update-begin-author:taoyan date:2022-5-31 for: VUEN-1155 popup 选择数据时，会选择多条重复数据
        let rows = getOkSelectRows!();
        emit('ok', rows);
        //update-end-author:taoyan date:2022-5-31 for: VUEN-1155 popup 选择数据时，会选择多条重复数据
        handleCancel();
      }

      /**
       * 查询
       */
      function searchQuery() {
        pagination.current = 1;
        loadData();
      }
      /**
       * 重置
       */
      function searchReset() {
        queryParam.value = {};
        loadData();
      }
      return {
        attrs,
        register,
        tableScroll,
        dataSource,
        pagination,
        rowSelection,
        checkedKeys,
        loading,
        title,
        handleCancel,
        handleSubmit,
        clickThenCheck,
        loadData,
        combineRowKey,
        handleChangeInTable,
        filterObj,
        handleSumColumn,
        visibleChange,
        queryParam,
        tableRef,
        formRef,
        labelCol,
        wrapperCol,
        dictOptions,
        showSearchFlag,
        toggleSearchStatus,
        handleToggleSearch,
        searchQuery,
        searchReset,
        columns,
      };
    },
  });
</script>

<style lang="less" scoped>
  .jeecg-basic-table-form-container {
    padding: 5px;

    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 0;
      white-space: nowrap;
    }
  }

  :deep(.jeecg-basic-table .ant-table-wrapper .ant-table-title) {
    min-height: 0;
  }
</style>
