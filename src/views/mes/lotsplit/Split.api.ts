import { defHttp } from '/@/utils/http/axios';

enum Api {
  split = '/wip/productsplit/split',
  getSplitData = '/wip/productsplit/getSplitData', //扫描
}

/**
 *
 * @param params 拆批
 * @returns
 */
export const split = (params) => defHttp.post({ url: Api.split, params });

/**
 * 查询拆批数据
 * @param params
 */
export const getSplitData = (params) => {
  return defHttp.get({ url: Api.getSplitData, params });
};
