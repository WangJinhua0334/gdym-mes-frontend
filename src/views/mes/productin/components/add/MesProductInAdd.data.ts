import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { ref, computed, unref, reactive } from 'vue';
export const doEnterPress = ref();

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '计划入库时间',
    field: 'planInDate',
    component: 'DatePicker',
    componentProps: {
      //日期格式化，页面上显示的值
      format: 'YYYY-MM-DD',
      //返回值格式化（绑定值的格式）
      valueFormat: 'YYYY-MM-DD',
      //是否显示今天按钮
      showToday: true,
    },
  },
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doEnterPress.value = Math.random();
        }
      },
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

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工单',
    align: 'center',
    width: 150,
    dataIndex: 'moId_dictText',
  },
  {
    title: '产品',
    align: 'center',
    width: 150,
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    width: 300,
    dataIndex: 'prodName_dictText',
  },
  {
    title: '生产批次',
    align: 'center',
    width: 80,
    dataIndex: 'batch',
  },
  {
    title: '条码',
    align: 'center',
    width: 80,
    dataIndex: 'lotSn',
  },
  {
    title: '数量',
    align: 'center',
    width: 80,
    dataIndex: 'lotQty',
  },
];
