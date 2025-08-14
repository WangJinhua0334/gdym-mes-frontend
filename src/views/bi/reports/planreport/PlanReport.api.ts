import { defHttp } from '/@/utils/http/axios';

enum Api {
  planreport = '/bi/report/planreport', //日计划报表
  planreportExportUrl = '/bi/report/planreportExportUrl', //日计划报表
  list = '/mo/mesMoSnStation/list',
}

export const planreport = (params) => defHttp.get({ url: Api.planreport, params });

/**
 * 导出api
 * @param params
 */
export const planreportExportUrl = Api.planreportExportUrl;


/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
