import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/equipment/eamMeasuringInsp/list',
  save='/equipment/eamMeasuringInsp/add',
  exportXls = '/equipment/eamMeasuringInsp/exportXls',
  eamMeasuringInspItemList = '/equipment/eamMeasuringInsp/EamMeasuringInspItemPageList',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 子列表接口
 * @param params
 */
export const eamMeasuringInspItemList = (params) => {
  if (params['inspId']) {
    return defHttp.get({ url: Api.eamMeasuringInspItemList, params });
  }
  return Promise.resolve({});
};

/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 添加校验记录
 * @param params
 */
export const save = (params) => {
  return defHttp.post({url: Api.save, params});
}
