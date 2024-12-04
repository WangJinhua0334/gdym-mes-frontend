import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mst/measuringInsp/list',
  save = '/mst/measuringInsp/add',
  exportXls = '/mst/measuringInsp/exportXls',
  mstMeasuringInspItemList = '/mst/measuringInsp/mstMeasuringInspItemPageList',
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
export const mstMeasuringInspItemList = (params) => {
  if (params['inspId']) {
    return defHttp.get({ url: Api.mstMeasuringInspItemList, params });
  }
  return Promise.resolve({});
};

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 添加校验记录
 * @param params
 */
export const save = (params) => {
  return defHttp.post({ url: Api.save, params });
};
