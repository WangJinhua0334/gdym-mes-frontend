import { defHttp } from '/@/utils/http/axios';

enum Api {
  prodreport = '/bi/report/prodreport', //车间在制库存报表
  prodreportExportUrl = '/bi/report/prodreportExportUrl', //车间在制库存报表
}

export const prodreport = (params) => defHttp.get({ url: Api.prodreport, params });

/**
 * 导出api
 * @param params
 */
export const prodreportExportUrl = Api.prodreportExportUrl;
