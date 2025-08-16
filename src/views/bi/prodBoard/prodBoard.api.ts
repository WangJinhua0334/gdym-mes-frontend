import { defHttp } from '/@/utils/http/axios';

enum Api {
  getWkpList = '/bi/ProdBoard/getWkpList',
  getMesMoSnData = '/bi/ProdBoard/getMesMoSnData',
  productionList = '/bi/ProdBoard/productionList',
  getScadaData = '/bi/ProdBoard/getScadaData',
  getScadaheight = '/bi/ProdBoard/getScadaheight',
  getScadaWeight = '/bi/ProdBoard/getScadaWeight',
  getPackList = '/bi/ProdBoard/getPackList',
  scranPack = '/mo/mopack/scranPack',
  pack = '/mo/mopack/pack',
  wkpStockList = '/bi/ProdBoard/wkpStockList',
}

export const getWkpList = (params) => defHttp.get({ url: Api.getWkpList, params });
export const getMesMoSnData = (params) => defHttp.get({ url: Api.getMesMoSnData, params }, { joinParamsToUrl: true });
export const productionList = (params) => defHttp.get({ url: Api.productionList, params }, { joinParamsToUrl: true });

export const wkpStockList = (params) => defHttp.get({ url: Api.wkpStockList, params }, { joinParamsToUrl: true });
export const getScadaData = (params) => defHttp.get({ url: Api.getScadaData, params }, { joinParamsToUrl: true });
export const getScadaheight = (params) => defHttp.get({ url: Api.getScadaheight, params }, { joinParamsToUrl: true });
export const getScadaWeight = (params) => defHttp.get({ url: Api.getScadaWeight, params }, { joinParamsToUrl: true });
export const getPackList = (params) => defHttp.get({ url: Api.getPackList, params }, { joinParamsToUrl: true });

/**
 *
 * @param params 包装查询
 * @returns
 */
export const scranPack = (params) => defHttp.get({ url: Api.scranPack, params });

/**
 *
 * @param params 包装
 * @returns
 */
export const pack = (params) => defHttp.post({ url: Api.pack, params });
