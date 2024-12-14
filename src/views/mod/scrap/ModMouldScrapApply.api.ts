import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mod/scrap/list',
  save = '/mod/scrap/add',
  edit = '/mod/scrap/edit',
  deleteOne = '/mod/scrap/delete',
  deleteBatch = '/mod/scrap/deleteBatch',
  importExcel = '/mod/scrap/importExcel',
  exportXls = '/mod/scrap/exportXls',
  modMouldScrapItemList = '/mod/scrap/queryModMouldScrapItemByMainId',
  approval = '/mod/scrap/approval',
  cancelApproval = '/mod/scrap/cancelApproval',
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
export const queryModMouldScrapItem = Api.modMouldScrapItemList;
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
 * 审核
 * @param params
 */
export const approval = (params) => {
  return defHttp.post({ url: Api.approval, params });
};
/**
 * 弃审
 * @param params
 */
export const cancelApproval = (params) => {
  return defHttp.post({ url: Api.cancelApproval, params });
};
/**
 * 子表列表接口
 * @param params
 */
export const modMouldScrapItemList = (params) => defHttp.get({ url: Api.modMouldScrapItemList, params }, { isTransformResponse: false });
