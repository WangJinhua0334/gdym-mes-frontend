import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/measuring/eamMeasuringType/list',
  save='/measuring/eamMeasuringType/add',
  edit='/measuring/eamMeasuringType/edit',
  deleteOne = '/measuring/eamMeasuringType/delete',
  deleteBatch = '/measuring/eamMeasuringType/deleteBatch',
  importExcel = '/measuring/eamMeasuringType/importExcel',
  exportXls = '/measuring/eamMeasuringType/exportXls',
  eamMeasuringList = '/measuring/eamMeasuringType/eamMeasuringPageList',
  eamMeasuringSave = '/measuring/eamMeasuringType/addEamMeasuring',
  eamMeasuringEdit = '/measuring/eamMeasuringType/editEamMeasuring',
  eamMeasuringDeleteOne = '/measuring/eamMeasuringType/deleteEamMeasuring',
  eamMeasuringDeleteBatch = '/measuring/eamMeasuringType/deleteMapEamMeasuring',
  warehousing ='/measuring/eamMeasuringType/warehousing',
  neck="/measuring/eamMeasuringType/neck",
  refund="/measuring/eamMeasuringType/refund"


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
 * 子列表接口
 * @param params
 */
export const eamMeasuringList = (params) => {
  if (params['typeId']) {
    return defHttp.get({ url: Api.eamMeasuringList, params });
  }
  return Promise.resolve({});
};
/**
 * 删除单个
 */
export const eamMeasuringDeleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.eamMeasuringDeleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const eamMeasuringDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.eamMeasuringDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const eamMeasuringSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamMeasuringEdit : Api.eamMeasuringSave;
  return defHttp.post({ url: url, params });
};


/**
 * 入库
 * @param params
 */
export const warehousing = (params,handleSuccess) => {
  return defHttp.post({url: Api.warehousing, params},{joinParamsToUrl: true }).then(() =>{
    handleSuccess();
  });
}
/**
 * 领用
 * @param params
 */
export const neck = (params,handleSuccess) => {
  return defHttp.post({url: Api.neck, params}).then(() =>{
    handleSuccess();
  });
}
/**
 * 归还
 * @param params
 */
export const refund = (params,handleSuccess) => {
  return defHttp.post({url: Api.refund, params}).then(() =>{
    handleSuccess();
  });
}
