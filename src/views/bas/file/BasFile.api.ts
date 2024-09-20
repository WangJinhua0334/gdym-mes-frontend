import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/file/basFile/list',
  save = '/file/basFile/add',
  edit = '/file/basFile/edit',
  deleteOne = '/file/basFile/delete',
  deleteBatch = '/file/basFile/deleteBatch',
  importExcel = '/file/basFile/importExcel',
  exportXls = '/file/basFile/exportXls',
  basProductFileList = '/file/basFile/listBasProductFileByMainId',
  basProductFileSave = '/file/basFile/addBasProductFile',
  basProductFileEdit = '/file/basFile/editBasProductFile',
  basProductFileDelete = '/file/basFile/deleteBasProductFile',
  basProductFileDeleteBatch = '/file/basFile/deleteBatchBasProductFile',
  basProductGroupFileList = '/file/basFile/listBasProductGroupFileByMainId',
  basProductGroupFileSave = '/file/basFile/addBasProductGroupFile',
  basProductGroupFileEdit = '/file/basFile/editBasProductGroupFile',
  basProductGroupFileDelete = '/file/basFile/deleteBasProductGroupFile',
  basProductGroupFileDeleteBatch = '/file/basFile/deleteBatchBasProductGroupFile',
  getOnlinePreviewUrl = '/sys/common/getOnlinePreviewUrl',

  audit = '/file/basFile/audit',
  cancelAudit = '/file/basFile/cancelAudit',

  issue = '/file/basFile/issue',
  getFileVersion = '/file/basFile/getFileVersion',
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
 * 获取版本信息接口
 * @param params
 */
export const getFileVersion = (params) => defHttp.get({ url: Api.getFileVersion, params });

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
 * 文件审核
 * @param params
 */
export const audit = (params) => {
  return defHttp.put({ url: Api.audit, params }, { joinParamsToUrl: true });
};
/**
 * 文件弃审
 * @param params
 */
export const cancelAudit = (params) => {
  return defHttp.put({ url: Api.cancelAudit, params }, { joinParamsToUrl: true });
};
/**
 * 文件下发
 * @param params
 */
export const issue = (params) => {
  return defHttp.post({ url: Api.issue, params });
};

/**
 * 列表接口
 * @param params
 */
export const basProductFileList = (params) => {
  if (params['fileId']) {
    return defHttp.get({ url: Api.basProductFileList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basProductFileDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basProductFileDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basProductFileDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basProductFileDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basProductFileSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basProductFileEdit : Api.basProductFileSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basProductFileImportUrl = '/file/basFile/importBasProductFile';

/**
 * 导出
 */
export const basProductFileExportXlsUrl = '/file/basFile/exportBasProductFile';
/**
 * 列表接口
 * @param params
 */
export const basProductGroupFileList = (params) => {
  if (params['fileId']) {
    return defHttp.get({ url: Api.basProductGroupFileList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basProductGroupFileDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basProductGroupFileDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basProductGroupFileDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basProductGroupFileDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basProductGroupFileSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basProductGroupFileEdit : Api.basProductGroupFileSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basProductGroupFileImportUrl = '/file/basFile/importBasProductGroupFile';

/**
 * 导出
 */
export const basProductGroupFileExportXlsUrl = '/file/basFile/exportBasProductGroupFile';

/**
 * 在线预览
 */
export const getOnlinePreviewUrl = (params) =>
  defHttp.get({ url: Api.getOnlinePreviewUrl, params }, { joinParamsToUrl: true, isTransformResponse: false });
