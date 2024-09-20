import { defHttp } from '/@/utils/http/axios';

enum Api {
  analysisScan = '/wip/product/analysisScan',
}
/**
 *
 * @param params 识别二维码信息
 * @returns
 */
export const analysisScan = (params) => defHttp.get({ url: Api.analysisScan, params });
