import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '文件名',
    align: 'center',
    sorter: true,
    dataIndex: 'fileName',
    width: 400,
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },

  //  {
  //   title: '文件',
  //   align:"center",
  //   dataIndex: 'url',
  //   slots: { customRender: 'fileSlot' },
  // },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
