import { defHttp } from '/@/utils/http/axios';

enum Api {
  scranUpMat = '/wip/productwkp/scranUpMat',
  scranDownMat = '/wip/productwkp/scranDownMat',
  upMat = '/wip/productwkp/upMat',
  downMat = '/wip/productwkp/downMat',
  deductList = '/wip/productwkp/deductList',
  deduct = '/wip/productwkp/deduct',
}
/**
 *
 * @param params 上料查询
 * @returns
 */
export const scranUpMat = (params) => defHttp.get({ url: Api.scranUpMat, params });
/**
 *
 * @param params 下料查询
 * @returns
 */
export const scranDownMat = (params) => defHttp.get({ url: Api.scranDownMat, params });
/**
 *
 * @param params 上料
 * @returns
 */
export const upMat = (params) => defHttp.post({ url: Api.upMat, params });
/**
 *
 * @param params 下料
 * @returns
 */
export const downMat = (params) => defHttp.post({ url: Api.downMat, params });
/**
 *
 * @param params 扣料检验
 * @returns
 */
export const deductList = (params) => defHttp.get({ url: Api.deductList, params });
/**
 *
 * @param params 扣料
 * @returns
 */
export const deduct = (params) => defHttp.post({ url: Api.deduct, params });
