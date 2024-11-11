import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/sys/log/list',
  again = '/sys/log/again',
}

/**
 * 查询日志列表
 * @param params
 */
export const getLogList = (params) => {
  return defHttp.get({ url: Api.list, params });
};
/**
 * 再次请求接口
 * @param params
 */
export const again = (params) => defHttp.post({ url: Api.again, params });
