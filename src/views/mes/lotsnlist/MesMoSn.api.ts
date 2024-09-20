import { defHttp } from '/@/utils/http/axios';

enum Api {
  /**列表查询 */
  list = '/mo/mesMoSn/list',
  /**列表导出 */
  exportXls = '/mo/mesMoSn/exportXls',
  /**流转卡按物料ID查询分组 */
  queryMoSnPrintMapByIds = '/mo/mesMoSn/queryMoSnPrintMapByIds',
  /**列表导出 */
  manualBindSn = '/mo/mesMoSn/manualBindSn',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 流转卡按物料ID查询分组
 * @param params
 */
export const queryMoSnPrintMapByIds = (params) => defHttp.get({ url: Api.queryMoSnPrintMapByIds, params });

/**
 * 替换流转卡-手动
 * @param params
 */
export const manualBindSn = (params) => defHttp.post({ url: Api.manualBindSn, params });
