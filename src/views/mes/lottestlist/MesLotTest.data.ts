import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

//调试记录列表配置
export const testListColumns: BasicColumn[] = [
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
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'lot_test_status', true);
    },
  },
  {
    title: '结果',
    align: 'center',
    dataIndex: 'result',
    width: 100,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '缺陷代码',
    align: 'center',
    dataIndex: 'defectIds_dictText',
    width: 120,
  },
  {
    title: '设备',
    align: 'center',
    sorter: true,
    dataIndex: 'equipmentId_dictText',
    width: 120,
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
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '测试人',
    align: 'center',
    sorter: true,
    dataIndex: 'testBy_dictText',
    width: 120,
  },
  {
    title: '测试时间',
    align: 'center',
    sorter: true,
    dataIndex: 'testTime',
    width: 160,
  },
];
//调试记录列表查询配置
export const testListSearchFormSchema: FormSchema[] = [
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
    label: '设备',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/basEquipment/list',
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
        queryBefore: (params) => {
          params.notStatus = 'discard';
          return params;
        },
      };
    },
    colProps: { span: 6 },
  },
];

//子表列表数据
export const testItemColumns: BasicColumn[] = [
  {
    title: '代码',
    align: 'center',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
    width: 160,
  },
  {
    title: '测试标识',
    align: 'center',
    dataIndex: 'testTag_dictText',
    width: 100,
  },
  {
    title: '下限比较符',
    align: 'center',
    dataIndex: 'minOperators_dictText',
    width: 120,
  },
  {
    title: '下限',
    align: 'center',
    dataIndex: 'limitMin',
    width: 120,
  },
  {
    title: '上限比较符',
    align: 'center',
    dataIndex: 'maxOperators_dictText',
    width: 120,
  },
  {
    title: '上限',
    align: 'center',
    dataIndex: 'limitMax',
    width: 120,
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unitId_dictText',
    width: 100,
  },
  {
    title: '测试值',
    align: 'center',
    dataIndex: 'value',
    width: 120,
  },
  {
    title: '测试结果',
    align: 'center',
    dataIndex: 'result',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
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
