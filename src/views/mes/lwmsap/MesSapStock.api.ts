import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/apiService/sapApi/selectStockFromSapFromMOM',
}
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.post({ url: Api.list, params });
