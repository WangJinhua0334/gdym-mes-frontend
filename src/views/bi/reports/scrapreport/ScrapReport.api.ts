import { defHttp } from '/@/utils/http/axios';

enum Api {
  scrapreport = '/bi/report/scrapreport', //异常报表
  scrapreportExportUrl = '/bi/report/scrapreportExportUrl', //异常报表
  list = '/lotscrap/mesLotScrap/list',
  exportXls = '/lotscrap/mesLotScrap/exportXls',
}

export const scrapreport = (params) => defHttp.get({ url: Api.scrapreport, params });

/**
 * 导出api
 * @param params
 */
export const scrapreportExportUrl = Api.scrapreportExportUrl;

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
