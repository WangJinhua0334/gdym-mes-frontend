import { BasicColumn, FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';

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
    title: '测试值',
    align: 'center',
    dataIndex: 'value',
    width: 120,
  },
  {
    title: '测试结果',
    align: 'center',
    dataIndex: 'result',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
    width: 120,
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
