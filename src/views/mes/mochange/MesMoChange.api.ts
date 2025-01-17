import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mochange/mesMoChange/list',
  save = '/mochange/mesMoChange/add',
  edit = '/mochange/mesMoChange/edit',
  deleteOne = '/mochange/mesMoChange/delete',
  deleteBatch = '/mochange/mesMoChange/deleteBatch',
  exportXls = '/mochange/mesMoChange/exportXls',
  mesMoChangeDetailList = '/mochange/mesMoChange/queryMesMoChangeDetailByMainId',
  addMoChangeDetailList = '/mochange/mesMoChange/queryMesMoChangeDetailListByMainIdAndMoId',
  /**工单工序列表查询 */
  mesMoStationList = '/mo/mesMo/queryMesMoStationByMainId',
  //提交
  submit = '/mochange/mesMoChange/submit',
  //审核
  audit = '/mochange/mesMoChange/audit',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 子表单查询接口
 * @param params
 */
export const queryMesMoChangeDetail = Api.mesMoChangeDetailList;
/**
 * 子表单查询接口-用于新增和编辑
 * @param params
 */
export const queryAddMesMoChangeDetail = Api.addMoChangeDetailList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 工单工序列表接口
 * @param params
 */
export const mesMoStationList = (params) => defHttp.get({ url: Api.mesMoStationList, params }, { isTransformResponse: false });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};

/**
 * 提交
 */
export const submit = (params, handleSuccess) => {
  return defHttp.post({ url: Api.submit, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 审核
 */
export const audit = (params, handleSuccess) => {
  return defHttp.post({ url: Api.audit, params }, { joinParamsToUrl: true }).then(() => {
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
 * 子表列表接口
 * @param params
 */
export const mesMoChangeDetailList = (params) => defHttp.get({ url: Api.mesMoChangeDetailList, params }, { isTransformResponse: false });
