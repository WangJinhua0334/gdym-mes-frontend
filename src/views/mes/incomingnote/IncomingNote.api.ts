import { defHttp } from '/@/utils/http/axios';

// 收料记录接口地址
enum Api {
  // 收料记录查询接口（复用收料接口）
  list = '/mes/inComing/purchaseReceiptBillDetail/list',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

