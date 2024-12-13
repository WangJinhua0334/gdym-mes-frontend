import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/check/list',
  save = '/mod/check/add',
  edit = '/mod/check/edit',
  deleteOne = '/mod/check/delete',
  deleteBatch = '/mod/check/deleteBatch',
  importExcel = '/mod/check/importExcel',
  exportXls = '/mod/check/exportXls',
  modMouldCheckRecItemList = '/mod/check/queryModMouldCheckRecItemByMainId',
  spotCheck = '/mod/check/spotCheck',
  cancelSpotCheck = '/mod/check/cancelSpotCheck',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 子表单查询接口
 * @param params
 */
export const queryModMouldCheckRecItem = Api.modMouldCheckRecItemList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 子表列表接口
 * @param params
 */
export const modMouldCheckRecItemList = (params) => defHttp.get({ url: Api.modMouldCheckRecItemList, params }, { isTransformResponse: false });

/**
 * 点检
 * @param params
 */
export const spotCheck = (params) => {
  return defHttp.post({ url: Api.spotCheck, params });
};

/**
 * 取消点检
 * @param params
 */
export const cancelSpotCheck = (params, handleSuccess) => {
  return defHttp.post({ url: Api.cancelSpotCheck, params }).then(() => {
    handleSuccess();
  });
};
