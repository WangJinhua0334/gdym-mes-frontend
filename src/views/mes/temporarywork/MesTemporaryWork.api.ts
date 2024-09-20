import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/temporarywork/mesTemporaryWork/list',
  save = '/temporarywork/mesTemporaryWork/add',
  edit = '/temporarywork/mesTemporaryWork/edit',
  deleteOne = '/temporarywork/mesTemporaryWork/delete',
  deleteBatch = '/temporarywork/mesTemporaryWork/deleteBatch',
  exportXls = '/temporarywork/mesTemporaryWork/exportXls',
  confirm = '/temporarywork/mesTemporaryWork/confirm',
  audit = '/temporarywork/mesTemporaryWork/audit',
  cancelAudit = '/temporarywork/mesTemporaryWork/cancelAudit',
  close = '/temporarywork/mesTemporaryWork/close',
  recordList = '/temporaryworkrecord/mesTemporaryWorkRecord/list',
  recordExportXls = '/temporaryworkrecord/mesTemporaryWorkRecord/exportXls',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

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
 * 确认
 */
export const confirm = (params) => {
  return defHttp.post({ url: Api.confirm, params });
};
/**
 * 审核
 */
export const audit = (params) => {
  return defHttp.post({ url: Api.audit, params });
};
/**
 * 弃审
 */
export const cancelAudit = (params) => {
  return defHttp.post({ url: Api.cancelAudit, params });
};
/**
 * 关闭
 */
export const close = (params) => {
  return defHttp.post({ url: Api.close, params });
};

/**
 * 操作记录导出api
 */
export const getRecordExportUrl = Api.recordExportXls;

/**
 * 操作记录列表接口
 * @param params
 */
export const recordList = (params) => defHttp.get({ url: Api.recordList, params });
