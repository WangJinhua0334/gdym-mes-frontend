import { defHttp } from '/@/utils/http/axios';

enum Api {
  getWokeData = '/wip/productwoke/getWokeData',
  woke = '/wip/productwoke/woke',
  wokeHour = '/wip/productwoke/wokeAndHours',
}
/**
 *
 * @param params 查询报工数据
 * @returns
 */
export const getWokeData = (params) => defHttp.get({ url: Api.getWokeData, params });
/**
 *
 * @param params 报工
 * @returns
 */
export const woke = (params) => defHttp.post({ url: Api.woke, params });

/**
 *
 * @param params 报工
 * @returns
 */
export const wokeHour = (params) => defHttp.post({ url: Api.wokeHour, params });
