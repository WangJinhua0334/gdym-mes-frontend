import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/equipscrapapply/eamEquipScrapApply/list',
  save = '/equipscrapapply/eamEquipScrapApply/add',
  edit = '/equipscrapapply/eamEquipScrapApply/edit',
  deleteOne = '/equipscrapapply/eamEquipScrapApply/delete',
  deleteBatch = '/equipscrapapply/eamEquipScrapApply/deleteBatch',
  importExcel = '/equipscrapapply/eamEquipScrapApply/importExcel',
  exportXls = '/equipscrapapply/eamEquipScrapApply/exportXls',
  eamEquipScrapItemList = '/equipscrapapply/eamEquipScrapApply/queryEamEquipScrapItemByMainId',
  approval = '/equipscrapapply/eamEquipScrapApply/approval',
  cancelApproval = '/equipscrapapply/eamEquipScrapApply/cancelApproval',
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
export const queryEamEquipScrapItem = Api.eamEquipScrapItemList;
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
export const eamEquipScrapItemList = (params) => defHttp.get({ url: Api.eamEquipScrapItemList, params }, { isTransformResponse: false });
