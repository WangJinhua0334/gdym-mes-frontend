import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/abnormal/mesAbnormal/list',
  listByStatus = '/abnormal/mesAbnormal/listByStatus',
  listByWkpId = '/abnormal/mesAbnormal/listByWkpId',
  queryById = '/abnormal/mesAbnormal/queryById',

  revoke = '/abnormal/mesAbnormal/revoke',
  response = '/abnormal/mesAbnormal/response',
  process = '/abnormal/mesAbnormal/process',
  complete = '/abnormal/mesAbnormal/complete',
  reSend = '/abnormal/mesAbnormal/resend',
  save = '/abnormal/mesAbnormal/add',
  edit = '/abnormal/mesAbnormal/edit',
  deleteOne = '/abnormal/mesAbnormal/delete',
  deleteBatch = '/abnormal/mesAbnormal/deleteBatch',
  exportXls = '/abnormal/mesAbnormal/exportXls',
  listAllType = '/abnormal/mesAbnormalType/listAll',
  listCall = '/abnormal/mesAbnormal/listCall', //工作台呼叫异常界面
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
 * 工作台呼叫异常界面列表接口
 * @param params
 */
export const listCall = (params) => defHttp.get({ url: Api.listCall, params });
/**
 * 列表接口-状态过滤
 * @param params
 */
export const listByStatus = (params) => defHttp.get({ url: Api.listByStatus, params });
/**
 * 工位异常列表接口-未处理完成异常
 * @param params
 */
export const listByWkpId = (params) => defHttp.get({ url: Api.listByWkpId, params });
/**
 * 查询单个
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params });

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
 * 撤回
 * @param params
 */
export const revoke = (params) => {
  return defHttp.post({ url: Api.revoke, params });
};

/**
 * 响应
 * @param params
 */
export const response = (params) => {
  return defHttp.post({ url: Api.response, params });
};

/**
 * 处理
 * @param params
 */
export const process = (params) => {
  return defHttp.post({ url: Api.process, params });
};

/**
 * 确认完成
 * @param params
 */
export const complete = (params) => {
  return defHttp.post({ url: Api.complete, params });
};
/**
 * 未处理完成
 * @param params
 */
export const reSend = (params) => {
  return defHttp.post({ url: Api.reSend, params });
};


/**
 * 异常类型-列表
 * @param params
 */
export const listAllType = (params) => defHttp.get({ url: Api.listAllType, params });
