import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  // {
  //   title: '编码',
  //   align: 'center',
  //   sorter: true,
  //   dataIndex: 'code',
  // },
  {
    title: '文件名',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 400,
  },
  {
    title: '文件版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '文件分类',
    align: 'center',
    dataIndex: 'category_dictText',
  },
  // {
  //   title: '文件',
  //   align: 'center',
  //   dataIndex: 'file',
  //   slots: { customRender: 'fileSlot' },
  // },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
