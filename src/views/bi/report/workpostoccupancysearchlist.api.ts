import { defHttp } from '/@/utils/http/axios';

enum Api {
  workpostoccupancysearchlist = '/bi/report/workpostoccupancysearchlist', //工位占用情况
  workpostoccupancysearchlistExportUrl = '/bi/report/workpostoccupancysearchlistExportUrl', //工位占用情况导出
}

export const workpostoccupancysearchlist = (params) => defHttp.get({ url: Api.workpostoccupancysearchlist, params });

/**
 * 导出api
 * @param params
 */
export const workpostoccupancysearchlistExportUrl = Api.workpostoccupancysearchlistExportUrl;
