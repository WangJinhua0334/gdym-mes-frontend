import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/dyncrule/basDynamicRule/list',
  save='/dyncrule/basDynamicRule/add',
  edit='/dyncrule/basDynamicRule/edit',
  deleteOne = '/dyncrule/basDynamicRule/delete',
  deleteBatch = '/dyncrule/basDynamicRule/deleteBatch',
  importExcel = '/dyncrule/basDynamicRule/importExcel',
  exportXls = '/dyncrule/basDynamicRule/exportXls',
  basDynamicRuleDetailList = '/dyncrule/basDynamicRule/listBasDynamicRuleDetailByMainId',
  listBasDynamicRuleDetailByMainIdNotPage = '/dyncrule/basDynamicRule/listBasDynamicRuleDetailByMainIdNotPage',
  basDynamicRuleDetailSave='/dyncrule/basDynamicRule/addBasDynamicRuleDetail',
  basDynamicRuleDetailEdit='/dyncrule/basDynamicRule/editBasDynamicRuleDetail',
  basDynamicRuleDetailDelete = '/dyncrule/basDynamicRule/deleteBasDynamicRuleDetail',
  basDynamicRuleDetailDeleteBatch = '/dyncrule/basDynamicRule/deleteBatchBasDynamicRuleDetail',
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
 * 查询数据不分页
 * @param params
 */
export const listBasDynamicRuleDetailByMainIdNotPage = (params) =>{
  return   defHttp.get({url: Api.listBasDynamicRuleDetailByMainIdNotPage, params});
}
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
export const basDynamicRuleDetailList = (params) => {
  if(params['ruleId']){
    return defHttp.get({url: Api.basDynamicRuleDetailList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const basDynamicRuleDetailDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.basDynamicRuleDetailDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const basDynamicRuleDetailDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.basDynamicRuleDetailDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  basDynamicRuleDetailSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basDynamicRuleDetailEdit : Api.basDynamicRuleDetailSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const basDynamicRuleDetailImportUrl = '/dyncrule/basDynamicRule/importBasDynamicRuleDetail'

/**
 * 导出
 */
export const basDynamicRuleDetailExportXlsUrl = '/dyncrule/basDynamicRule/exportBasDynamicRuleDetail'
