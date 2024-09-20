import { defHttp } from '/@/utils/http/axios';

enum Api {
  getOutInspectData = '/wip/productoutinspect/getOutInspectData',
  outInspect = '/wip/productoutinspect/outInspect',
}
/**
 *
 * @param params 查询检验数据
 * @returns
 */
export const getOutInspectData = (params) => defHttp.get({ url: Api.getOutInspectData, params });
/**
 *
 * @param params 保存检验数据
 * @returns
 */
export const saveOutInspect = (params) => defHttp.post({ url: Api.outInspect, params });
