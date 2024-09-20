import { defHttp } from '/@/utils/http/axios';

enum Api {
  listBind = '/wip/productbind/pageBindList',
  exportBindXls = '/wip/productbind/exportBindListXls',
  listUnbind = '/wip/productbind/pageUnbindList',
  exportUnbindXls = '/wip/productbind/exportUnbindListXls',
}

/**
 *
 * @param params 查询物料绑定记录
 * @returns
 */
export const listBind = (params) => defHttp.get({ url: Api.listBind, params });
/**
 * 导出物料绑定记录api
 * @param params
 */
export const exportBindXls = Api.exportBindXls;
/**
 *
 * @param params 查询物料解绑记录
 * @returns
 */
export const listUnbind = (params) => defHttp.get({ url: Api.listUnbind, params });
/**
 * 导出物料解绑记录api
 * @param params
 */
export const exportUnbindXls = Api.exportUnbindXls;
