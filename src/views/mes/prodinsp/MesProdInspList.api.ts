import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/prodinsp/mesprodInsp/list',
  exportXls = '/prodinsp/mesprodInsp/exportXls',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
