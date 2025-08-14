import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { ref, computed, unref, reactive } from 'vue';
export const doEnterPress = ref();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mo/mesMo/list',
        params: {},
        columns: [
          {
            title: '工单号',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'type_dictText',
          },
          {
            title: '产品编码',
            align: 'center',
            dataIndex: 'prodId_dictText',
          },
          {
            title: '产品名称',
            align: 'center',
            dataIndex: 'prodName_dictText',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '工单号',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'prodQuery',
            label: '产品编码',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        linkmap: [{ prodId: 'prodId', prodId_dictText: 'prodId_dictText', prodName_dictText: 'prodName_dictText' }],
        placeholder: '请选择',
        multi: false,
        getPopupContainer: (node) => node.parentNode,
      };
    },
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '计划入库时间',
    field: 'planInDate',
    component: 'DatePicker',
    componentProps: {
      //日期格式化，页面上显示的值
      format: 'YYYY-MM-DD',
      //返回值格式化（绑定值的格式）
      valueFormat: 'YYYY-MM-DD',
      //是否显示今天按钮
      showToday: true,
    },
  },
  {
    label: '流转卡号',
    field: 'sn',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPress.value = Math.random();
        }
      },
    },
  },
  {
    label: '',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    width: 150,
    dataIndex: 'moId_dictText',
  },
  {
    title: '产品',
    align: 'center',
    width: 150,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    width: 300,
    dataIndex: 'prodName_dictText',
  },
  {
    title: '生产批次',
    align: 'center',
    width: 80,
    dataIndex: 'batch',
  },
  {
    title: '流转卡号',
    align: 'center',
    width: 80,
    dataIndex: 'lotSn',
  },
  {
    title: '数量',
    align: 'center',
    width: 80,
    dataIndex: 'lotQty',
  },
];
