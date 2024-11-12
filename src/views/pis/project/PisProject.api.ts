import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/project/pisProject/list',
  save = '/project/pisProject/add',
  edit = '/project/pisProject/edit',
  deleteOne = '/project/pisProject/delete',
  deleteBatch = '/project/pisProject/deleteBatch',
  importExcel = '/project/pisProject/importExcel',
  exportXls = '/project/pisProject/exportXls',
  pisProjectAnalysisList = '/project/pisProject/listPisProjectAnalysisByMainId',
  editConfrim = '/project/pisProject/editConfrim',
  editAudit = '/project/pisProject/editAudit',
  editFinish = '/project/pisProject/editFinish',
  editSubmit = '/project/pisProject/editSubmit',
  editPromotion = '/project/pisProject/editPromotion',
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
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 效果确认
 * @param params
 */
export const editConfrim = (params, isUpdate) => {
  return defHttp.post({ url: Api.editConfrim, params });
};
/**
 * 审核
 */
export const editAudit = (params, isUpdate) => {
  return defHttp.post({ url: Api.editAudit, params });
};
/**
 * 完成确认
 */
export const editFinish = (params, handleSuccess) => {
  return defHttp.put({ url: Api.editFinish, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 提交
 */
export const editSubmit = (params, handleSuccess) => {
  return defHttp.put({ url: Api.editSubmit, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 效果确认
 * @param params
 */
export const editPromotion = (params, isUpdate) => {
  return defHttp.post({ url: Api.editPromotion, params });
};

/**
 * 列表接口
 * @param params
 */
export const pisProjectAnalysisList = (params) => {
  if (params['projectId']) {
    return defHttp.get({ url: Api.pisProjectAnalysisList, params });
  }
  return Promise.resolve({});
};
