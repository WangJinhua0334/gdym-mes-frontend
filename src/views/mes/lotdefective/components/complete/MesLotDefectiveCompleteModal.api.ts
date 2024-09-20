import { defHttp } from '/@/utils/http/axios';

enum Api {
  edit = '/lotdefective/mesLotDefective/edit',
  scanSn = '/lotdefective/mesLotDefective/scanSn',
}

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  const url = Api.edit;
  return defHttp.post({ url: url, params });
};
/**
 * 获取流转卡当前状态信息
 * @param params
 */
export const scanSnQuery = (params) => {
  return defHttp.get({ url: Api.scanSn, params }, { isTransformResponse: false });
};
