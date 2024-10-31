import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const isWorkBench = ref(false);

//列表数据
export const listColumns: BasicColumn[] = [
  {
    title: '车间',
    align: 'center',
    sorter: true,
    dataIndex: 'wksId_dictText',
    width: 120,
  },
  {
    title: '工作中心',
    align: 'center',
    sorter: true,
    dataIndex: 'wkcId_dictText',
    width: 120,
  },
  {
    title: '工位',
    align: 'center',
    sorter: true,
    dataIndex: 'wkpId_dictText',
    width: 120,
  },
  {
    title: '异常类型',
    align: 'center',
    sorter: true,
    dataIndex: 'typeId_dictText',
    width: 120,
  },
  {
    title: '内容',
    align: 'center',
    dataIndex: 'content',
    width: 160,
  },
  {
    title: '问题设备',
    align: 'center',
    dataIndex: 'equipmentId_dictText',
    width: 120,
  },
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'abnormal_status', true);
    },
  },
  {
    title: '提交人',
    sorter: true,
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 120,
  },
  {
    title: '提交时间',
    sorter: true,
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '期望完成时间',
    sorter: true,
    align: 'center',
    dataIndex: 'expectTime',
    width: 150,
  },
  {
    title: '负责人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
    width: 120,
  },
  {
    title: '响应时长',
    align: 'center',
    dataIndex: 'responseHours',
    width: 100,
  },
  {
    title: '响应人',
    sorter: true,
    align: 'center',
    dataIndex: 'responseBy_dictText',
    width: 120,
  },
  {
    title: '响应时间',
    sorter: true,
    align: 'center',
    dataIndex: 'responseTime',
    width: 150,
  },
  {
    title: '异常原因',
    align: 'center',
    dataIndex: 'reason',
    width: 200,
  },
  {
    title: '处理措施',
    align: 'center',
    dataIndex: 'measure',
    width: 160,
  },
  {
    title: '处理时长',
    align: 'center',
    dataIndex: 'processHours',
    width: 100,
  },
  {
    title: '处理人',
    sorter: true,
    align: 'center',
    dataIndex: 'processBy_dictText',
    width: 120,
  },
  {
    title: '处理时间',
    sorter: true,
    align: 'center',
    dataIndex: 'processTime',
    width: 150,
  },
  {
    title: '驳回原因',
    sorter: true,
    align: 'center',
    dataIndex: 'remark',
    width: 200,
  },
];

//查询表单配置
export const searchFormSchema: FormSchema[] = [
  {
    label: '异常类型',
    field: 'abnormalTypeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/abnormal/mesAbnormalType/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },

  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'abnormal_status',
    },
  },
  {
    label: '提交人',
    field: 'createBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'username', order: 'asc', searchFields: 'username,realname,workNo' },
        columns: [
          {
            name: '账号',
            code: 'username',
          },
          {
            name: '姓名',
            code: 'realname',
          },
          {
            name: '工号',
            code: 'workNo',
          },
        ],
        isShowNum: false,
        rowKey: 'username',
        labelKey: ['realname'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
  },
];

//响应记录、处理记录查询表单配置
export const processeSearchFormSchema: FormSchema[] = [
  {
    label: '异常分类',
    field: 'abnormalTypeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/abnormal/mesAbnormalType/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },
  {
    label: '车间',
    field: 'wksId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },
  {
    label: '工作中心',
    field: 'wkcId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workcenter/basWorkCenter/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        pageSize: 10,
      };
    },
  },
  {
    label: '提交人',
    field: 'createBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'username', order: 'asc', searchFields: 'username,realname,workNo' },
        columns: [
          {
            name: '账号',
            code: 'username',
          },
          {
            name: '姓名',
            code: 'realname',
          },
          {
            name: '工号',
            code: 'workNo',
          },
        ],
        isShowNum: false,
        rowKey: 'username',
        labelKey: ['realname'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
  },
  {
    label: '责任部门',
    field: 'responsibleDeptId',
    component: 'JSelectDept',
    componentProps: {
      sync: true,
      multiple: true,
    },
  },
];

//驳回表单配置
export const rejectFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },

  {
    label: '驳回原因',
    field: 'remark',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入驳回原因' }];
    },
  },
];

