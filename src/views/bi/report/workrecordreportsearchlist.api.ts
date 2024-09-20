import { defHttp } from '/@/utils/http/axios';

enum Api {
  workrecordreportsearchlist = '/bi/report/workrecordreportsearchlist', //报工记录报表
  workrecordreportsearchlistExportUrl = '/bi/report/workrecordreportsearchlistExportUrl', //报工记录报表
}

export const workrecordreportsearchlist = (params) => defHttp.get({ url: Api.workrecordreportsearchlist, params });

/**
 * 导出api
 * @param params
 */
export const workrecordreportsearchlistExportUrl = Api.workrecordreportsearchlistExportUrl;
