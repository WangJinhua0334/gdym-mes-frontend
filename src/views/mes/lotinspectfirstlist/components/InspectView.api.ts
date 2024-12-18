import { defHttp } from '/@/utils/http/axios';

enum Api {
  getInspectData = '/wip/productinspectfirst/getInspectDataDetail',
}
/**
 *
 * @param params 查询检验数据
 * @returns
 */
export const getInspectData = (params) => defHttp.get({ url: Api.getInspectData, params });
