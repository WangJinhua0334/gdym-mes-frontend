import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

//工位物料记录配置
export const stockListColumns: BasicColumn[] = [
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
    width: 160,
  },
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
    width: 160,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 80,
  },
  {
    title: '是否提醒',
    align: 'center',
    dataIndex: 'isRemind',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '提醒值',
    align: 'center',
    dataIndex: 'remindQty',
    width: 80,
  },
  {
    title: '物料条码',
    align: 'center',
    sorter: true,
    dataIndex: 'materialSn',
    width: 160,
  },
  {
    title: '物料批次',
    align: 'center',
    sorter: true,
    dataIndex: 'materialBatch',
    width: 160,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'materialSnType_dictText',
    width: 100,
  },
  {
    title: '供应商',
    align: 'center',
    sorter: true,
    dataIndex: 'suppId_dictText',
    width: 120,
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 160,
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'image',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '上料人',
    align: 'center',
    sorter: true,
    dataIndex: 'upBy_dictText',
    width: 120,
  },
  {
    title: '上料时间',
    align: 'center',
    sorter: true,
    dataIndex: 'upTime',
    width: 160,
  },
];
//工位物料记录查询配置
export const stockListSearchFormSchema: FormSchema[] = [
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
  {
    label: '工单',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码/名称',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料条码',
    field: 'materialSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' },
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
        placeholder: '请输入',
        multi: true,
        maxTagCount: 1,
      };
    },
    colProps: { span: 6 },
  },
];

//工位物料操作记录列表配置
export const stockRecordListColumns: BasicColumn[] = [
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
    title: '操作类型',
    align: 'center',
    sorter: true,
    dataIndex: 'operateType',
    width: 160,
    customRender: ({ text }) => {
      return render.renderDict(text, 'wkp_stock_record_type', true);
    },
  },
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'prodId_dictText',
    width: 160,
  },
  {
    title: '物料名称',
    align: 'center',
    sorter: true,
    dataIndex: 'prodName_dictText',
    width: 160,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 80,
  },
  {
    title: '物料条码',
    align: 'center',
    sorter: true,
    dataIndex: 'materialSn',
    width: 160,
  },
  {
    title: '物料批次',
    align: 'center',
    sorter: true,
    dataIndex: 'materialBatch',
    width: 160,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'materialSnType_dictText',
    width: 100,
  },
  {
    title: '供应商',
    align: 'center',
    sorter: true,
    dataIndex: 'suppId_dictText',
    width: 120,
  },
  {
    title: '备注',
    align: 'center',
    sorter: true,
    dataIndex: 'remark',
    width: 160,
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
//工位物料操作记录列表查询配置
export const stockRecordListSearchFormSchema: FormSchema[] = [
  {
    label: '操作类型',
    field: 'operateType',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'wkp_stock_record_type',
    },
    colProps: { span: 6 },
  },
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
  {
    label: '工单',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码/名称',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料条码',
    field: 'materialSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '供应商',
    field: 'suppId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/supplier/basSupplier/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name' },
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
        placeholder: '请输入',
        multi: true,
        maxTagCount: 1,
      };
    },
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
