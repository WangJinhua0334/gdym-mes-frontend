import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/productpick/mesProductPick/list',
  save = '/productpick/mesProductPick/add',
  edit = '/productpick/mesProductPick/edit',
  deleteOne = '/productpick/mesProductPick/delete',
  deleteBatch = '/productpick/mesProductPick/deleteBatch',
  importExcel = '/productpick/mesProductPick/importExcel',
  exportXls = '/productpick/mesProductPick/exportXls',
  mesProductPickDetailPage = '/productpick/mesProductPick/queryDetailPageByMainId',
  mesProductPickDetailList = '/productpick/mesProductPick/queryDetailListByMainId',
  deleteDetail = '/productpick/mesProductPick/deleteDetail',
  submitMain = '/productpick/mesProductPick/submitMain',
  cancelMain = '/productpick/mesProductPick/cancelMain',
  receiveMain = '/productpick/mesProductPick/receiveMain',
  revokeMain = '/productpick/mesProductPick/revokeMain',
  receiveDetail = '/productpick/mesProductPick/receiveDetail',
  revokeDetail = '/productpick/mesProductPick/revokeDetail',
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
export const mesProductPickDetailList = Api.mesProductPickDetailList;
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
export const mesProductPickDetailPage = (params) => defHttp.get({ url: Api.mesProductPickDetailPage, params });

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
export const receiveMain = (params) => {
  return defHttp.put({ url: Api.receiveMain, params }, { joinParamsToUrl: true });
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
export const receiveDetail = (params) => {
  return defHttp.put({ url: Api.receiveDetail, params }, { joinParamsToUrl: true });
};

/**
 * 明细行撤回
 * @param params
 */
export const revokeDetail = (params) => {
  return defHttp.put({ url: Api.revokeDetail, params }, { joinParamsToUrl: true });
};
