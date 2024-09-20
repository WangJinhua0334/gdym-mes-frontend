import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  list = '/prodinspschema/basProdInspSchema/list',
  save = '/prodinspschema/basProdInspSchema/add',
  edit = '/prodinspschema/basProdInspSchema/edit',
  deleteOne = '/prodinspschema/basProdInspSchema/delete',
  deleteBatch = '/prodinspschema/basProdInspSchema/deleteBatch',
  importExcel = '/prodinspschema/basProdInspSchema/importExcel',
  exportXls = '/prodinspschema/basProdInspSchema/exportXls',
  checkHasEnableProd = '/prodinspschema/basProdInspSchema/checkHasEnableProd',

  queryProductId = '/product/basProduct/queryById',
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
export const queryProductId = (params) => defHttp.get({ url: Api.queryProductId, params });
/**
 * 校验是否存在已经启用的料号
 */
export const checkHasEnableProd = (params) => defHttp.get({ url: Api.checkHasEnableProd, params });

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
