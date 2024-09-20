import { defHttp } from '/@/utils/http/axios';

enum Api {
  productionList = '/bi/report/productionList', //工单在制报表
  productionExportUrl = '/bi/report/productionExportUrl', //工单在制报表导出
}

export const productionList = (params) => defHttp.get({ url: Api.productionList, params });

/**
 * 导出api
 * @param params
 */
export const productionExportUrl = Api.productionExportUrl;
