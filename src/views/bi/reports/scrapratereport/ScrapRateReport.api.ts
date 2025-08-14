import { defHttp } from '/@/utils/http/axios';

enum Api {
  scrapratereport = '/bi/report/scrapratereport',
  scrapratereportExportUrl = '/bi/report/scrapratereportExportUrl',
}

export const scrapratereport = (params) => defHttp.get({ url: Api.scrapratereport, params });

/**
 * 导出api
 * @param params
 */
export const scrapratereportExportUrl = Api.scrapratereportExportUrl;
