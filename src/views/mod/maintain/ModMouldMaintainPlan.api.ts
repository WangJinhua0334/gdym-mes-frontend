import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/maintain/list',
  save = '/mod/maintain/add',
  edit = '/mod/maintain/edit',
  deleteOne = '/mod/maintain/delete',
  deleteBatch = '/mod/maintain/deleteBatch',
  importExcel = '/mod/maintain/importExcel',
  exportXls = '/mod/maintain/exportXls',
  modMouldMaintainRecItemList = '/mod/maintain/queryModMouldMaintainRecItemByMainId',
  maintain = '/mod/maintain/maintain',
  cancelMaintain = '/mod/maintain/cancelMaintain',
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
export const queryModMouldMaintainRecItem = Api.modMouldMaintainRecItemList;
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
export const modMouldMaintainRecItemList = (params) => defHttp.get({ url: Api.modMouldMaintainRecItemList, params }, { isTransformResponse: false });
/**
 * 保养
 * @param params
 */
export const maintain = (params) => {
  return defHttp.post({ url: Api.maintain, params });
};

/**
 * 取消保养
 * @param params
 */
export const cancelMaintain = (params, handleSuccess) => {
  return defHttp.post({ url: Api.cancelMaintain, params }).then(() => {
    handleSuccess();
  });
};
