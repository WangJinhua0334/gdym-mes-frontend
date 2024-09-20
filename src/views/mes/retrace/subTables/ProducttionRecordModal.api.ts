import { defHttp } from '/@/utils/http/axios';

enum Api {
  actionList = '/retrace/retraceReport/lotTrackActionList',
  listTestItemById = '/wip/producttest/listTestItemById',
  actionsList = '/retrace/retraceReport/lotProducedRecordListByLotId',
  actionsInspList = '/retrace/retraceReport/selectInspListByLotId',
  actionsWokeList = '/retrace/retraceReport/selectWokeListByLotId',
  actionsWorkHourList = '/retrace/retraceReport/selectWorkHourListByLotId',
  actionsProductTestList = '/retrace/retraceReport/selectProductTestListByLotId',
  actionsProductBindList = '/retrace/retraceReport/selectProductBindListByLotId',
  actionsProductUnBindList = '/retrace/retraceReport/selectProductUnBindListByLotId',
}

/**
 *查询生产过程中产生的动作记录
 * @param params
 * @returns
 */
export const actionList = (params) => defHttp.get({ url: Api.actionList, params });

/**
 *查询生产过程中产生的动作记录
 * @param params
 * @returns
 */
export const actionsList = (params) => defHttp.get({ url: Api.actionsList, params });
/**
 *
 * @param params 查询调试项列表
 * @returns
 */
export const listTestItemById = (params) => defHttp.get({ url: Api.listTestItemById, params });

/**
 *
 * @param params 查询检验列表
 * @returns
 */
export const actionsInspList = (params) => defHttp.get({ url: Api.actionsInspList, params });

/**
 *
 * @param params 查询报工列表
 * @returns
 */
export const actionsWokeList = (params) => defHttp.get({ url: Api.actionsWokeList, params });

/**
 *
 * @param params 查询工时列表
 * @returns
 */
export const actionsWorkHourList = (params) => defHttp.get({ url: Api.actionsWorkHourList, params });

/**
 *
 * @param params 查询生产调试列表
 * @returns
 */
export const actionsProductTestList = (params) => defHttp.get({ url: Api.actionsProductTestList, params });

/**
 *
 * @param params 查询物料绑定列表
 * @returns
 */
export const actionsProductBindList = (params) => defHttp.get({ url: Api.actionsProductBindList, params });

/**
 *
 * @param params 查询物料解绑列表
 * @returns
 */
export const actionsProductUnBindList = (params) => defHttp.get({ url: Api.actionsProductUnBindList, params });
