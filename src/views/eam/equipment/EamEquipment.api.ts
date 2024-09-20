import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/equipment/eamEquipment/list',
  save='/equipment/eamEquipment/add',
  edit='/equipment/eamEquipment/edit',
  deleteOne = '/equipment/eamEquipment/delete',
  deleteBatch = '/equipment/eamEquipment/deleteBatch',
  importExcel = '/equipment/eamEquipment/importExcel',
  exportXls = '/equipment/eamEquipment/exportXls',
  eamEquipSpotCheckItemList = '/equipment/eamEquipment/listEamEquipSpotCheckItemByMainId',
  eamEquipSpotCheckItemSave='/equipment/eamEquipment/addEamEquipSpotCheckItem',
  eamEquipSpotCheckItemEdit='/equipment/eamEquipment/editEamEquipSpotCheckItem',
  eamEquipSpotCheckItemDelete = '/equipment/eamEquipment/deleteEamEquipSpotCheckItem',
  eamEquipSpotCheckItemDeleteBatch = '/equipment/eamEquipment/deleteBatchEamEquipSpotCheckItem',
  eamEquipMaintainItemList = '/equipment/eamEquipment/listEamEquipMaintainItemByMainId',
  eamEquipMaintainItemSave='/equipment/eamEquipment/addEamEquipMaintainItem',
  eamEquipMaintainItemEdit='/equipment/eamEquipment/editEamEquipMaintainItem',
  eamEquipMaintainItemDelete = '/equipment/eamEquipment/deleteEamEquipMaintainItem',
  eamEquipMaintainItemDeleteBatch = '/equipment/eamEquipment/deleteBatchEamEquipMaintainItem',
  eamEquipSpotCheckPlanList = '/equipspotcheckplan/eamEquipSpotCheckPlan/list',
  eamEquipSpotCheckRecItemList = '/equipspotcheckplan/eamEquipSpotCheckPlan/listEamEquipSpotCheckRecItemByMainId',
  eamEquipMaintainPlanList = '/equipmaintainplan/eamEquipMaintainPlan/list',
  eamEquipMaintainRecItemList = '/equipmaintainplan/eamEquipMaintainPlan/listEamEquipMaintainRecItemByMainId',

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
export const eamEquipSpotCheckItemList = (params) => {
  if(params['equipId']){
    return defHttp.get({url: Api.eamEquipSpotCheckItemList, params});
  }
  return Promise.resolve({});
}

/**
 * 点检计划列表接口
 * @param params
 */
export const eamEquipSpotCheckPlanList = (params) => {
    return defHttp.get({url: Api.eamEquipSpotCheckPlanList, params});
}

/**
 * 保养计划列表接口
 * @param params
 */
export const eamEquipMaintainPlanList = (params) => {
    return defHttp.get({url: Api.eamEquipMaintainPlanList, params});
}


/**
 * 点检计划列表接口
 * @param params
 */
export const eamEquipSpotCheckRecItemList = (params) => {
    return defHttp.get({url: Api.eamEquipSpotCheckRecItemList, params});
}


/**
 * 保养计划列表接口
 * @param params
 */
export const eamEquipMaintainRecItemList = (params) => {
    return defHttp.get({url: Api.eamEquipMaintainRecItemList, params});
}


/**
 * 删除单个
 */
export const eamEquipSpotCheckItemDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.eamEquipSpotCheckItemDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const eamEquipSpotCheckItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.eamEquipSpotCheckItemDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  eamEquipSpotCheckItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamEquipSpotCheckItemEdit : Api.eamEquipSpotCheckItemSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const eamEquipSpotCheckItemImportUrl = '/equipment/eamEquipment/importEamEquipSpotCheckItem'

/**
 * 导出
 */
export const eamEquipSpotCheckItemExportXlsUrl = '/equipment/eamEquipment/exportEamEquipSpotCheckItem'
/**
 * 列表接口
 * @param params
 */
export const eamEquipMaintainItemList = (params) => {
  if(params['equipId']){
    return defHttp.get({url: Api.eamEquipMaintainItemList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const eamEquipMaintainItemDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.eamEquipMaintainItemDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const eamEquipMaintainItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.eamEquipMaintainItemDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  eamEquipMaintainItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamEquipMaintainItemEdit : Api.eamEquipMaintainItemSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const eamEquipMaintainItemImportUrl = '/equipment/eamEquipment/importEamEquipMaintainItem'

/**
 * 导出
 */
export const eamEquipMaintainItemExportXlsUrl = '/equipment/eamEquipment/exportEamEquipMaintainItem'
