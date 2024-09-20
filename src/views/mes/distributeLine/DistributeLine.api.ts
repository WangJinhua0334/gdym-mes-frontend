import { defHttp } from '/@/utils/http/axios';

enum Api {
  save = '/distributeLine/mesDistributeLine/pushSnData', //同步数据到工作站
  getSnData = '/distributeLine/mesDistributeLine/getSnData', //扫描
}

/**
 *
 * @param params 下发任务到产线
 * @returns
 */
export const save = (params) => defHttp.post({ url: Api.save, params });

/**
 * 查询sn信息
 * @param params
 */
export const getSnData = (params) => {
  return defHttp.get({ url: Api.getSnData, params });
};
