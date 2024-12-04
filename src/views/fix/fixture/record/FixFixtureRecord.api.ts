import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/fix/fixtureRecord/list',
  save = '/fix/fixtureRecord/add',
  exportXls = '/fix/fixtureRecord/exportXls',
  queryById = 'fix/fixtureRecord/queryById',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 保存
 * @param params
 */
export const save = (params) => {
  return defHttp.post({ url: Api.save, params });
};
/**
 * 详情
 * @param params
 */
export const queryById = (params) => {
  return defHttp.post({ url: Api.save, params });
};
