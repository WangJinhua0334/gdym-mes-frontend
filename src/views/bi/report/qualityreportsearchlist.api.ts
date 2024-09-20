import { defHttp } from '/@/utils/http/axios';

enum Api {
  qualityreportsearchlist = '/bi/report/qualityreportsearchlist', //质量报表
  qualityreportsearchlistExportUrl = '/bi/report/qualityreportsearchlistExportUrl', //质量报表
}

export const qualityreportsearchlist = (params) => defHttp.get({ url: Api.qualityreportsearchlist, params });

/**
 * 导出api
 * @param params
 */
export const qualityreportsearchlistExportUrl = Api.qualityreportsearchlistExportUrl;
