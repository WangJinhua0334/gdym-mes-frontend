import { defHttp } from '/@/utils/http/axios';

enum Api {
  scanUpMould = '/mod/usedRecord/scanUpMould',
  scanDownMould = '/mod/usedRecord/scanDownMould',
  upMould = '/mod/usedRecord/upMould',
  downMould = '/mod/usedRecord/downMould',
}
/**
 *
 * @param params 查询模具上机信息
 * @returns
 */
export const scanUpMould = (params) => defHttp.get({ url: Api.scanUpMould, params });
/**
 *
 * @param params 查询模具下机信息
 * @returns
 */
export const scanDownMould = (params) => defHttp.get({ url: Api.scanDownMould, params });
/**
 *
 * @param params 上模
 * @returns
 */
export const upMould = (params) => defHttp.post({ url: Api.upMould, params });
/**
 *
 * @param params 下模
 * @returns
 */
export const downMould = (params) => defHttp.post({ url: Api.downMould, params });
