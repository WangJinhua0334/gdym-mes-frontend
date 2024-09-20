import { defHttp } from '/@/utils/http/axios';

enum Api {
  productingsearchlist = '/bi/report/productingsearchlist', //工单在制报表
  productingsearchlistExportUrl = '/bi/report/productingsearchlistExportUrl', //工单在制报表导出
}

export const productingsearchlist = (params) => defHttp.get({ url: Api.productingsearchlist, params });

/**
 * 导出api
 * @param params
 */
export const productingsearchlistExportUrl = Api.productingsearchlistExportUrl;
