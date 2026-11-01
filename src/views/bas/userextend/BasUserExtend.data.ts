import { ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '@/utils/common/renderUtils';
import { useUserStore } from '@/store/modules/user';
import {getTenantId} from "@/utils/auth";

/**
 * 编辑回显用的当前工序。
 * 工序档案主键是整数，这里保持整数，便于和表单里的工序主键对上并显示工序名称。
 */
export const operationEchoOptions = ref<Recordable[]>([]);
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    align: 'center',
    dataIndex: 'userId',
    ifShow: false,
  },
  {
    title: '用户账号',
    align: 'center',
    dataIndex: 'userName',
    width: 150,
  },
  {
    title: '真实姓名',
    align: 'center',
    dataIndex: 'realName',
    width: 150,
  },
  {
    title: '所属组织',
    align: 'center',
    dataIndex: 'orgName',
    width: 150,
  },
  // {
  //   title: '备注',
  //   align: 'center',
  //   dataIndex: 'remark',
  //   width: 200,
  // },
  // {
  //   title: '标准工时(元/时)',
  //   align: 'center',
  //   dataIndex: 'standardMoney',
  //   width: 150,
  // },
  // {
  //   title: '工作日加班工时(元/时)',
  //   align: 'center',
  //   dataIndex: 'workMoney',
  //   width: 150,
  // },
  // {
  //   title: '休息日加班工时(元/时)',
  //   align: 'center',
  //   dataIndex: 'restMoney',
  //   width: 150,
  // },
  // {
  //   title: '节假日加班工时(元/时)',
  //   align: 'center',
  //   dataIndex: 'holidaysMoney',
  //   width: 150,
  // },
  {
    title: '生产厂区',
    align: 'center',
    dataIndex: 'plantName_dictText',
    width: 150,
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptName',
    width: 150,
  },
  {
    title: '生产车间',
    align: 'center',
    dataIndex: 'workShopName',
    width: 150,
  },
  {
    title: '班组',
    align: 'center',
    dataIndex: 'workTeamName',
    width: 150,
  },
  {
    title: '仓库',
    align: 'center',
    dataIndex: 'wareHouseName',
    width: 150,
  },
  {
    title: '默认仓位',
    align: 'center',
    dataIndex: 'defaultLocationId_dictText',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'operationName',
    width: 150,
  },
  {
    title: '设备',
    align: 'center',
    dataIndex: 'equipmentName',
    width: 150,
  },
  {
    title: '打印模板',
    align: 'center',
    dataIndex: 'printTemplateName',
    width: 150,
  },
  {
    title: '称重放行权限',
    align: 'center',
    dataIndex: 'hasPermission',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 1, isChecked: true },
        { text: '否', value: 0, isChecked: false },
      ]);
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '用户账号',
    field: 'userName',
    component: 'JInput',
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'JInput',
  },
  {
    label: '生产厂区',
    field: 'plantName',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'plant_name',
      triggerChange: true,
      placeholder: '请选择生产厂区',
      showCode: true,
      showSearch: true,
    },
  },
  {
    label: '部门',
    field: 'deptId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/sys/sysDepart/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'id,departName,orgCode',
        },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'orgCode' },
          { name: '名称', code: 'departName' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['departName'],
        placeholder: '请选择部门',
        multi: false,
      };
    },
  },
  {
    label: '班组',
    field: 'workTeamId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/basic/basWorkTeam/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'id,name,code',
        },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择班组',
        multi: false,
      };
    },
  },
  {
    label: '仓库',
    field: 'wareHouseId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/basic/wareHouse/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'id,name,code',
        },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择仓库',
        multi: false,
        // 仓库变了，原先选的仓位不一定还属于这个仓库
        onChange: () => {
          setFieldsValue({
            defaultLocationId: undefined,
          });
        },
      };
    },
  },
  {
    label: '仓位',
    field: 'defaultLocationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/warehousearea/basWarehouseArea/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'code,name',
        },
        columns: [
          { name: '编码', code: 'code' },
          { name: '区域名称', code: 'name' },
        ],
        queryBefore: (params) => {
          const wareHouseId = getFieldsValue().wareHouseId;
          if (wareHouseId) {
            params.whId = wareHouseId;
          }
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择仓位',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    label: '工序',
    field: 'operationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/basic/operation/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'id,operationNumber,operationName',
        },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'operationNumber' },
          { name: '名称', code: 'operationName' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['operationName'],
        placeholder: '请选择工序',
        multi: false,
      };
    },
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
    label: '用户',
    field: 'userId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        pageSize: 20,
        params: {
          column: 'id',
          order: 'asc',
          searchFields: 'username,realname,workNo',
        },
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
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['realname'],
        placeholder: '请输入账号、姓名或工号',
        multi: false,
        linkmap: [
          { realname: 'realName' },
          { username: 'userName' }
        ],
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择用户' }];
    },
  },
  {
    label: '用户账号',
    field: 'userName',
    component: 'Input',
    show: false,
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '生产厂区',
    // label: '生产厂区编号',
    field: 'plantName',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'plant_name',
      triggerChange: true,
      placeholder: '请选择生产厂区',
      showCode: true,
      showSearch: true,
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择生产厂区' }];
    },
  },
  {
    label: '部门',
    // label: '部门编号',
    field: 'deptId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/sysDepart/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,departName,orgCode'},
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'orgCode'},
          { name: '名称', code: 'departName'},
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['departName'],
        linkmap: [
          { orgCode:'deptNumber' },
          { departName:'deptName' },
        ],
        placeholder: '请选择生产车间',
        multi: false,
      }
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择部门' }];
    },
  },
  {
    label: '部门名称',
    field: 'deptName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '生产车间编码',
    field: 'deptNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '仓库',
    // label: '仓库编号',
    field: 'wareHouseId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/wareHouse/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{
          // id:'wareHouseId',//仓库编号
          code:'wareHouseNumber',//仓库编号
          name:'wareHouseName',//仓库名称
        }, {
          isOpenLocation: 'warehouseIsOpenLocation',
          defaultLocationId: 'defaultLocationId',
        }],
      }
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择仓库' }];
    },
  },
  {
    label: '仓库编码',
    field: 'wareHouseNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '仓库名称',
    field: 'wareHouseName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '仓位管理状态',
    field: 'warehouseIsOpenLocation',
    component: 'Input',
    show: false,
  },
  {
    label: '生产班组',
    // label: '生产班组编号',
    field: 'workTeamId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basWorkTeam/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{
          name:'workTeamName',//班组名称
          code:'workTeamNumber',//班组编号
        }]
      }
    },
  },
  {
    label: '生产班组编码',
    field: 'workTeamNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '生产班组名称',
    field: 'workTeamName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '生产车间',
    // label: '生产车间编号',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basWorkShop/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code'},
          { name: '名称', code: 'name'},
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [
          { code:'workShopNumber' },
          { name:'workShopName' },
        ],
        placeholder: '请选择生产车间',
        multi: false,
      }
    },
  },
  {
    label: '生产车间名称',
    field: 'workShopName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '生产车间编码',
    field: 'workShopNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '工序',
    // label: '工序编号',
    field: 'operationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/operation/list',
        params: {
          column: 'createTime', order: 'desc',
          searchFields: 'id,operationNumber,operationName',
        },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'operationNumber' },
          { name: '名称', code: 'operationName' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['operationName'],
        dictOptions: operationEchoOptions.value,
        linkmap: [
          {
            operationNumber: 'operationNumber',
            operationName: 'operationName',
          },
        ],
      };
    },
  },
  {
    label: '工序编码',
    field: 'operationNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '工序名称',
    field: 'operationName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '默认仓位',
    field: 'defaultLocationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue,
        getFieldsValue,
        method: 'get',
        url: '/warehousearea/basWarehouseArea/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'code,name',
        },
        columns: [
          { name: '编码', code: 'code' },
          { name: '区域名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.whId = getFieldsValue().wareHouseId;
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择默认仓位',
        getPopupContainer: () => document.body,
      };
    },
    ifShow: ({ values }) => values.warehouseIsOpenLocation === 'Y',
  },
  {
    label: '设备',
    // label: '设备分类编号',
    field: 'equipmentId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/basic/basEquipment/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name,code' },
        columns: [
          { name: '编号', code: 'id' },
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{
          // id:'equipmentTypeId',//设备分类编号
          code:'equipmentNumber',//设备分类编号
          name:'equipmentName',//设备分类名称
        }]
      }
    },
  },
  {
    label: '设备编码',
    field: 'equipmentNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '设备名称',
    field: 'equipmentName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '打印模板',
    // label: '仓库编号',
    field: 'printTemplateId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: { column: 'createTime', order: 'desc', searchFields: 'id,name' },
        columns: [
          { name: 'id', code: 'id' },
          { name: '名称', code: 'name' },
        ],
        queryBefore: (params) => {
          params.tenantId = getTenantId();
          return params;
        },
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        linkmap: [{
          name:'printTemplateName',
          code: 'printTemplateNumber',
        }]
      }
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择打印模板' }];
    },
  },
  {
    label: '打印模板名称',
    field: 'printTemplateName',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '打印模板编码',
    field: 'printTemplateNumber',
    component: 'Input',
    dynamicDisabled: true,
    show: false,
  },
  {
    label: '称重放行',
    field: 'hasPermission',
    component: 'Switch',
    defaultValue: '0',
    componentProps: {
      //开关大小，可选值：default small
      size:'default',
      //非选中时的内容
      unCheckedChildren:'否',
      //非选中时的值
      unCheckedValue: 0,
      //选中时的内容
      checkedChildren:'是',
      //选中时的值
      checkedValue: 1,
      //是否禁用
      disabled: false,
    },
  },
  {
    label: '租户 Id',
    field: 'tenantId',
    component: 'Input',
    defaultValue: useUserStore().getTenant,
    dynamicDisabled: true,
    show: false,
  }
];

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
