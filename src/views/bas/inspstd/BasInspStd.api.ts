import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/inspstd/basInspStd/list',
  save='/inspstd/basInspStd/add',
  edit='/inspstd/basInspStd/edit',
  deleteOne = '/inspstd/basInspStd/delete',
  deleteBatch = '/inspstd/basInspStd/deleteBatch',
  importExcel = '/inspstd/basInspStd/importExcel',
  exportXls = '/inspstd/basInspStd/exportXls',
  basInspStdItemList = '/inspstd/basInspStd/listBasInspStdItemByMainId',
  basInspStdItemSave='/inspstd/basInspStd/addBasInspStdItem',
  basInspStdItemEdit='/inspstd/basInspStd/editBasInspStdItem',
  basInspStdItemDelete = '/inspstd/basInspStd/deleteBasInspStdItem',
  basInspStdItemDeleteBatch = '/inspstd/basInspStd/deleteBatchBasInspStdItem',
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
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 删除单个
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
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
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 列表接口
 * @param params
 */
export const basInspStdItemList = (params) => {
  if(params['inspStdId']){
    return defHttp.get({url: Api.basInspStdItemList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const basInspStdItemDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.basInspStdItemDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const basInspStdItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.basInspStdItemDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  basInspStdItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basInspStdItemEdit : Api.basInspStdItemSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const basInspStdItemImportUrl = '/inspstd/basInspStd/importBasInspStdItem'

/**
 * 导出
 */
export const basInspStdItemExportXlsUrl = '/inspstd/basInspStd/exportBasInspStdItem'
