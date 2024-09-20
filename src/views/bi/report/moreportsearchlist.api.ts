import { defHttp } from '/@/utils/http/axios';

enum Api {
  moreportsearchlist = '/bi/report/moreportsearchlist', //工单在制报表
  moreportsearchlistExportUrl = '/bi/report/moreportsearchlistExportUrl', //工单在制报表
}

export const moreportsearchlist = (params) => defHttp.get({ url: Api.moreportsearchlist, params });

/**
 * 导出api
 * @param params
 */
export const moreportsearchlistExportUrl = Api.moreportsearchlistExportUrl;
