import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/equipmenttype/eamEquipmentType/list',
  save='/equipmenttype/eamEquipmentType/add',
  edit='/equipmenttype/eamEquipmentType/edit',
  deleteOne = '/equipmenttype/eamEquipmentType/delete',
  deleteBatch = '/equipmenttype/eamEquipmentType/deleteBatch',
  importExcel = '/equipmenttype/eamEquipmentType/importExcel',
  exportXls = '/equipmenttype/eamEquipmentType/exportXls',
  eamEquipTypeSpotCheckItemList = '/equipmenttype/eamEquipmentType/listEamEquipTypeSpotCheckItemByMainId',
  eamEquipTypeSpotCheckItemSave='/equipmenttype/eamEquipmentType/addEamEquipTypeSpotCheckItem',
  eamEquipTypeSpotCheckItemEdit='/equipmenttype/eamEquipmentType/editEamEquipTypeSpotCheckItem',
  eamEquipTypeSpotCheckItemDelete = '/equipmenttype/eamEquipmentType/deleteEamEquipTypeSpotCheckItem',
  eamEquipTypeSpotCheckItemDeleteBatch = '/equipmenttype/eamEquipmentType/deleteBatchEamEquipTypeSpotCheckItem',
  eamEquipTypeMaintainItemList = '/equipmenttype/eamEquipmentType/listEamEquipTypeMaintainItemByMainId',
  eamEquipTypeMaintainItemSave='/equipmenttype/eamEquipmentType/addEamEquipTypeMaintainItem',
  eamEquipTypeMaintainItemEdit='/equipmenttype/eamEquipmentType/editEamEquipTypeMaintainItem',
  eamEquipTypeMaintainItemDelete = '/equipmenttype/eamEquipmentType/deleteEamEquipTypeMaintainItem',
  eamEquipTypeMaintainItemDeleteBatch = '/equipmenttype/eamEquipmentType/deleteBatchEamEquipTypeMaintainItem',
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
export const eamEquipTypeSpotCheckItemList = (params) => {
  if(params['equipTypeId']){
    return defHttp.get({url: Api.eamEquipTypeSpotCheckItemList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const eamEquipTypeSpotCheckItemDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.eamEquipTypeSpotCheckItemDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const eamEquipTypeSpotCheckItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.eamEquipTypeSpotCheckItemDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  eamEquipTypeSpotCheckItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamEquipTypeSpotCheckItemEdit : Api.eamEquipTypeSpotCheckItemSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const eamEquipTypeSpotCheckItemImportUrl = '/equipmenttype/eamEquipmentType/importEamEquipTypeSpotCheckItem'

/**
 * 导出
 */
export const eamEquipTypeSpotCheckItemExportXlsUrl = '/equipmenttype/eamEquipmentType/exportEamEquipTypeSpotCheckItem'
/**
 * 列表接口
 * @param params
 */
export const eamEquipTypeMaintainItemList = (params) => {
  if(params['equipTypeId']){
    return defHttp.get({url: Api.eamEquipTypeMaintainItemList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const eamEquipTypeMaintainItemDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.eamEquipTypeMaintainItemDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const eamEquipTypeMaintainItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.eamEquipTypeMaintainItemDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  eamEquipTypeMaintainItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamEquipTypeMaintainItemEdit : Api.eamEquipTypeMaintainItemSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const eamEquipTypeMaintainItemImportUrl = '/equipmenttype/eamEquipmentType/importEamEquipTypeMaintainItem'

/**
 * 导出
 */
export const eamEquipTypeMaintainItemExportXlsUrl = '/equipmenttype/eamEquipmentType/exportEamEquipTypeMaintainItem'
