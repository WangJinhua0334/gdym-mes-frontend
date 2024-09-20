import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types'
import { ref, computed, unref, reactive } from 'vue';
export const doEnterPress = ref();




//列表数据
export const columns: BasicColumn[] = [
    {
        title: '条码',
        align: "center",
        width: 150,
        dataIndex: 'lotSn'
    },
    {
        title: '数量',
        align: "center",
        width: 80,
        dataIndex: 'qty'
    },
 
];
