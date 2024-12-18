import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wip/productinspectfirst/list',
  exportXls = '/wip/productinspectfirst/exportXls',
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
