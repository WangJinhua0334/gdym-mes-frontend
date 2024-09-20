import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/prodinspstd/basProdInspStd/list',
  save = '/prodinspstd/basProdInspStd/add',
  edit = '/prodinspstd/basProdInspStd/edit',
  deleteOne = '/prodinspstd/basProdInspStd/delete',
  deleteBatch = '/prodinspstd/basProdInspStd/deleteBatch',
  importExcel = '/prodinspstd/basProdInspStd/importExcel',
  exportXls = '/prodinspstd/basProdInspStd/exportXls',
  basProdInspStdItemList = '/prodinspstd/basProdInspStd/listBasProdInspStdItemByMainId',
  basProdInspStdItemSave = '/prodinspstd/basProdInspStd/addBasProdInspStdItem',
  basProdInspStdItemEdit = '/prodinspstd/basProdInspStd/editBasProdInspStdItem',
  basProdInspStdItemDelete = '/prodinspstd/basProdInspStd/deleteBasProdInspStdItem',
  basProdInspStdItemDeleteBatch = '/prodinspstd/basProdInspStd/deleteBatchBasProdInspStdItem',
  importFromInspStd = '/prodinspstd/basProdInspStd/importFromInspStd',
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

export const importFromInspStd = (params, handleSuccess) => {
  return defHttp.put({ url: Api.importFromInspStd, params }, { joinParamsToUrl: true }).then(() => {
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
export const basProdInspStdItemList = (params) => {
  if (params['inspStdId']) {
    return defHttp.get({ url: Api.basProdInspStdItemList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basProdInspStdItemDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basProdInspStdItemDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basProdInspStdItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basProdInspStdItemDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basProdInspStdItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basProdInspStdItemEdit : Api.basProdInspStdItemSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basProdInspStdItemImportUrl = '/prodinspstd/basProdInspStd/importBasProdInspStdItem';

/**
 * 导出
 */
export const basProdInspStdItemExportXlsUrl = '/prodinspstd/basProdInspStd/exportBasProdInspStdItem';
