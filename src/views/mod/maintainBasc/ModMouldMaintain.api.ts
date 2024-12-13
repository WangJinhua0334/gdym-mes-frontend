import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/maintainBasc/list',
  save = '/mod/maintainBasc/add',
  edit = '/mod/maintainBasc/edit',
  deleteOne = '/mod/maintainBasc/delete',
  deleteBatch = '/mod/maintainBasc/deleteBatch',
  importExcel = '/mod/maintainBasc/importExcel',
  exportXls = '/mod/maintainBasc/exportXls',
  modMouldMaintainItemList = '/mod/maintainBasc/queryModMouldMaintainItemByMainId',
  modMouldList = '/mod/type/listModMouldByMainId',
  modContentMaintain = '/mod/type/modContentMaintain',
  modDeleteContentMaintain = '/mod/type/modDeleteContentMaintain',
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
export const queryModMouldMaintainItem = Api.modMouldMaintainItemList;
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
export const modMouldMaintainItemList = (params) => defHttp.get({ url: Api.modMouldMaintainItemList, params }, { isTransformResponse: false });

/**
 * 查询模具信息
 * @param params
 */
export const modMouldList = (params) => defHttp.get({ url: Api.modMouldList, params });
/**
 * 关联
 * @param params
 */
export const modContentMaintain = (params) => {
  return defHttp.post({ url: Api.modContentMaintain, params });
};
/**
 * 删除关联
 * @param params
 */
export const modDeleteContentMaintain = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除关联',
    content: '是否删除选中数据的关联信息',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.modDeleteContentMaintain, params }).then(() => {
        handleSuccess();
      });
    },
  });
};
