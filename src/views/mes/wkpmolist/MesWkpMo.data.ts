import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

export const scanSn = ref<any>();

export const formSchema: FormSchema[] = [
  {
    label: '扫描流转卡',
    field: 'sn',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '请扫描流转卡',
      onkeyup: function (e) {
        if (e.key == 'Enter') {
          unref(scanSn)(e.target.value);
        }
      },
    },
  },
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
    label: '流转卡号',
    field: 'snId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mo/mesMoSn/list',
        params: {},
        columns: [
          {
            title: '流转卡号',
            align: 'center',
            dataIndex: 'sn',
          },
          {
            title: '流转卡类型',
            align: 'center',
            dataIndex: 'snType_dictText',
          },
          {
            title: '任务单号',
            align: 'center',
            dataIndex: 'moPlanId_dictText',
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
        ],
        queryInfo: [
          {
            field: 'sn',
            label: '流转卡号',
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
        labelKey: ['sn'],
        placeholder: '请选择',
        multi: true,
        getPopupContainer: (node) => node.parentNode,
        queryBefore: function (params) {
          if (getFieldsValue().moId && getFieldsValue().moId.length > 0) {
            params.moId = getFieldsValue().moId;
          } else {
            params.moId = -1;
          }
          return params;
        },
      };
    },
  },
  {
    label: '作业员',
    field: 'wokerBy',
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
        getPopupContainer: (node) => document.body,
      };
    },
  },
  {
    label: '是否校验工单',
    field: 'isCheck',
    defaultValue: 'N',
    component: 'JSwitch',
    helpMessage: ({ values }) => {
      return '开启之后，这个工位不属于这个工单的流转卡，就无法操作';
    },
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否检验物料',
    field: 'isCheckProd',
    defaultValue: 'Y',
    component: 'JSwitch',
    helpMessage: ({ values }) => {
      return '开启之后，上料时会校验这个流转卡是否需要该物料信息，不需要无法上料';
    },
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否分配工时',
    field: 'isHour',
    defaultValue: 'Y',
    component: 'JSwitch',
    helpMessage: ({ values }) => {
      return '开启之后，报工产生的工时会平均分配给绑定的作业员；不开启，则默认全部分配给报工人';
    },
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
    field: 'file',
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
    title: '流转卡',
    align: 'center',
    sorter: true,
    dataIndex: 'snId_dictText',
    width: 400,
  },
  {
    title: '作业员',
    align: 'center',
    sorter: true,
    dataIndex: 'wokerBy_dictText',
    width: 400,
  },
  {
    title: '是否校验工单',
    align: 'center',
    dataIndex: 'isCheck',
    width: 120,
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
    title: '是否分配工时',
    align: 'center',
    dataIndex: 'isHour',
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
    dataIndex: 'file',
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
    field: 'file',
    component: 'JUpload',
    /*component: 'JUploadCustom',
      componentProps: {
        uploadType: ['camera', 'uplaod'],
      },*/
    colProps: { span: 24 },
  },
];
