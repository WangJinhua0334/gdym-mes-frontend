import {defHttp} from "/@/utils/http/axios";
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/defectcategory/eamDefectCategory/rootList',
  save='/defectcategory/eamDefectCategory/add',
  edit='/defectcategory/eamDefectCategory/edit',
  deleteEamDefectCategory = '/defectcategory/eamDefectCategory/delete',
  importExcel = '/defectcategory/eamDefectCategory/importExcel',
  exportXls = '/defectcategory/eamDefectCategory/exportXls',
  getItemExportUrl = '/defectcategory/eamDefectCategory/getItemExportUrl',
  loadTreeData = '/defectcategory/eamDefectCategory/loadTreeRoot',
  getChildList = '/defectcategory/eamDefectCategory/childList',
  getChildListBatch = '/defectcategory/eamDefectCategory/getChildListBatch',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 * @param params
 */
export const getImportUrl = Api.importExcel;
/**
 * 导入api
 * @param params
 */
export const getItemExportUrl = Api.getItemExportUrl;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 删除
 */
export const deleteEamDefectCategory = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteEamDefectCategory, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const batchDeleteEamDefectCategory = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteEamDefectCategory, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdateDict = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 查询全部树形节点数据
 * @param params
 */
export const loadTreeData = (params) =>
  defHttp.get({url: Api.loadTreeData,params});
/**
 * 查询子节点数据
 * @param params
 */
export const getChildList = (params) =>{
  console.log("params",params)
  if(params['pid']){
    return defHttp.get({url: Api.getChildList, params});
  }
  return Promise.resolve({});
}
/**
 * 批量查询子节点数据
 * @param params
 */
export const getChildListBatch = (params) =>
  defHttp.get({url: Api.getChildListBatch, params},{isTransformResponse:false});
