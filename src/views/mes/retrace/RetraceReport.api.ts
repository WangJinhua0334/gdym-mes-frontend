import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/retrace/retraceReport/pageList',
  listItemById = '/retrace/retraceReport/listItemById',
  lotTrackListByLotId = '/retrace/retraceReport/lotTrackListByLotId',
  exportXls = '/retrace/retraceReport/exportXls',
}

/**
 *
 * @param params 查询lot表记录
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 *
 * @param params 查询Lot表子列表
 * @returns
 */
export const listItemById = (params) => defHttp.get({ url: Api.listItemById, params });
/**
 *
 * @param params 根据lotId和wfsId查询动作记录信息
 * @returns
 */
export const lotTrackListByLotId = (params) => defHttp.get({ url: Api.lotTrackListByLotId, params });
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
