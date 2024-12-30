import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/type/list',
  save = '/mod/type/add',
  edit = '/mod/type/edit',
  deleteOne = '/mod/type/delete',
  deleteBatch = '/mod/type/deleteBatch',
  importExcel = '/mod/type/importExcel',
  exportXls = '/mod/type/exportXls',
  modMouldList = '/mod/type/listModMouldByMainId',
  modMouldSave = '/mod/type/addModMould',
  modMouldEdit = '/mod/type/editModMould',
  modMouldDelete = '/mod/type/deleteModMould',
  modMouldDeleteBatch = '/mod/type/deleteBatchModMould',
  warehousing = '/mod/type/warehousing',
  neck = '/mod/type/neck',
  refund = '/mod/type/refund',
  change = '/mod/type/change',
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
export const modMouldList = (params) => {
  if (params['typeId']) {
    return defHttp.get({ url: Api.modMouldList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const modMouldDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.modMouldDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const modMouldDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.modMouldDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const modMouldSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.modMouldEdit : Api.modMouldSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const modMouldImportUrl = '/mod/type//importModMould';

/**
 * 导出
 */
export const modMouldExportXlsUrl = '/mod/type/exportModMould';

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
export const neck = (params) => {
  return defHttp.post({ url: Api.neck, params });
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

/**
 * 改模
 * @param params
 */
export const change = (params, handleSuccess) => {
  return defHttp.post({ url: Api.change, params }).then(() => {
    handleSuccess();
  });
};
