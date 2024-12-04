import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/fix/fixtureType/list',
  save = '/fix/fixtureType/add',
  edit = '/fix/fixtureType/edit',
  deleteOne = '/fix/fixtureType/delete',
  deleteBatch = '/fix/fixtureType/deleteBatch',
  importExcel = '/fix/fixtureType/importExcel',
  exportXls = '/fix/fixtureType/exportXls',
  fixFixtureList = '/fix/fixtureType/fixFixturePageList',
  fixFixtureSave = '/fix/fixtureType/addFixFixture',
  fixFixtureEdit = '/fix/fixtureType/editFixFixture',
  fixFixtureDeleteOne = '/fix/fixtureType/deleteFixFixture',
  fixFixtureDeleteBatch = '/fix/fixtureType/deleteMapFixFixture',
  warehousing = '/fix/fixtureType/warehousing',
  neck = '/fix/fixtureType/neck',
  refund = '/fix/fixtureType/refund',
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
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
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
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 子列表接口
 * @param params
 */
export const fixFixtureList = (params) => {
  if (params['typeId']) {
    return defHttp.get({ url: Api.fixFixtureList, params });
  }
  return Promise.resolve({});
};
/**
 * 删除单个
 */
export const fixFixtureDeleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.fixFixtureDeleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const fixFixtureDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.fixFixtureDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const fixFixtureSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.fixFixtureEdit : Api.fixFixtureSave;
  return defHttp.post({ url: url, params });
};

/**
 * 入库
 * @param params
 */
export const warehousing = (params, handleSuccess) => {
  return defHttp.post({ url: Api.warehousing, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 领用
 * @param params
 */
export const neck = (params, handleSuccess) => {
  return defHttp.post({ url: Api.neck, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 归还
 * @param params
 */
export const refund = (params, handleSuccess) => {
  return defHttp.post({ url: Api.refund, params }).then(() => {
    handleSuccess();
  });
};
