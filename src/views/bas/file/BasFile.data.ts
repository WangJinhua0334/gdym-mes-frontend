import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
import { ref } from 'vue';

//用于上传文件时判断是否存在此文件名称
export const fileName = ref('');
export const clickTime = ref(new Date().getTime());
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '文件编码',
    align: 'center',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '文件名称',
    align: 'center',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '文件版本',
    align: 'center',
    dataIndex: 'version',
    width: 80,
  },
  {
    title: '文件分类',
    align: 'center',
    dataIndex: 'category_dictText',
  },
  {
    title: '文件状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '生效', value: 'Y', isChecked: true },
        { text: '无效/审核中', value: 'N', isChecked: false },
      ]);
    },
    width: 80,
  },
  // {
  //   title: '受控时间',
  //   align: 'center',
  //   dataIndex: 'controlTime',
  //   customRender: ({ text }) => {
  //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
  //   },
  // },
  {
    title: '上传人',
    align: 'center',
    dataIndex: 'createBy_dictText',
  },
  {
    title: '审核人',
    align: 'center',
    dataIndex: 'auditBy_dictText',
  },
  {
    title: '审核时间',
    align: 'center',
    dataIndex: 'auditTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
    ifShow: false,
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'file',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
  },
  {
    title: '下发列表',
    align: 'center',
    dataIndex: 'fileList',
    slots: { customRender: 'listSlot' },
    fixed: 'right',
    width: 180,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  // {
  //   label: '文件编码',
  //   field: 'code',
  //   component: 'JInput',
  //   colProps: { span: 6 },
  // },
  {
    label: '产品名称',
    field: 'productId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/file/basFile/productlist',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          // {
          //   name: '编码',
          //   code: 'code',
          // },
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
        queryBefore: function (currentParams) {
          return currentParams;
        },
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '文件名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '文件分类',
    field: 'category',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'file_category',
    },
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '文件',
    field: 'file',
    component: 'JUpload',
    componentProps: {
      multiple: false,
      maxCount: 1,
      beforeUpload: function (promise) {
        clickTime.value = new Date().getTime();
        fileName.value = promise.name.substring(0, promise.name.lastIndexOf('.'));
      },
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入文件!' }];
    },
  },
  {
    label: '文件版本',
    field: 'version',
    defaultValue: '1.0',
    component: 'InputNumber',
    componentProps: { addonBefore: 'V', precision: 1 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入文件版本!' }];
    },
  },
  {
    label: '文件分类',
    field: 'category',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'file_category',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入文件分类!' }];
    },
  },
  {
    label: '文件状态',
    field: 'status',
    component: 'JSwitch',
    show: false,
    componentProps: {},
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入文件状态!' }];
    },
  },
  {
    label: '受控时间',
    field: 'controlTime',
    component: 'DatePicker',
    componentProps: {
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择受控时间!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//子表列表数据
export const basProductFileColumns: BasicColumn[] = [
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'prodCode',
    width: 240,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName',
  },
];
//子表表单数据
/*export const basProductFileFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '产品编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
        columns: [
          {
            title: '编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '版本',
            align: 'center',
            dataIndex: 'version',
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        multi: true,
        maxTagCount: 2,
        labelKey: ['code', 'version'],
        placeholder: '请选择',
        linkmap: [{ name: 'prodName_dictText' }],
      };
    },
  },
  {
    field: 'prodName_dictText',
    label: '产品名称',
    component: 'Input',
    dynamicDisabled: true,
  },
];*/
//子表列表数据
export const basProductGroupFileColumns: BasicColumn[] = [
  {
    title: '产品组编码',
    align: 'center',
    dataIndex: 'prodGrCode',
    width: 240,
  },
  {
    title: '产品组名称',
    align: 'center',
    dataIndex: 'prodGrName',
  },
];
//子表表单数据
/*export const basProductGroupFileFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '产品组编码',
    field: 'prodGrId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/productgroup/basProductGroup/rootList',
        params: {
          status: 'enable',
        },
        columns: [
          {
            title: '编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code'],
        multi: true,
        maxTagCount: 2,
        placeholder: '请选择',
        linkmap: [{ name: 'prodGrName_dictText' }],
      };
    },
  },
  {
    field: 'prodGrName_dictText',
    label: '产品组名称',
    component: 'Input',
    dynamicDisabled: true,
  },
];*/
