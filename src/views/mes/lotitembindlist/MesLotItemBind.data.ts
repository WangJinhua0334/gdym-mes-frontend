import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

//绑定列表配置
export const bindListColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '生产任务',
    align: 'center',
    sorter: true,
    dataIndex: 'moPlanId_dictText',
    width: 160,
  },
  {
    title: '流转卡号',
    align: 'center',
    sorter: true,
    dataIndex: 'lotSn',
    width: 160,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
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
    title: '绑定人',
    align: 'center',
    sorter: true,
    dataIndex: 'bindBy_dictText',
    width: 120,
  },
  {
    title: '绑定时间',
    align: 'center',
    sorter: true,
    dataIndex: 'bindTime',
    width: 160,
  },
];
//绑定列表查询配置
export const bindListSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'mo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlan',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工序',
    field: 'station',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码/名称',
    field: 'product',
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

//解绑列表配置
export const unbindListColumns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    sorter: true,
    dataIndex: 'moId_dictText',
    width: 160,
  },
  {
    title: '生产任务',
    align: 'center',
    sorter: true,
    dataIndex: 'moPlanId_dictText',
    width: 160,
  },
  {
    title: '流转卡号',
    align: 'center',
    sorter: true,
    dataIndex: 'lotSn',
    width: 160,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 120,
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
    title: '绑定人',
    align: 'center',
    sorter: true,
    dataIndex: 'bindBy_dictText',
    width: 120,
  },
  {
    title: '绑定时间',
    align: 'center',
    sorter: true,
    dataIndex: 'bindTime',
    width: 160,
  },
  {
    title: '解绑原因',
    align: 'center',
    sorter: true,
    dataIndex: 'unbindReason',
    width: 160,
  },
  {
    title: '解绑人',
    align: 'center',
    sorter: true,
    dataIndex: 'unbindBy_dictText',
    width: 120,
  },
  {
    title: '解绑时间',
    align: 'center',
    sorter: true,
    dataIndex: 'unbindTime',
    width: 160,
  },
];
//解绑列表查询配置
export const unbindListSearchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'mo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产任务',
    field: 'moPlan',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '工序',
    field: 'station',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '物料编码/名称',
    field: 'product',
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
