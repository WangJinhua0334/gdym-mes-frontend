import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wip/productsplit/list', //获取列表
  queryLotSnPrintMapByIds = '/wip/productsplit/queryLotSnPrintMapByIds', //打印
}

/**
 * 查询拆批数据
 * @param params
 */
export const list = (params) => {
  return defHttp.get({ url: Api.list, params });
};

/**
 * 打印
 * @param params
 */
export const queryLotSnPrintMapByIds = (params) => defHttp.get({ url: Api.queryLotSnPrintMapByIds, params });
