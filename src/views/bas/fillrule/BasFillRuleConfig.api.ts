import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/fillrule/basFillRuleConfig/list',
  save = '/fillrule/basFillRuleConfig/add',
  edit = '/fillrule/basFillRuleConfig/edit',
  deleteOne = '/fillrule/basFillRuleConfig/delete',
  deleteBatch = '/fillrule/basFillRuleConfig/deleteBatch',
  importExcel = '/fillrule/basFillRuleConfig/importExcel',
  exportXls = '/fillrule/basFillRuleConfig/exportXls',
  basFillRuleConfigDetailList = '/fillrule/basFillRuleConfig/queryBasFillRuleConfigDetailByMainId',
  getSysFillRule = '/sys/fillRule/queryById',
  getDefaultBySysFillRuleId = '/fillrule/basFillRuleConfig/getDefaultBySysFillRuleId',
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
export const queryBasFillRuleConfigDetail = Api.basFillRuleConfigDetailList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

export const getSysFillRule = (params) => defHttp.get({ url: Api.getSysFillRule, params });

export const getDefaultBySysFillRuleId = (params) => {
  return defHttp.get({ url: Api.getDefaultBySysFillRuleId, params });
};
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
 * 子表列表接口
 * @param params
 */
export const basFillRuleConfigDetailList = (params) => defHttp.get({ url: Api.basFillRuleConfigDetailList, params }, { isTransformResponse: false });
