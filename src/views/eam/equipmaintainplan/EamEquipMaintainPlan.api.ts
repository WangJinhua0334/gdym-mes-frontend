import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/equipmaintainplan/eamEquipMaintainPlan/list',
  save='/equipmaintainplan/eamEquipMaintainPlan/add',
  edit='/equipmaintainplan/eamEquipMaintainPlan/edit',
  deleteOne = '/equipmaintainplan/eamEquipMaintainPlan/delete',
  deleteBatch = '/equipmaintainplan/eamEquipMaintainPlan/deleteBatch',
  importExcel = '/equipmaintainplan/eamEquipMaintainPlan/importExcel',
  exportXls = '/equipmaintainplan/eamEquipMaintainPlan/exportXls',
  eamEquipMaintainRecItemList = '/equipmaintainplan/eamEquipMaintainPlan/listEamEquipMaintainRecItemByMainId',
  getEamEquipMaintainItemByCode = '/equipment/eamEquipment/queryEamEquipMaintainItemByCode',
  maintain = '/equipmaintainplan/eamEquipMaintainPlan/maintain',
  cancelMaintain = '/equipmaintainplan/eamEquipMaintainPlan/cancelSpotCheck',
  listEamEquipMaintainItemByMainIdAll='/equipment/eamEquipment/listEamEquipMaintainItemByMainIdAll',
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
export const queryEamEquipMaintainRecItem = Api.eamEquipMaintainRecItemList
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});
/**
 * 通过code查询保养项
 * @param params
 */
export const getEamEquipMaintainItemByCode = (params) =>
  defHttp.get({url: Api.getEamEquipMaintainItemByCode, params});


/**
 * 通过code查询保养项
 * @param params
 */
export const listEamEquipMaintainItemByMainIdAll = (params) =>
  defHttp.get({url: Api.listEamEquipMaintainItemByMainIdAll, params});


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
 * 保养
 * @param params
 */
export const maintain = (params) => {
  return defHttp.put({url: Api.maintain, params});
}
/**
 * 保养
 * @param params
 */
export const cancelMaintain = (params) => {
  return defHttp.put({url: Api.cancelMaintain, params});
}
