import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/checkBasc/list',
  save = '/mod/checkBasc/add',
  edit = '/mod/checkBasc/edit',
  deleteOne = '/mod/checkBasc/delete',
  deleteBatch = '/mod/checkBasc/deleteBatch',
  importExcel = '/mod/checkBasc/importExcel',
  exportXls = '/mod/checkBasc/exportXls',
  modMouldCheckItemList = '/mod/checkBasc/queryModMouldCheckItemByMainId',
  modMouldList = '/mod/type/listModMouldByMainId',
  modContentCheck = '/mod/type/modContentCheck',
  modDeleteContentCheck = '/mod/type/modDeleteContentCheck',
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
export const queryModMouldCheckItem = Api.modMouldCheckItemList;
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
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 子表列表接口
 * @param params
 */
export const modMouldCheckItemList = (params) => defHttp.get({ url: Api.modMouldCheckItemList, params }, { isTransformResponse: false });

/**
 * 查询模具信息
 * @param params
 */
export const modMouldList = (params) => defHttp.get({ url: Api.modMouldList, params });
/**
 * 关联
 * @param params
 */
export const modContentCheck = (params) => {
  return defHttp.post({ url: Api.modContentCheck, params });
};
/**
 * 删除关联
 * @param params
 */
export const modDeleteContentCheck = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除关联',
    content: '是否删除选中数据的关联信息',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.modDeleteContentCheck, params }).then(() => {
        handleSuccess();
      });
    },
  });
};
