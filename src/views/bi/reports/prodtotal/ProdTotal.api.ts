import { defHttp } from '/@/utils/http/axios';

enum Api {
  prodTotal = '/bi/report/prodTotal',
  prodTotalExportUrl = '/bi/report/prodTotalExportUrl',
}

export const prodTotal = (params) => defHttp.get({ url: Api.prodTotal, params });

/**
 * 导出api
 * @param params
 */
export const prodTotalExportUrl = Api.prodTotalExportUrl;