//新增表单配置
export const addFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '车间',
    field: 'wksId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' /*, code: '${code}'*/ },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //multi: true,
        //maxTagCount: 2,
        pageSize: 10,
        placeholder: '请输入',
        onChange: (data) => {
          setFieldsValue({ wkcId: '', wkpId: '' });
        },
      };
    },
    dynamicDisabled: () => {
      return !!unref(isWorkBench);
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '车间不能为空' }];
    },
  },
  {
    label: '工作中心',
    field: 'wkcId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workcenter/basWorkCenter/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        //multi: true,
        //maxTagCount: 2,
        pageSize: 10,
        placeholder: '请输入',
        onChange: (data) => {
          setFieldsValue({ wkpId: '' });
        },
        queryBefore: (params) => {
          params.workShopId = -1;
          if (getFieldsValue().wksId) {
            params.workShopId = getFieldsValue().wksId;
          }

          return params;
        },
      };
    },
    dynamicDisabled: () => {
      return !!unref(isWorkBench);
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '工作中心不能为空' }];
    },
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        //multi: true,
        //maxTagCount: 2,
        pageSize: 10,
        queryBefore: (params) => {
          params.wkcId = -1;
          if (getFieldsValue().wkcId) {
            params.wkcId = getFieldsValue().wkcId;
          }

          return params;
        },
      };
    },
    dynamicDisabled: () => {
      return !!unref(isWorkBench);
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '工位不能为空' }];
    },
  },
  {
    label: '异常类型',
    field: 'typeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/abnormal/mesAbnormalType/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name,description' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{ responsibleDeptId: 'responsibleDeptId' }, { responsibleBy: 'responsibleBy' }],
        placeholder: '请输入',
        //multi: true,
        //maxTagCount: 2,
        pageSize: 10,
      };
    },
    dynamicDisabled: () => {
      return !!unref(isWorkBench);
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '异常类型不能为空' }];
    },
  },
  {
    label: '异常描述',
    field: 'content',
    component: 'InputTextArea',
    componentProps: {
      autoSize: {
        //最小显示行数
        minRows: 4,
      },
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '异常描述不能为空' }];
    },
  },
  {
    label: '问题设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/basEquipment/list',
        params: { column: 'createTime', order: 'asc', searchFields: 'code,name', code: '${code}' },
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
        multi: false,
      };
    },
    colProps: { span: 24 },
  },
  {
    label: '期望处理时间',
    field: 'expectTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '责任部门',
    field: 'responsibleDeptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        sync: true,
        multiple: false,
        onChange: ({}) => {
          setFieldsValue({ responsibleBy: null });
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '责任部门不能为空' }];
    },
  },
  {
    label: '负责人',
    field: 'responsibleBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { order: 'asc', searchFields: 'username,realname,workNo' },
        columns: [
          {
            name: '账号',
            code: 'username',
          },
          {
            name: '姓名',
            code: 'realname',
          },
          {
            name: '工号',
            code: 'workNo',
          },
        ],
        isShowNum: false,
        rowKey: 'username',
        labelKey: ['realname'],
        placeholder: '请输入',
        multi: true,
        maxTagCount: 2,
        queryBefore: (params) => {
          const deptId = getFieldsValue().responsibleDeptId;
          if (deptId instanceof Array && deptId.length > 0) {
            params.departId = deptId[0];
          } else if (deptId && deptId.length > 0) {
            params.departId = deptId;
          }

          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '负责人不能为空' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
];

//详情表单配置
export const detailFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '异常类型',
    field: 'typeId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '车间',
    field: 'wksId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '工作中心',
    field: 'wkcId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '工位',
    field: 'wkpId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '内容',
    field: 'content',
    component: 'InputTextArea',
    componentProps: {
      autoSize: {
        //最小显示行数
        minRows: 4,
      },
    },
    colProps: { span: 24 },
  },
  {
    label: '问题设备',
    field: 'equipmentId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '提交人',
    field: 'createBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '提交时间',
    field: 'createTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },
  {
    label: '期望处理时间',
    field: 'expectTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },

  {
    label: '状态',
    field: 'status',
    component: 'Input',
    show: false,
  },
  {
    label: '负责人',
    field: 'responsibleBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '响应时长',
    field: 'responseHours',
    component: 'InputNumber',
    ifShow: ({ values }) => {
      return values.status === 'processing' || values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },
  {
    label: '响应人',
    field: 'responseBy_dictText',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.status === 'processing' || values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },
  {
    label: '响应时间',
    field: 'responseTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    ifShow: ({ values }) => {
      return values.status === 'processing' || values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },

  {
    label: '异常原因',
    field: 'reason',
    component: 'InputTextArea',
    ifShow: ({ values }) => {
      return values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 24 },
  },
  {
    label: '处理措施',
    field: 'measure',
    component: 'InputTextArea',
    ifShow: ({ values }) => {
      return values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 24 },
  },
  {
    label: '处理时长',
    field: 'processHours',
    component: 'InputNumber',
    ifShow: ({ values }) => {
      return values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },
  {
    label: '处理人',
    field: 'processBy_dictText',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },
  {
    label: '处理时间',
    field: 'processTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    ifShow: ({ values }) => {
      return values.status === 'processed' || values.status === 'completed';
    },
    colProps: { span: 12 },
  },

  {
    label: '确认完成人',
    field: 'completeBy_dictText',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.status === 'completed';
    },
    colProps: { span: 12 },
  },
  {
    label: '确认完成时间',
    field: 'completeTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    ifShow: ({ values }) => {
      return values.status === 'completed';
    },
    colProps: { span: 12 },
  },

  {
    label: '撤回人',
    field: 'revokeBy_dictText',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.status === 'canceled';
    },
    colProps: { span: 12 },
  },
  {
    label: '撤回时间',
    field: 'revokeTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    ifShow: ({ values }) => {
      return values.status === 'canceled';
    },
    colProps: { span: 12 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
];

//处理表单配置
export const processFormSchema: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '异常原因',
    field: 'reason',
    component: 'InputTextArea',
    dynamicRules: ({}) => {
      return [{ required: true, message: '异常原因不能为空' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '处理措施',
    field: 'measure',
    component: 'InputTextArea',
    dynamicRules: ({}) => {
      return [{ required: true, message: '处理措施不能为空' }];
    },
    colProps: { span: 24 },
  },
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return detailFormSchema;
}
