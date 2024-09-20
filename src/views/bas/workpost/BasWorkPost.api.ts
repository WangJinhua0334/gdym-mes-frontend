import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/workpost/basWorkPost/list',
  save='/workpost/basWorkPost/add',
  edit='/workpost/basWorkPost/edit',
  deleteOne = '/workpost/basWorkPost/delete',
  deleteBatch = '/workpost/basWorkPost/deleteBatch',
  importExcel = '/workpost/basWorkPost/importExcel',
  exportXls = '/workpost/basWorkPost/exportXls',
  basWorkPostStationList = '/workpost/basWorkPost/queryBasWorkPostStationByMainId',
  basWorkPostEquipList = '/workpost/basWorkPost/queryBasWorkPostEquipByMainId',
  //remoteshutdown='/workpost/basWorkPost/remoteshutdown',
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
export const queryBasWorkPostStation = Api.basWorkPostStationList
/**
 * 子表单查询接口
 * @param params
 */
export const queryBasWorkPostEquip = Api.basWorkPostEquipList
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
// /**
//  * 关机
//  * @param params
//  */
// export const remoteshutdown = (params,handleSuccess) => {
//   let url = Api.remoteshutdown;
//   return defHttp.post({url: url, params}, {joinParamsToUrl: true}).then(() => {
//     handleSuccess();
//   });;
// }

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 子表列表接口
 * @param params
 */
export const basWorkPostStationList = (params) =>
  defHttp.get({url: Api.basWorkPostStationList, params},{isTransformResponse:false});
/**
 * 子表列表接口
 * @param params
 */
export const basWorkPostEquipList = (params) =>
  defHttp.get({url: Api.basWorkPostEquipList, params},{isTransformResponse:false});
