import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { render } from '@/utils/common/renderUtils';
import { getTenantId } from '@/utils/auth';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '流转卡号',
    align: 'center',
    dataIndex: 'cardId',
    width: 150,
    fixed: 'left',
  },
  {
    title: '生产厂区',
    align: 'center',
    dataIndex: 'plantNumber',
    customRender: ({ text }) => {
      return render.renderDict(text, 'plant_name', true);
    },
    width: 150,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workshopId_dictText',
    width: 150,
  },
  {
    title: '工序号',
    align: 'center',
    dataIndex: 'operationId_dictText',
    width: 150,
  },
  {
    title: '领料信息',
    width: 200,
    children: [
      {
        title: '领料钢卷',
        align: 'center',
        dataIndex: 'oldCoilNo',
        resizable: true,
        width: 200,
      },
      {
        title: '领料钢卷的物料编码',
        align: 'center',
        dataIndex: 'oldMaterialNumber',
        resizable: true,
        width: 200,
      },
      {
        title: '领料钢卷的物料名称',
        align: 'center',
        dataIndex: 'oldMaterialName',
        resizable: true,
        width: 200,
      },
      {
        title: '领料钢卷的规格型号',
        align: 'center',
        dataIndex: 'oldModelNumber',
        resizable: true,
        width: 200,
      },
      {
        title: '领料钢卷重量',
        align: 'center',
        dataIndex: 'startWeight',
        resizable: true,
        width: 200,
      },
      {
        title: '开工班组',
        align: 'center',
        dataIndex: 'startTeamId_dictText',
        resizable: true,
        width: 150,
      },
      {
        title: '开工时间',
        align: 'center',
        dataIndex: 'startTime',
        resizable: true,
        width: 150,
      },
    ]
  },
  {
    title: '入库信息',
    width: 200,
    children: [
      {
        title: '入库钢卷',
        align: 'center',
        dataIndex: 'newCoilNo',
        resizable: true,
        width: 200,
        // colSpan: 2,
        // customCell: (record, index,  column) =>{
        //   if(!record.newCoilNo){
        //     return {
        //       colSpan: 0
        //     }
        //   }
        // }
      },
      {
        title: '入库钢卷物料编码',
        align: 'center',
        dataIndex: 'newMaterialNumber',
        resizable: true,
        width: 200,
      },
      {
        title: '入库钢卷物料名称',
        align: 'center',
        dataIndex: 'newMaterialName',
        resizable: true,
        width: 200,
      },
      {
        title: '入库钢卷规格型号',
        align: 'center',
        dataIndex: 'newModelNumber',
        resizable: true,
        width: 200,
      },
      {
        title: '入库钢卷重量',
        align: 'center',
        dataIndex: 'endWeight',
        resizable: true,
        width: 200,
      },
      {
        title: '入库班组',
        align: 'center',
        dataIndex: 'endTeamId_dictText',
        resizable: true,
        width: 200,
      },
      {
        title: '入库时间',
        align: 'center',
        dataIndex: 'endTime',
        resizable: true,
        width: 200,
      },
      {
        title: '入库仓库',
        align: 'center',
        dataIndex: 'warehouseId_dictText',
        resizable: true,
        width: 150,
      },
    ]
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ( {text} ) => {
      return render.renderDict(String( text), 'operation_status', true);
    },
    width: 200,
  },
];
//查询数据
export const formSchema: FormSchema[] = [
  {
    label: '流转卡号',
    field: 'cardId',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入流转卡号',
    },
  },
  {
    label: '领料钢卷号',
    field: 'oldCoilNo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '入库钢卷号',
    field: 'newCoilNo',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '生产车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/basic/basWorkShop/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'code,name', code: '${code}' },
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
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        pageSize: 10,
        multi: false,
        maxTagCount: 2,
        placeholder: '请选择',
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '工序',
    field: 'operationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        methods: 'get',
        url: '/basic/operation/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'operationName,operationNumber'},
        columns: [
          {
            name: '编码',
            code: 'operationNumber',
          },
          {
            name: '名称',
            code: 'operationName',
          },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['operationName'],
        pageSize: 10,
        multi: false,
        maxTagCount: 2,
      };
    },
    colProps: { span: 6 },
  },
  {
    label: '开工时间',
    field: 'startTimeRange',
    component: 'RangePicker',
    // colProps: { span: 10 },
    defaultValue: [dayjs().subtract(30, 'day').startOf('day').format("YYYY-MM-DD HH:mm:ss"), dayjs().endOf('day').format("YYYY-MM-DD HH:mm:ss")],
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['请选择开始时间', '请选择结束时间'],
      // 传给后端的时间格式
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      getPopupContainer: () => document.body,
    },
  },
];

// 编辑弹窗表单配置
export const editFormSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'Input', show: false },
  {
    label: '流转卡号',
    field: 'cardId',
    component: 'Input',
    componentProps: { disabled: true },
    colProps: { span: 12 },
  },
  {
    label: '领料钢卷',
    field: 'oldCoilNo',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '领料钢卷重量',
    field: 'startWeight',
    component: 'InputNumber',
    componentProps: { min: 0, style: { width: '100%' } },
    colProps: { span: 12 },
  },
  {
    label: '开工班组',
    field: 'startTeamId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        methods: 'get',
        url: '/basic/basWorkTeam/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [{ name: '编码', code: 'code' }, { name: '名称', code: 'name' }],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        pageSize: 10,
        multi: false,
        placeholder: '请选择',
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '开工时间',
    field: 'startTime',
    component: 'DatePicker',
    componentProps: { showTime: true, format: 'YYYY-MM-DD HH:mm:ss', valueFormat: 'YYYY-MM-DD HH:mm:ss', style: { width: '100%' } },
    colProps: { span: 12 },
  },
  {
    label: '入库钢卷',
    field: 'newCoilNo',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '入库钢卷重量',
    field: 'endWeight',
    component: 'InputNumber',
    componentProps: { min: 0, style: { width: '100%' } },
    colProps: { span: 12 },
  },
  {
    label: '入库班组',
    field: 'endTeamId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        methods: 'get',
        url: '/basic/basWorkTeam/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [{ name: '编码', code: 'code' }, { name: '名称', code: 'name' }],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        pageSize: 10,
        multi: false,
        placeholder: '请选择',
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '入库时间',
    field: 'endTime',
    component: 'DatePicker',
    componentProps: { showTime: true, format: 'YYYY-MM-DD HH:mm:ss', valueFormat: 'YYYY-MM-DD HH:mm:ss', style: { width: '100%' } },
    colProps: { span: 12 },
  },
  {
    label: '入库仓库',
    field: 'warehouseId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        methods: 'get',
        url: '/basic/wareHouse/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [{ name: '编码', code: 'code' }, { name: '名称', code: 'name' }],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        pageSize: 10,
        multi: false,
        placeholder: '请选择仓库',
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: { 
      dictCode: 'operation_status', 
      placeholder: '请选择',
      stringToNumber: true, // 将字典值转换为数字，以匹配后端返回的数字类型
    },
    colProps: { span: 12 },
  },
];


// 打印模板表单配置
export const printFormSchema: FormSchema[] = [
  {
    label: '打印模板',
    field: 'templateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'code', order: 'asc' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        getPopupContainer: () => document.body,
      };
    },
    defaultValue: '1986615937373085698',
    dynamicRules: () => {
      return [{ required: true, message: '请选择打印模板!' }];
    },
  },
];
