import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const formSchema: FormSchema[] = [
  {
    label: '工位编码',
    field: 'wkpCode',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位名称',
    field: 'wkpName',
    component: 'Input',
    dynamicDisabled: true,
  },
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
        placeholder: '请选择',
        multi: true,
        getPopupContainer: (node) => node.parentNode,
      };
    },
  },
  {
    label: '是否校验',
    field: 'isCheck',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否检验物料',
    field: 'isCheckProd',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
  },
  {
    label: '工位ID',
    field: 'wkpId',
    component: 'Input',
    show: false,
  },
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//工位工单信息列表
export const listColumns: BasicColumn[] = [
  {
    title: '工位编码',
    align: 'center',
    sorter: true,
    dataIndex: 'wkpCode',
    width: 120,
  },
  {
    title: '工位名称',
    align: 'center',
    sorter: true,
    dataIndex: 'wkpName',
    width: 160,
  },
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 400,
  },
  {
    title: '是否校验',
    align: 'center',
    dataIndex: 'isCheck',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否校验物料',
    align: 'center',
    dataIndex: 'isCheckProd',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'image',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '操作人',
    align: 'center',
    sorter: true,
    dataIndex: 'operateBy_dictText',
    width: 120,
  },
  {
    title: '操作时间',
    align: 'center',
    sorter: true,
    dataIndex: 'operateTime',
    width: 160,
  },
];
//工位工单信息查询配置
export const listSearchFormSchema: FormSchema[] = [
  {
    label: '工位编码',
    field: 'wkpCode',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工位名称',
    field: 'wkpName',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
/**附件表单配置 */
export const attachmentsFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUpload',
    /*component: 'JUploadCustom',
      componentProps: {
        uploadType: ['camera', 'uplaod'],
      },*/
    colProps: { span: 24 },
  },
];
