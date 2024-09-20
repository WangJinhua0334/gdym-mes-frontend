import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/template/basTemplate/list',
  save='/template/basTemplate/add',
  edit='/template/basTemplate/edit',
  deleteOne = '/template/basTemplate/delete',
  deleteBatch = '/template/basTemplate/deleteBatch',
  importExcel = '/template/basTemplate/importExcel',
  exportXls = '/template/basTemplate/exportXls',
  basTemplateDetailList = '/template/basTemplate/listBasTemplateDetailByMainId',
  basTemplateDetailSave='/template/basTemplate/addBasTemplateDetail',
  basTemplateDetailEdit='/template/basTemplate/editBasTemplateDetail',
  basTemplateDetailDelete = '/template/basTemplate/deleteBasTemplateDetail',
  basTemplateDetailDeleteBatch = '/template/basTemplate/deleteBatchBasTemplateDetail',
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
export const basTemplateDetailList = (params) => {
  if(params['templateId']){
    return defHttp.get({url: Api.basTemplateDetailList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const basTemplateDetailDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.basTemplateDetailDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const basTemplateDetailDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.basTemplateDetailDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  basTemplateDetailSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basTemplateDetailEdit : Api.basTemplateDetailSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const basTemplateDetailImportUrl = '/template/basTemplate/importBasTemplateDetail'

/**
 * 导出
 */
export const basTemplateDetailExportXlsUrl = '/template/basTemplate/exportBasTemplateDetail'
