import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/productbom/basProductBom/list',
  save = '/productbom/basProductBom/add',
  edit = '/productbom/basProductBom/edit',
  deleteOne = '/productbom/basProductBom/delete',
  deleteBatch = '/productbom/basProductBom/deleteBatch',
  importExcel = '/productbom/basProductBom/importExcel',
  exportXls = '/productbom/basProductBom/exportXls',
  basProductBomDetailList = '/productbom/basProductBom/queryBomDetailPageList',
  basProductBomDetailSave = '/productbom/basProductBom/addBasProductBomDetail',
  basProductBomDetailEdit = '/productbom/basProductBom/editBasProductBomDetail',
  basProductBomDetailDelete = '/productbom/basProductBom/deleteBasProductBomDetail',
  basProductBomDetailDeleteBatch = '/productbom/basProductBom/deleteBatchBasProductBomDetail',
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
 * 列表接口
 * @param params
 */
export const basProductBomDetailList = (params) => {
  if (params['bomId']) {
    return defHttp.get({ url: Api.basProductBomDetailList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basProductBomDetailDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basProductBomDetailDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basProductBomDetailDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basProductBomDetailDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basProductBomDetailSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basProductBomDetailEdit : Api.basProductBomDetailSave;
  return defHttp.post({ url: url, params });
};
/**
 * BOM明细导入
 */
//export const basProductBomDetailImportUrl = '/productbom/basProductBom/importBasProductBomDetail';

/**
 * BOM明细导出
 */
//export const basProductBomDetailExportXlsUrl = '/productbom/basProductBom/exportBasProductBomDetail';
