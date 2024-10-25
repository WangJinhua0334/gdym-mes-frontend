import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { ref, reactive } from 'vue';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { useMessage } from '/@/hooks/web/useMessage';
const { createConfirm } = useMessage();

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工单号',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 160,
  },

  {
    title: '车间',
    align: 'center',
    sorter: true,
    dataIndex: 'workShopId_dictText',
    width: 120,
  },
  {
    title: '产品编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    width: 80,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mo_status', true);
    },
  },
  {
    title: '已完工数量',
    align: 'center',
    sorter: true,
    dataIndex: 'completedQty',
    width: 120,
  },
  {
    title: '数量',
    align: 'center',
    sorter: true,
    dataIndex: 'qty',
    width: 80,
  },

  {
    title: '进度',
    align: 'center',
    dataIndex: 'progressData',
    slots: { customRender: 'progressData' },
  },
  {
    title: '计划开始日期',
    align: 'center',
    sorter: true,

    dataIndex: 'planStartTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '计划完工日期',
    align: 'center',
    sorter: true,

    dataIndex: 'planCompleteTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工单号',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编码或名称',
    },
    colProps: { span: 6 },
  },
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        multi: true,
        maxTagCount: 2,
        placeholder: '请输入',
        //pageSize: 10,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'MO_TYPE',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mo_status',
    },
    colProps: { span: 6 },
  },
];
