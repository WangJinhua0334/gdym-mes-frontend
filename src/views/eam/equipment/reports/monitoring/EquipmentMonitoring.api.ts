import { defHttp } from '/@/utils/http/axios';

enum Api {
  sfpt = '/equipment/monitor/sfpt',
  pcb = '/equipment/monitor/pcb',
  fct = '/equipment/monitor/fct',
  szf = '/equipment/monitor/szf',
  selectAirConditioning = '/equipment/monitor/selectAirConditioning',
}

// export const sfpt = Api.sfpt;
export const sfpt = (params) => defHttp.get({ url: Api.sfpt, params });

// export const pcb = Api.pcb;
export const pcb = (params) => defHttp.get({ url: Api.pcb, params });

// export const fct = Api.fct;
export const fct = (params) => defHttp.get({ url: Api.fct, params });

// export const szf = Api.szf;
export const szf = (params) => defHttp.get({ url: Api.szf, params });

// export const selectAirConditioning = Api.selectAirConditioning;
export const selectAirConditioning = (params) => defHttp.get({ url: Api.selectAirConditioning, params });
