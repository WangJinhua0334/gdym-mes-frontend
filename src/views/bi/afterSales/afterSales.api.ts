import { defHttp } from '/@/utils/http/axios';

enum Api {
  afterSalesProducts = '/bi/afterSales/afterSalesProducts',
  annualAfterSalesInfo = '/bi/afterSales/annualAfterSalesInfo',
  annualAfterSalesMaintenancePlan = '/bi/afterSales/annualAfterSalesMaintenancePlan',
  faultPhenomenon = '/bi/afterSales/faultPhenomenon',
  repairQuantity = '/bi/afterSales/repairQuantity',
  cumulativeAfterSales = '/bi/afterSales/cumulativeAfterSales',
}

export const afterSalesProducts = (params) => defHttp.get({ url: Api.afterSalesProducts, params });
export const annualAfterSalesInfo = (params) => defHttp.get({ url: Api.annualAfterSalesInfo, params });
export const annualAfterSalesMaintenancePlan = (params) => defHttp.get({ url: Api.annualAfterSalesMaintenancePlan, params });
export const faultPhenomenon = (params) => defHttp.get({ url: Api.faultPhenomenon, params });
export const repairQuantity = (params) => defHttp.get({ url: Api.repairQuantity, params });
export const cumulativeAfterSales = (params) => defHttp.get({ url: Api.cumulativeAfterSales, params });
