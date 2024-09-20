import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/fixture/eamFixtureRecord/list',
  save='/fixture/eamFixtureRecord/add',
  exportXls = '/fixture/eamFixtureRecord/exportXls',
  queryById = 'fixture/eamFixtureRecord/queryById'
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
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 保存
 * @param params
 */
export const save = (params) => {
  return defHttp.post({url: Api.save, params});
}
/**
 * 详情
 * @param params
 */
export const queryById = (params) => {
  return defHttp.post({url: Api.save, params});
}
