import { defHttp } from '/@/utils/http/axios';

enum Api {
  listStock = '/wip/productwkp/pageStockList',
  exportStockXls = '/wip/productwkp/exportStockListXls',
  listStockRecord = '/wip/productwkp/pageRecordList',
  exportStockRecordXls = '/wip/productwkp/exportRecordListXls',
}

/**
 *
 * @param params 工位物料查询
 * @returns
 */
export const listStock = (params) => defHttp.get({ url: Api.listStock, params });
/**
 * 导出工位物料记录api
 * @param params
 */
export const exportStockXls = Api.exportStockXls;
/**
 *
 * @param params 查询工位物料操作记录
 * @returns
 */
export const listStockRecord = (params) => defHttp.get({ url: Api.listStockRecord, params });
/**
 * 导出工位物料操作记录api
 * @param params
 */
export const exportStockRecordXls = Api.exportStockRecordXls;
