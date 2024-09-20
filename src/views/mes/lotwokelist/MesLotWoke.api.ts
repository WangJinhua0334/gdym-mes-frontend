import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wip/productwoke/pageList',
  exportUrl = '/wip/productwoke/exportXls',
}

/**
 *
 * @param params 查询报工记录
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 导出报工记录api
 * @param params
 */
export const exportUrl = Api.exportUrl;
