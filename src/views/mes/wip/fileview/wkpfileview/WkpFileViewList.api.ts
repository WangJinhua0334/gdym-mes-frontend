
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    list = '/file/basFile/listByWkpId',
    getOnlinePreviewUrl = '/sys/common/getOnlinePreviewUrl',

}



/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
    defHttp.get({ url: Api.list, params });

export  const getOnlinePreviewUrl=(params) =>
    defHttp.get({ url: Api.getOnlinePreviewUrl, params }, { joinParamsToUrl: true, isTransformResponse: false })

