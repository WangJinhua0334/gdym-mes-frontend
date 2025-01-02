import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wkpmo/mesWkpMo/list',
  exportXls = '/wkpmo/mesWkpMo/exportXls',
  queryByWkpId = '/wkpmo/mesWkpMo/queryByWkpId',
  changeMo = '/wkpmo/mesWkpMo/changeMo',
}

/**
 *
 * @param params 工位工单查询
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 导出工位工单信息
 * @param params
 */
export const exportXls = Api.exportXls;
/**
 *
 * @param params 工位工单查询
 * @returns
 */
export const queryByWkpId = (params) => defHttp.get({ url: Api.queryByWkpId, params });
/**
 *
 * @param params 修改工位工单信息
 * @returns
 */
export const changeMo = (params) => defHttp.post({ url: Api.changeMo, params });
