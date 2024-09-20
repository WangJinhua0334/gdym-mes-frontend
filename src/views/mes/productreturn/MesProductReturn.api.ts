import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/productreturn/mesProductReturn/list',
  save = '/productreturn/mesProductReturn/add',
  edit = '/productreturn/mesProductReturn/edit',
  deleteOne = '/productreturn/mesProductReturn/delete',
  deleteBatch = '/productreturn/mesProductReturn/deleteBatch',
  importExcel = '/productreturn/mesProductReturn/importExcel',
  exportXls = '/productreturn/mesProductReturn/exportXls',
  mesProductReturnDetailPage = '/productreturn/mesProductReturn/queryDetailPageByMainId',
  mesProductReturnDetailList = '/productreturn/mesProductReturn/queryDetailListByMainId',
  deleteDetail = '/productreturn/mesProductReturn/deleteDetail',
  submitMain = '/productreturn/mesProductReturn/submitMain',
  cancelMain = '/productreturn/mesProductReturn/cancelMain',
  returnMain = '/productreturn/mesProductReturn/returnMain',
  revokeMain = '/productreturn/mesProductReturn/revokeMain',
  returnDetail = '/productreturn/mesProductReturn/returnDetail',
  revokeDetail = '/productreturn/mesProductReturn/revokeDetail',
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
 * 子表单查询接口
 * @param params
 */
export const queryMesProductReturnDetail = Api.mesProductReturnDetailList;
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
 * 子表列表接口
 * @param params
 */
export const mesProductReturnDetailPage = (params) => defHttp.get({ url: Api.mesProductReturnDetailPage, params });

/**
 * 删除明细行
 */
export const deleteDetail = (params) => {
  return defHttp.delete({ url: Api.deleteDetail, params }, { joinParamsToUrl: true });
};

/**
 * 提交
 * @param params
 */
export const submitMain = (params) => {
  return defHttp.put({ url: Api.submitMain, params }, { joinParamsToUrl: true });
};
/**
 * 取消
 * @param params
 */
export const cancelMain = (params) => {
  return defHttp.put({ url: Api.cancelMain, params }, { joinParamsToUrl: true });
};

/**
 * 收料
 * @param params
 */
export const returnMain = (params) => {
  return defHttp.put({ url: Api.returnMain, params }, { joinParamsToUrl: true });
};

/**
 * 撤回
 * @param params
 */
export const revokeMain = (params) => {
  return defHttp.put({ url: Api.revokeMain, params }, { joinParamsToUrl: true });
};

/**
 * 明细行收料
 * @param params
 */
export const returnDetail = (params) => {
  return defHttp.put({ url: Api.returnDetail, params }, { joinParamsToUrl: true });
};

/**
 * 明细行撤回
 * @param params
 */
export const revokeDetail = (params) => {
  return defHttp.put({ url: Api.revokeDetail, params }, { joinParamsToUrl: true });
};
