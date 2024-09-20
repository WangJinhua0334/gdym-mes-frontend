import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  edit = '/lotrepair/mesLotRepair/edit',
  queryBySn = '/lotrepair/mesLotRepair/queryBySn',
  queryMesLotRepairDetailByRepairId = '/lotrepair/mesLotRepair/queryMesLotRepairDetailByRepairId',
  itembindsListByLotSn = '/lotrepair/mesLotRepair/listMesLotItemBindByLotId',
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
