import { defHttp } from '@/utils/http/axios';

enum Api {
  list = '/etl/deliveryNotice/getAllNotOutboundDeliveryNoticeBill',
  billList = '/mes/deliveryNoticeBill/list',
  billDetailList = '/mes/deliveryNoticeBillDetail/list',
  fallbackSave = '/temporarywork/mesTemporaryWork/add',
  fallbackEdit = '/temporarywork/mesTemporaryWork/edit',
  fallbackListTask = '/mo/mesMoPlan/listMoPlanTaskByMoPlanId',
  fallbackGetEditData = '/mo/mesMoPlan/getEditData',
}

// 销售发货列表查询接口
export const list = (params) => defHttp.get({ url: Api.list, params });

// 根据发货通知单号查询主表信息
export const getBillByBillNo = (params) => defHttp.get({ url: Api.billList, params });

// 查询发货通知单明细
export const getBillDetailList = (params) => defHttp.get({ url: Api.billDetailList, params });

// 兼容旧逻辑：保留原有导出，避免热更新缓存报错
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.fallbackEdit : Api.fallbackSave;
  return defHttp.post({ url, params });
};

export const listMoPlanTaskByMoPlanId = Api.fallbackListTask;
export const getEditData = (params) => defHttp.get({ url: Api.fallbackGetEditData, params });
