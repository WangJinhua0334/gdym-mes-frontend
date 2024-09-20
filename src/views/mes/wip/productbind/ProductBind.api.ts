import { defHttp } from '/@/utils/http/axios';

enum Api {
  getBindData = '/wip/productbind/getBindData',
  scan = '/wip/productbind/scan',
  bind = '/wip/productbind/bind',
  unbind = '/wip/productbind/unbind',
  bindReplace = '/wip/productbind/bindReplace',
}
/**
 *
 * @param params 查询物料绑定信息
 * @returns
 */
export const getBindData = (params) => defHttp.get({ url: Api.getBindData, params });
/**
 *
 * @param params 扫描物料条码
 * @returns
 */
export const scan = (params) => defHttp.get({ url: Api.scan, params });
/**
 *
 * @param params 物料条码绑定
 * @returns
 */
export const bind = (params) => defHttp.post({ url: Api.bind, params });
/**
 *
 * @param params 物料条码解绑
 * @returns
 */
export const unbind = (params) => defHttp.post({ url: Api.unbind, params });
/**
 *
 * @param params 物料条码替换
 * @returns
 */
export const bindReplace = (params) => defHttp.post({ url: Api.bindReplace, params });
