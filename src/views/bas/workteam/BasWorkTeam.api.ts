import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/workTeam/basWorkTeam/list',
  save='/workTeam/basWorkTeam/add',
  edit='/workTeam/basWorkTeam/edit',
  deleteOne = '/workTeam/basWorkTeam/delete',
  deleteBatch = '/workTeam/basWorkTeam/deleteBatch',
  importExcel = '/workTeam/basWorkTeam/importExcel',
  exportXls = '/workTeam/basWorkTeam/exportXls',
  basWorkTeamStaffList = '/workTeam/basWorkTeam/listBasWorkTeamStaffByMainId',
  basWorkTeamStaffSave='/workTeam/basWorkTeam/addBasWorkTeamStaff',
  basWorkTeamStaffEdit='/workTeam/basWorkTeam/editBasWorkTeamStaff',
  basWorkTeamStaffDelete = '/workTeam/basWorkTeam/deleteBasWorkTeamStaff',
  basWorkTeamStaffDeleteBatch = '/workTeam/basWorkTeam/deleteBatchBasWorkTeamStaff',
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
export const basWorkTeamStaffList = (params) => {
  if(params['teamId']){
    return defHttp.get({url: Api.basWorkTeamStaffList, params});
  }
  return Promise.resolve({});
}


/**
 * 删除单个
 */
export const basWorkTeamStaffDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.basWorkTeamStaffDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const basWorkTeamStaffDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.basWorkTeamStaffDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  basWorkTeamStaffSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWorkTeamStaffEdit : Api.basWorkTeamStaffSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const basWorkTeamStaffImportUrl = '/workTeam/basWorkTeam/importBasWorkTeamStaff'

/**
 * 导出
 */
export const basWorkTeamStaffExportXlsUrl = '/workTeam/basWorkTeam/exportBasWorkTeamStaff'
