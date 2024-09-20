import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/workflow/basWorkflow/list',
  save = '/workflow/basWorkflow/add',
  edit = '/workflow/basWorkflow/edit',
  design = '/workflow/basWorkflow/design',
  deleteOne = '/workflow/basWorkflow/delete',
  deleteBatch = '/workflow/basWorkflow/deleteBatch',
  importExcel = '/workflow/basWorkflow/importExcel',
  exportXls = '/workflow/basWorkflow/exportXls',
  exportTemplateXls = '/workflow/basWorkflow/exportTemplateXls',

  getDesignerDataFileById = '/workflow/basWorkflow/getDesignerDataFileById',
  getViewerDataFileById = '/workflow/basWorkflow/getViewerDataFileById',
  saveCopy = '/workflow/basWorkflow/saveCopy',
  releaseVersion = '/workflow/basWorkflow/releaseVersion',
  releaseBom = '/workflow/basWorkflow/releaseBom',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 导出模板api
 */
export const getExportTemplateXlsUrl = Api.exportTemplateXls;

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
 * 发布工艺版本
 * @param params
 */
export const releaseBom = (params, handleSuccess) => {
  return defHttp.post({ url: Api.releaseBom, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 更新BOM信息
 * @param params
 */
export const releaseVersion = (params, handleSuccess) => {
  return defHttp.post({ url: Api.releaseVersion, params }).then(() => {
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
 * 复制
 * @param params
 */
export const saveCopy = (params) => {
  return defHttp.post({ url: Api.saveCopy, params });
};
/**
 * 保存或者更新
 * @param params
 */
export const design = (params) => {
  return defHttp.post({ url: Api.design, params });
};

/**
 * 设计时数据
 * @param params
 */
export const getDesignerDataFileById = (params) => defHttp.get({ url: Api.getDesignerDataFileById, params });

/**
 * 预览时数据
 * @param params
 */
export const getViewerDataFileById = (params) => defHttp.get({ url: Api.getViewerDataFileById, params });
