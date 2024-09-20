import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  scan = '/wip/productbind/scan',
  edit = '/lotrepair/mesLotRepair/edit',
  queryBySn = '/lotrepair/mesLotRepair/queryBySn',
  queryMesLotRepairDetailByRepairId = '/lotrepair/mesLotRepair/queryMesLotRepairDetailByRepairId',
  itembindsListByLotSn = '/lotrepair/mesLotRepair/listMesLotItemBindByLotId',
  unbind = '/wip/productbind/unbind',
  bindReplace = '/wip/productbind/bindReplace',
  getBindData = '/wip/productbind/getBindData',
}

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.edit, params });
};

export const queryBySn = (params) => defHttp.get({ url: Api.queryBySn, params });

export const queryMesLotRepairDetailByRepairId = (params) => defHttp.get({ url: Api.queryMesLotRepairDetailByRepairId, params });

export const itembindsListByLotSn = (params) => defHttp.get({ url: Api.itembindsListByLotSn, params });
/**
 *
 * @param params 物料条码解绑
 * @returns
 */
export const unbind = (params) => defHttp.post({ url: Api.unbind, params });
/**
 *
 * @param params 物料条码替换
 * @returns
 */
export const bindReplace = (params) => defHttp.post({ url: Api.bindReplace, params });
/**
 *
 * @param params 扫描物料条码
 * @returns
 */
export const scan = (params) => defHttp.get({ url: Api.scan, params });
/**
 *
 * @param params 查询物料绑定信息
 * @returns
 */
export const getBindData = (params) => defHttp.get({ url: Api.getBindData, params });
