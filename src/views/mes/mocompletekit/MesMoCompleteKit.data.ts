import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref } from 'vue';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
    sorter: true,
    width: 160,
  },
  {
    title: '物料编码',
    align: 'center',
    dataIndex: 'prodId_dictText',
    sorter: true,
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '分配数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '已领料数量',
    align: 'center',
    dataIndex: 'issuedQty',
    width: 100,
  },
  {
    title: '仓库',
    align: 'center',
    dataIndex: 'whId_dictText',
    width: 120,
  },
  {
    title: '创建人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    sorter: true,
    width: 160,
  },
];

//查询数据
export const getSearchFormSchema = function (showProdId) {
  const arr: FormSchema[] = [
    {
      label: '工单',
      field: 'moCode',
      component: 'Input',
      colProps: { span: !!showProdId ? 6 : 8 },
    },
    {
      label: '物料',
      field: 'prodQuery',
      component: 'Input',
      show: !!showProdId,
      colProps: { span: !!showProdId ? 6 : 8 },
    },
    {
      label: '仓库',
      field: 'whQuery',
      component: 'Input',
      colProps: { span: !!showProdId ? 6 : 8 },
    },
  ];
  return arr;
};

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '分配数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: [
      { required: true, message: '分配数量不能为空' },
      {
        required: false,
        validator: (_, value) => {
          if (value && value < Number(values.issuedQty ?? 0)) {
            return Promise.reject('分配数量不能小于已领料数量！');
          } else {
            return Promise.resolve();
          }
        },
        trigger: 'change',
      },
    ],
  },
  {
    label: '已领料数量',
    field: 'issuedQty',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '仓库',
    field: 'whId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 子表查询配置
export const distrubuteSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue, submit } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/mo/mesMo/list',
        params: { column: 'code', order: 'desc', searchFields: 'code' },
        columns: [
          {
            name: '工单号',
            code: 'code',
          },
          {
            name: '产品编码',
            code: 'prodId_dictText',
          },
          {
            name: '产品名称',
            code: 'prodName_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择',
        pageSize: 10,
        onChange: (e) => {
          submit();
        },
      };
    },
    dynamicRules: () => {
      return [{ require: true, message: '请选择工单!' }];
    },
    //show: !!showMoId,
  },
  {
    label: '仓库',
    field: 'whId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue, submit } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/warehouse/basWarehouse/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
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
        placeholder: '请选择',
        pageSize: 10,
        onChange: (e) => {
          submit();
        },
      };
    },
    dynamicRules: () => {
      return [{ require: true, message: '请选择仓库!' }];
    },
    colProps: { span: 6 },
  },
  /*{
    label: '',
    field: 'query',
    component: 'Input',
    slot: 'queryButtonSlot',
    colProps: { span: 6 },
  },*/
];

//子表表格配置
export const getDistrubuteJVxeColumns = function () {
  const arr: JVxeColumn[] = [
    {
      title: '',
      key: 'id',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '工单ID',
      key: 'moId',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '工单',
      key: 'moId_dictText',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '物料ID',
      key: 'prodId',
      type: JVxeTypes.input,
      visible: false,
    },
    {
      title: '物料编码',
      key: 'prodId_dictText',
      type: JVxeTypes.input,
      width: 240,
      disabled: true,
    },
    {
      title: '物料名称',
      key: 'prodName_dictText',
      type: JVxeTypes.input,
      disabled: true,
    },
    {
      title: '单位用量',
      key: 'unitQty',
      type: JVxeTypes.inputNumber,
      width: 120,
      align: 'center',
      disabled: true,
    },
    {
      title: '需求数量',
      key: 'requireQty',
      type: JVxeTypes.inputNumber,
      width: 120,
      align: 'center',
      disabled: true,
    },
    {
      title: '已分配数量',
      key: 'preparedQty',
      type: JVxeTypes.inputNumber,
      width: 120,
      align: 'center',
      disabled: true,
    },
    {
      title: '分配数量',
      key: 'distributeQty',
      type: JVxeTypes.inputNumber,
      validateRules: [
        { required: true, message: '${title}不能为空' },
        {
          handler: ({ cellValue, row }, callback) => {
            if (cellValue < 0) {
              callback(false, '${title}必须大于0');
            } else if (cellValue > row.invQty) {
              callback(false, '${title}不能大于可用库存！');
            } else if (cellValue > row.requireQty - row.preparedQty) {
              callback(false, '${title}不能大于物料未分配库存数量！');
            } else callback(true);
          },
          message: '${title}必须大于0',
        },
      ],
      placeholder: '请输入${title}',
      width: 120,
      align: 'center',
    },
    {
      title: '可用库存',
      key: 'invQty',
      type: JVxeTypes.inputNumber,
      width: 120,
      align: 'center',
      footerAlign: 'right',
      disabled: true,
    },
    {
      title: '齐套数',
      key: 'kitQty',
      type: JVxeTypes.inputNumber,
      width: 120,
      align: 'center',
      disabled: true,
    },
    {
      title: '操作',
      key: 'action',
      type: JVxeTypes.slot,
      slotName: 'action',
      align: 'center',
      fixed: 'right',
      width: 160,
    },
  ];

  return arr;
};
