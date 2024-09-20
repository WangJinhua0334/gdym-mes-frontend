import { defHttp } from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    listByMoId = '/moplan/mesMoPlan/listByMoId',

}


/**
 * 列表接口
 * @param params
 */
export const listByMoId = (params) =>
  defHttp.get({ url: Api.listByMoId, params });

