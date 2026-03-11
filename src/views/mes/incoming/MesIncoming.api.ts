import { defHttp } from '/@/utils/http/axios';

// 来料单接口
enum Api {
  save = '/etl/receiptMaterial/exportPurchaseReceiptBillAfterInsertDb',
  edit = '/incoming/mesIncoming/edit',
}

/**
 * 保存或更新（收料）
 * 后端 exportPurchaseReceiptBillAfterInsertDb 接收 @RequestBody MaterialReceiptBatchVo
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url, data: params });
};
