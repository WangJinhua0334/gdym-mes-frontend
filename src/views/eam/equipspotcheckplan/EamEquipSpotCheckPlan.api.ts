import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/equipspotcheckplan/eamEquipSpotCheckPlan/list',
  save = '/equipspotcheckplan/eamEquipSpotCheckPlan/add',
  edit = '/equipspotcheckplan/eamEquipSpotCheckPlan/edit',
  deleteOne = '/equipspotcheckplan/eamEquipSpotCheckPlan/delete',
  deleteBatch = '/equipspotcheckplan/eamEquipSpotCheckPlan/deleteBatch',
  importExcel = '/equipspotcheckplan/eamEquipSpotCheckPlan/importExcel',
  exportXls = '/equipspotcheckplan/eamEquipSpotCheckPlan/exportXls',
  eamEquipSpotCheckRecItemList = '/equipspotcheckplan/eamEquipSpotCheckPlan/listEamEquipSpotCheckRecItemByMainIdNotPage',
  getSpotCheckRecItemByCode = '/equipment/eamEquipment/queryEamEquipSpotCheckItemByCode',
  spotCheck = '/equipspotcheckplan/eamEquipSpotCheckPlan/spotCheck',
  cancelSpotCheck = '/equipspotcheckplan/eamEquipSpotCheckPlan/cancelSpotCheck',
  listEamEquipSpotCheckItemByMainIdAll = '/equipment/eamEquipment/listEamEquipSpotCheckItemByMainIdAll',
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
 * 查询子表数据
 * @param params
 */
export const eamEquipSpotCheckRecItemList = Api.eamEquipSpotCheckRecItemList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 列表接口
 * @param params
 */
export const getSpotCheckRecItemByCode = (params) => defHttp.get({ url: Api.getSpotCheckRecItemByCode, params });

/**
 * 列表接口
 * @param params
 */
export const listEamEquipSpotCheckItemByMainIdAll = (params) => defHttp.get({ url: Api.listEamEquipSpotCheckItemByMainIdAll, params });

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
 * 点检
 * @param params
 */
export const spotCheck = (params) => {
  return defHttp.put({ url: Api.spotCheck, params });
};
/**
 * 取消
 * @param params
 */
export const cancelSpotCheck = (params) => {
  return defHttp.put({ url: Api.cancelSpotCheck, params });
};
