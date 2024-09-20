import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

enum Api {
  /**查询数据 */
  listMoByGantt = '/mo/mesMo/listMoByGantt',
}

/**
 * 列表接口
 * @param params
 */
export const listMoByGantt = (params) => defHttp.get({ url: Api.listMoByGantt, params });
