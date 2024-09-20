import { defHttp } from '/@/utils/http/axios';

enum Api {
  workOrderInfo = '/bi/productionLine/getWorkOrderInfo',
  fct = '/bi/productionLine/fct',
  pcb = '/bi/productionLine/pcb',
  sfpt = '/bi/productionLine/sfpt',
  szf = '/bi/productionLine/szf',
}

export const workOrderInfo = (params) => defHttp.get({ url: Api.workOrderInfo, params });
export const fct = (params) => defHttp.get({ url: Api.fct, params });
export const pcb = (params) => defHttp.get({ url: Api.pcb, params });
export const sfpt = (params) => defHttp.get({ url: Api.sfpt, params });
export const szf = (params) => defHttp.get({ url: Api.szf, params });