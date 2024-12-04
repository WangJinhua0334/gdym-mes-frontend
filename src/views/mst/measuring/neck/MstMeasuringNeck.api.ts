import { defHttp } from '/@/utils/http/axios';

enum Api {
  neck = '/mst/measuringType/neck',
}

/**
 * 报废
 * @param params
 */
export const neck = (params) => {
  return defHttp.post({ url: Api.neck, params });
};
