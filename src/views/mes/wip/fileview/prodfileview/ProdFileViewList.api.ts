import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  listByProdId = '/file/basFile/listByProdId',
  getOnlinePreviewUrl = '/sys/common/getOnlinePreviewUrl',
}

/**
 * 列表接口
 * @param params
 */
export const listByProdId = (params) => defHttp.get({ url: Api.listByProdId, params });

export const getOnlinePreviewUrl = (params) =>
  defHttp.get({ url: Api.getOnlinePreviewUrl, params }, { joinParamsToUrl: true, isTransformResponse: false });
