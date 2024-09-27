import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  pisProjectAnalysisList = '/project/pisProject/listPisProjectAnalysisByMainIdAndUser',
  pisProjectAnalysisSave = '/project/pisProject/addPisProjectAnalysis',
  pisProjectAnalysisEdit = '/project/pisProject/editPisProjectAnalysis',
  pisProjectAnalysisDelete = '/project/pisProject/deletePisProjectAnalysis',
  pisProjectAnalysisDeleteBatch = '/project/pisProject/deleteBatchPisProjectAnalysis',
}
/**
 * 列表接口
 * @param params
 */
export const pisProjectAnalysisList = (params) => {
  //if (params['projectId']) {
  return defHttp.get({ url: Api.pisProjectAnalysisList, params });
  //}
  //return Promise.resolve({});
};

/**
 * 删除单个
 */
export const pisProjectAnalysisDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.pisProjectAnalysisDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const pisProjectAnalysisDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.pisProjectAnalysisDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const pisProjectAnalysisSaveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.pisProjectAnalysisEdit : Api.pisProjectAnalysisSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const pisProjectAnalysisImportUrl = '/project/pisProject/importPisProjectAnalysis';

/**
 * 导出
 */
export const pisProjectAnalysisExportXlsUrl = '/project/pisProject/exportPisProjectAnalysis';
