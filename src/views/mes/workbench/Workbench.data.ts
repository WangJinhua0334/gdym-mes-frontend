import { ref, unref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';
import { render } from '/@/utils/common/renderUtils';
import { useValidateRules } from '/@/components/jeecg/JVxeTable/src/hooks/useValidateRules';

export const wkpId = ref('');

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
    slots: { customRender: 'taskCard' },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '车间',
    field: 'workShop',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        getPopupContainer: (node) => document.body,
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
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
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        placeholder: '请输入',
        onChange: (data) => {
          setFieldsValue({ workCenter: null });
          setFieldsValue({ workPost: null });
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择车间!' }];
    },
  },
  {
    label: '工作中心',
    field: 'workCenter',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        getPopupContainer: (node) => document.body,
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workcenter/basWorkCenter/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name', workShopId: '${workShop}' },
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
        //linkmap: [{ workShopId: 'workShop' }],
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        placeholder: '请输入',
        onChange: (data) => {
          setFieldsValue({ workPost: null });

          if (!data) return;

          defHttp
            .get({
              url: '/workcenter/basWorkCenter/list',
              params: {
                id: data,
              },
            })
            .then((res) => {
              if (res && res.records.length > 0) {
                setFieldsValue({ workShop: res.records[0].workShopId });
              }
            });
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工作中心!' }];
    },
  },
  {
    label: '工位',
    field: 'workPost',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        getPopupContainer: (node) => document.body,
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workpost/basWorkPost/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
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
        //linkmap: [{ wkcId: 'workCenter' }],
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        placeholder: '请输入',
        onChange: (data) => {
          wkpId.value = data;
          if (!unref(wkpId)) return;

          defHttp
            .get({
              url: '/workpost/basWorkPost/list',
              params: {
                id: unref(wkpId),
              },
            })
            .then((wkpRes) => {
              if (!wkpRes.records || wkpRes.records.length <= 0) return;

              const wkcId = getFieldsValue().workCenter;
              if (wkcId && wkcId == wkpRes.records[0].wkcId) return;

              defHttp
                .get({
                  url: '/workcenter/basWorkCenter/list',
                  params: {
                    id: wkpRes.records[0].wkcId,
                  },
                })
                .then((res) => {
                  if (res && res.records.length > 0) {
                    setFieldsValue({ workShop: res.records[0].workShopId });
                    setFieldsValue({ workCenter: wkpRes.records[0].wkcId });
                  }
                });
            });
        },
        queryBefore: (params) => {
          const workCenterId = getFieldsValue().workCenter;
          const workShopId = getFieldsValue().workShop;
          if (!!workCenterId) {
            params.wkcId = workCenterId;
          } else if (!!workShopId) {
            params.workShopId = workShopId;
          }

          return params;
        },
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择工位!' }];
    },
  },
];

// 用户切换数据
export const swichUserSchema: FormSchema[] = [
  {
    label: '账号',
    field: 'username',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入账号!' }];
    },
  },
  {
    label: '密码',
    field: 'password',
    component: 'InputPassword',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入密码!' }];
    },
  },
];
