
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    listByProdIdAndWkpId = '/file/basFile/listByProdIdAndWkpId',
    getOnlinePreviewUrl = '/sys/common/getOnlinePreviewUrl',

}



/**
 * 列表接口
 * @param params
 */
export const listByProdIdAndWkpId = (params) =>
    defHttp.get({ url: Api.listByProdIdAndWkpId, params });

export  const getOnlinePreviewUrl=(params) =>
    defHttp.get({ url: Api.getOnlinePreviewUrl, params }, { joinParamsToUrl: true, isTransformResponse: false })
