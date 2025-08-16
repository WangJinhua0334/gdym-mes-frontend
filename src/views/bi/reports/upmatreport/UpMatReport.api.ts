import { defHttp } from '/@/utils/http/axios';

enum Api {
  upmatreport = '/bi/report/upmatreport', //车间在制库存报表
  upmatreportExportUrl = '/bi/report/upmatreportExportUrl', //车间在制库存报表
}

export const upmatreport = (params) => defHttp.get({ url: Api.upmatreport, params });

/**
 * 导出api
 * @param params
 */
export const upmatreportExportUrl = Api.upmatreportExportUrl;
