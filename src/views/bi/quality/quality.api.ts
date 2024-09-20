import { defHttp } from '/@/utils/http/axios';

enum Api {
  getDefectDistributionMaps = '/bi/QualityBoard/getDefectDistributionMaps', //缺陷分布
  getNgProducts = '/bi/QualityBoard/getNgProducts', //不良产品列表
  getNgReasons = '/bi/QualityBoard/getNgReasons', //不良原因
  getOnceQualifiedRate = '/bi/QualityBoard/getOnceQualifiedRate', //一次合格率
  getProducedMonthQualifiedRates = '/bi/QualityBoard/getProducedMonthQualifiedRates', //月产量合格率
  getPlanMonthQualifiedRate = '/bi/QualityBoard/getPlanMonthQualifiedRate', //本月计划合格率
  getProductCateYearQualifiedQtys = '/bi/QualityBoard/getProductCateYearQualifiedQtys', //年度产品类别合格数
  getWaitInspTasks = '/bi/QualityBoard/getWaitInspTasks', //待检任务
}

export const getDefectDistributionMaps = (params) => defHttp.get({ url: Api.getDefectDistributionMaps, params });
export const getNgProducts = (params) => defHttp.get({ url: Api.getNgProducts, params });
export const getNgReasons = (params) => defHttp.get({ url: Api.getNgReasons, params });
export const getOnceQualifiedRate = (params) => defHttp.get({ url: Api.getOnceQualifiedRate, params });
export const getPlanMonthQualifiedRate = (params) => defHttp.get({ url: Api.getPlanMonthQualifiedRate, params });
export const getProducedMonthQualifiedRates = (params) => defHttp.get({ url: Api.getProducedMonthQualifiedRates, params });
export const getProductCateYearQualifiedQtys = (params) => defHttp.get({ url: Api.getProductCateYearQualifiedQtys, params });
export const getWaitInspTasks = (params) => defHttp.get({ url: Api.getWaitInspTasks, params });
