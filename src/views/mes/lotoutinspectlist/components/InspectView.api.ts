import { defHttp } from '/@/utils/http/axios';

enum Api {
  getInspectData = '/wip/productoutinspect/getInspectDataDetail',
}
/**
 *
 * @param params 查询检验数据
 * @returns
 */
export const getInspectData = (params) => defHttp.get({ url: Api.getInspectData, params });
