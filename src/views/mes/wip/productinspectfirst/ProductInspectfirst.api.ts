import { defHttp } from '/@/utils/http/axios';

enum Api {
  getInspectData = '/wip/productinspectfirst/getInspectData',
  inspect = '/wip/productinspectfirst/inspect',
}
/**
 *
 * @param params 查询检验数据
 * @returns
 */
export const getInspectData = (params) => defHttp.get({ url: Api.getInspectData, params });
/**
 *
 * @param params 保存检验数据
 * @returns
 */
export const saveInspect = (params) => defHttp.post({ url: Api.inspect, params });
