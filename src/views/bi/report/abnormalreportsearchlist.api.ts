import { defHttp } from '/@/utils/http/axios';

enum Api {
  abnormalreportsearchlist = '/bi/report/abnormalreportsearchlist', //异常报表
  abnormalreportsearchlistExportUrl = '/bi/report/abnormalreportsearchlistExportUrl', //异常报表
}

export const abnormalreportsearchlist = (params) => defHttp.get({ url: Api.abnormalreportsearchlist, params });

/**
 * 导出api
 * @param params
 */
export const abnormalreportsearchlistExportUrl = Api.abnormalreportsearchlistExportUrl;
