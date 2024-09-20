import { defHttp } from '/@/utils/http/axios';

enum Api {
  getReWorkData = '/wip/productrework/getReworkData',
  rework = '/wip/productrework/rework',
  scan = '/wip/productrework/scanSn', //扫描
}
/**
 *
 * @param params 查询能重工的工序节点
 * @returns
 */
export const getReWorkData = (params) => defHttp.get({ url: Api.getReWorkData, params });
/**
 *
 * @param params 重工
 * @returns
 */
export const rework = (params) => defHttp.post({ url: Api.rework, params });
/**
 * 扫描
 * @param params
 */
export const getScan = (params) => {
  return defHttp.get({ url: Api.scan, params });
};
