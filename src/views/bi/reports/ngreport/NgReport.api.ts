import { defHttp } from '/@/utils/http/axios';

enum Api {
  ngreport = '/bi/report/ngreport', //异常报表
  ngreportExportUrl = '/bi/report/ngreportExportUrl', //异常报表
}

export const ngreport = (params) => defHttp.get({ url: Api.ngreport, params });

/**
 * 导出api
 * @param params
 */
export const ngreportExportUrl = Api.ngreportExportUrl;
