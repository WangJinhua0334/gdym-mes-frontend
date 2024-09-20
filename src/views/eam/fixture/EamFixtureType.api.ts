import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/fixture/eamFixtureType/list',
  save='/fixture/eamFixtureType/add',
  edit='/fixture/eamFixtureType/edit',
  deleteOne = '/fixture/eamFixtureType/delete',
  deleteBatch = '/fixture/eamFixtureType/deleteBatch',
  importExcel = '/fixture/eamFixtureType/importExcel',
  exportXls = '/fixture/eamFixtureType/exportXls',
  eamFixtureList = '/fixture/eamFixtureType/eamFixturePageList',
  eamFixtureSave = '/fixture/eamFixtureType/addEamFixture',
  eamFixtureEdit = '/fixture/eamFixtureType/editEamFixture',
  eamFixtureDeleteOne = '/fixture/eamFixtureType/deleteEamFixture',
  eamFixtureDeleteBatch = '/fixture/eamFixtureType/deleteMapEamFixture',
  warehousing ='/fixture/eamFixtureType/warehousing',
  neck="/fixture/eamFixtureType/neck",
  refund="/fixture/eamFixtureType/refund"


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
export const eamFixtureList = (params) => {
  if (params['typeId']) {
    return defHttp.get({ url: Api.eamFixtureList, params });
  }
  return Promise.resolve({});
};
/**
 * 删除单个
 */
export const eamFixtureDeleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.eamFixtureDeleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const eamFixtureDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.eamFixtureDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const eamFixtureSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.eamFixtureEdit : Api.eamFixtureSave;
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
