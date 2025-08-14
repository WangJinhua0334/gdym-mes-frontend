import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/mo/mopack/list',
  exportXls = '/mo/mopack/exportXls',
  scranPack = '/mo/mopack/scranPack',
  pack = '/mo/mopack/pack',
  updatePack = '/mo/mopack/updatePack',
}

/**
 *
 * @param params 包装信息查询
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 导出工位包装信息查询api
 * @param params
 */
export const exportXls = Api.exportXls;

/**
 *
 * @param params 包装查询
 * @returns
 */
export const scranPack = (params) => defHttp.get({ url: Api.scranPack, params });

/**
 *
 * @param params 包装
 * @returns
 */
export const pack = (params) => defHttp.post({ url: Api.pack, params });

/**
 *
 * @param params 修改信息
 * @returns
 */
export const updatePack = (params) => defHttp.post({ url: Api.updatePack, params });
