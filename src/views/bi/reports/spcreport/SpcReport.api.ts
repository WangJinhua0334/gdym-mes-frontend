import { defHttp } from '/@/utils/http/axios';

enum Api {
  spcreport = '/bi/report/spcreport',
  spcreportExportUrl = '/bi/report/spcreportExportUrl',
}

export const spcreport = (params) => defHttp.get({ url: Api.spcreport, params });

/**
 * 导出api
 * @param params
 */
export const spcreportExportUrl = Api.spcreportExportUrl;
