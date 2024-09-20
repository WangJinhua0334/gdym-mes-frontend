import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/wip/productinspect/list',
  //exportXls = '/wip/productinspect/exportXls',
  exportXlsByMo = '/wip/productinspect/exportXlsByMo',
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXlsByMo;
