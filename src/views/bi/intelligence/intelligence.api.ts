import { defHttp } from '/@/utils/http/axios';

enum Api {
  annualAfterSalesService = '/bi/intelligentControl/annualAfterSalesStatistics',
  monthMoStats = '/bi/intelligentControl/monthMoStats',
  monthProductionList = '/bi/intelligentControl/monthProductionList',
  monthProductionStatistics = '/bi/intelligentControl/monthProductionStatistics',
  productPercentPass = '/bi/intelligentControl/productPercentPass',
  productionSchedule = '/bi/intelligentControl/productionSchedule',
  weekEquipmentRunTime = '/bi/intelligentControl/weekEquipmentRunTime',
}

export const annualAfterSalesService = (params) => defHttp.get({ url: Api.annualAfterSalesService, params });
export const monthMoStats = (params) => defHttp.get({ url: Api.monthMoStats, params });
export const monthProductionList = (params) => defHttp.get({ url: Api.monthProductionList, params });
export const monthProductionStatistics = (params) => defHttp.get({ url: Api.monthProductionStatistics, params });
export const productPercentPass = (params) => defHttp.get({ url: Api.productPercentPass, params });
export const productionSchedule = (params) => defHttp.get({ url: Api.productionSchedule, params });
export const weekEquipmentRunTime = (params) => defHttp.get({ url: Api.weekEquipmentRunTime, params });
