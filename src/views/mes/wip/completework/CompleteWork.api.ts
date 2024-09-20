import { defHttp } from '/@/utils/http/axios';

enum Api {
  moveCheck = '/wip/product/moveCheck',
  move = '/wip/product/move',
}
/**
 *
 * @param params 过站校验
 * @returns
 */
export const moveCheck = (params) => defHttp.get({ url: Api.moveCheck, params });
/**
 *
 * @param params 过站
 * @returns
 */
export const move = (params) => defHttp.post({ url: Api.move, params });
