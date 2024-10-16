import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import dayjs from 'dayjs';

// 表单视图类型：add\edit\detail
export const viewType = ref<string>();

// 操作类型：confirm\audit\cancelAudit\close
export const operateType = ref<string>();

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '任务单号',
    dataIndex: 'code',
    sorter: true,
    width: 160,
  },
  {
    title: '任务分类',
    dataIndex: 'type_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status_dictText',
    sorter: true,
    width: 100,
  },
  {
    title: '工单',
    dataIndex: 'moId_dictText',
    sorter: true,
    width: 160,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    sorter: true,
    width: 160,
  },
  {
    title: '结束时间',
    dataIndex: 'completeTime',
    width: 160,
  },
  {
    title: '工时',
    dataIndex: 'workHours',
    width: 100,
  },
  {
    title: '作业员',
    dataIndex: 'operateBy_dictText',
    sorter: true,
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 160,
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '提交人',
    dataIndex: 'createBy_dictText',
    sorter: true,
    width: 120,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 160,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '任务分类',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'temporary_work_type',
    },
    labelWidth: 120,
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'temporary_work_status',
    },
    labelWidth: 120,
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '任务单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({}) => {
      return unref(viewType) != 'add';
    },
  },
  {
    label: '分类',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'temporary_work_type',
      getPopupContainer: (node) => node.parentNode,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入任务分类!' }];
    },
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
        multi: false,
        getPopupContainer: (node) => node.parentNode,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工单!' }];
    },
  },
  {
    label: '开始时间',
    field: 'startTime',
    defaultValue: dayjs().subtract(0, 'day'),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入开始时间!' }];
    },
  },
  {
    label: '结束时间',
    field: 'completeTime',
    defaultValue: dayjs().subtract(0, 'day'),
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入结束时间!' }];
    },
  },
  {
    label: '工时',
    field: 'workHours',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工时!' }];
    },
  },
  {
    label: '作业员',
    field: 'operateBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入作业员!' }];
    },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'temporary_work_status',
    },
    dynamicDisabled: true,
    ifShow: ({}) => {
      return unref(viewType) == 'detail';
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
  },
  {
    label: '提交人',
    field: 'createBy',
    component: 'JSelectUser',
    componentProps: {
      labelKey: 'realname',
      rowKey: 'username',
      isRadioSelection: true,
    },
    dynamicDisabled: true,
    ifShow: ({}) => {
      return unref(viewType) == 'detail';
    },
  },
  {
    label: '提交时间',
    field: 'createTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
    ifShow: ({}) => {
      return unref(viewType) == 'detail';
    },
  },
];

//确认 confirm、审核 audit、弃审 cancelAudit、关闭 close，表单数据
export const opFormSchema: FormSchema[] = [
  {
    label: '是否通过',
    field: 'result',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    ifShow: ({}) => {
      return unref(operateType) === 'audit';
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入备注!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//审核表单数据
export const auditFormSchema: FormSchema[] = [
  {
    label: '是否通过',
    field: 'result',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入备注!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//操作记录列表数据
export const recordColumns: BasicColumn[] = [
  {
    title: '任务单号',
    dataIndex: 'temporaryWorkId_dictText',
    width: 160,
  },
  {
    title: '任务分类',
    dataIndex: 'type_dictText',
    width: 120,
  },
  {
    title: '工单',
    dataIndex: 'moId_dictText',
    width: 120,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 120,
  },
  {
    title: '结束时间',
    dataIndex: 'completeTime',
    width: 120,
  },
  {
    title: '工时',
    dataIndex: 'workHours',
    width: 100,
  },
  {
    title: '作业员',
    dataIndex: 'operateBy_dictText',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status_dictText',
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 160,
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '操作',
    dataIndex: 'action_dictText',
    width: 120,
  },
  {
    title: '操作人',
    dataIndex: 'createBy_dictText',
    width: 120,
  },
  {
    title: '操作时间',
    sorter: true,
    dataIndex: 'createTime',
    width: 160,
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
    field: 'attachments',
    component: 'JUpload',
    /*component: 'JUploadCustom',
        componentProps: {
          uploadType: ['camera', 'uplaod'],
        },*/
    colProps: { span: 24 },
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
