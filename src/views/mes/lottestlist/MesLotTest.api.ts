import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wip/producttest/pageList',
  exportUrl = '/wip/producttest/exportXls',
  listTestItemById = '/wip/producttest/listTestItemById',
}

/**
 *
 * @param params 查询调试记录
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 导出调试记录api
 * @param params
 */
export const exportUrl = Api.exportUrl;

/**
 *
 * @param params 查询调试项列表
 * @returns
 */
export const listTestItemById = (params) => defHttp.get({ url: Api.listTestItemById, params });
