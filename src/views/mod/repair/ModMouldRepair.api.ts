import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/repair/list',
  save = '/mod/repair/add',
  edit = '/mod/repair/edit',
  deleteOne = '/mod/repair/delete',
  deleteBatch = '/mod/repair/deleteBatch',
  importExcel = '/mod/repair/importExcel',
  exportXls = '/mod/repair/exportXls',
  modMouldRepairPartsList = '/mod/repair/queryModMouldRepairPartsByMainId',
  confirm = '/mod/repair/confirm',
  startRepair = '/mod/repair/startRepair',
  cancel = '/mod/repair/cancel',
  endRepair = '/mod/repair/endRepair',
  evaluate = '/mod/repair/evaluate',
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
export const queryModMouldRepairParts = Api.modMouldRepairPartsList;
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
export const modMouldRepairPartsList = (params) => defHttp.get({ url: Api.modMouldRepairPartsList, params }, { isTransformResponse: false });
/**
 * 取消
 * @param params
 */
export const cancel = (params, handleSuccess) => {
  return defHttp.post({ url: Api.cancel, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 开始维修
 * @param params
 */
export const startRepair = (params, handleSuccess) => {
  return defHttp.post({ url: Api.startRepair, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 确认维修
 * @param params
 */
export const confirm = (params) => {
  return defHttp.post({ url: Api.confirm, params });
};
/**
 * 完成维修
 * @param params
 */
export const endRepair = (params) => {
  return defHttp.post({ url: Api.endRepair, params });
};
/**
 * 评价
 * @param params
 */
export const evaluate = (params) => {
  return defHttp.post({ url: Api.evaluate, params });
};
