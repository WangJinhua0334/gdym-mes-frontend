import { defHttp } from '/@/utils/http/axios';

enum Api {
  mostationtasksearchlist = '/bi/report/mostationtasksearchlist', //工单在制报表
  mostationtasksearchlistExportUrl = '/bi/report/mostationtasksearchlistExportUrl', //工单在制报表导出
}

export const mostationtasksearchlist = (params) => defHttp.get({ url: Api.mostationtasksearchlist, params });

/**
 * 导出api
 * @param params
 */
export const mostationtasksearchlistExportUrl = Api.mostationtasksearchlistExportUrl;
