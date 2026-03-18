import { defHttp } from '/@/utils/http/axios';

// 收料记录接口地址
enum Api {
  // 收料记录查询接口（复用收料接口）
  list = '/mes/inComing/purchaseReceiptBillDetail/list',
  // 编辑收料记录
  edit = '/mes/inComing/purchaseReceiptBillDetail/edit',
  // 删除收料记录
  deleteOne = '/mes/inComing/purchaseReceiptBillDetail/delete',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 编辑收料记录
 * @param params
 */
export const edit = (params) => defHttp.put({ url: Api.edit, params });

/**
 * 删除收料记录
 * @param params
 * @param handleSuccess
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess && handleSuccess();
  });
};

