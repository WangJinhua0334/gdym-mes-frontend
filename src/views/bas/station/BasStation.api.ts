import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/station/basStation/list',
  save='/station/basStation/add',
  edit='/station/basStation/edit',
  deleteOne = '/station/basStation/delete',
  deleteBatch = '/station/basStation/deleteBatch',
  importExcel = '/station/basStation/importExcel',
  exportXls = '/station/basStation/exportXls',
  basStationActionList = '/station/basStation/queryBasStationActionByMainId',
  basStationSkillList = '/station/basStation/queryBasStationSkillByMainId',
  basChildStationList = '/station/basStation/queryBasChildStationByMainId',
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
export const queryBasStationAction = Api.basStationActionList
/**
 * 子表单查询接口
 * @param params
 */
export const queryBasStationSkill = Api.basStationSkillList
/**
 * 子表单查询接口
 * @param params
 */
export const queryBasChildStation = Api.basChildStationList
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
 * 子表列表接口
 * @param params
 */
export const basStationActionList = (params) =>
  defHttp.get({url: Api.basStationActionList, params},{isTransformResponse:false});
/**
 * 子表列表接口
 * @param params
 */
export const basStationSkillList = (params) =>
  defHttp.get({url: Api.basStationSkillList, params},{isTransformResponse:false});
/**
 * 子表列表接口
 * @param params
 */
export const basChildStationList = (params) =>
  defHttp.get({url: Api.basChildStationList, params},{isTransformResponse:false});
