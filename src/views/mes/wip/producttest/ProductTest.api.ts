import { defHttp } from '/@/utils/http/axios';

enum Api {
  getTestData = '/wip/producttest/getTestData',
  test = '/wip/producttest/test',
}
/**
 *
 * @param params 查询测试数据
 * @returns
 */
export const getTestData = (params) => defHttp.get({ url: Api.getTestData, params });
/**
 *
 * @param params 测试
 * @returns
 */
export const saveTest = (params) => defHttp.post({ url: Api.test, params });
