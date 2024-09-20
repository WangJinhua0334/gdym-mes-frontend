import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/equiprepair/eamEquipRepair/list',
  save='/equiprepair/eamEquipRepair/add',
  edit='/equiprepair/eamEquipRepair/edit',
  deleteOne = '/equiprepair/eamEquipRepair/delete',
  deleteBatch = '/equiprepair/eamEquipRepair/deleteBatch',
  importExcel = '/equiprepair/eamEquipRepair/importExcel',
  exportXls = '/equiprepair/eamEquipRepair/exportXls',
  eamEquipRepairPartsList = '/equiprepair/eamEquipRepair/queryEamEquipRepairPartsByMainId',
  queryDefectCategoryIdTree = '/defectcategory/eamDefectCategory/getTreeAll',
  reportEquipRepairConfirm='/equiprepair/eamEquipRepair/reportEquipRepairConfirm',
  equipRepair='/equiprepair/eamEquipRepair/equipRepair',
  reportEquipRepair='/equiprepair/eamEquipRepair/reportEquipRepair',
  reportEquipEvaluate='/equiprepair/eamEquipRepair/evaluate',
  reportEquipCancel='/equiprepair/eamEquipRepair/cancel',
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
export const eamEquipRepairPartsList = Api.eamEquipRepairPartsList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 故障分类树列表接口
 * @param params
 */
export const queryDefectCategoryIdTree = () => defHttp.get({ url: Api.queryDefectCategoryIdTree });

/**
 * 删除单个
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
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
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 更新
 * @param params
 */
export const update = (params) => {
  return defHttp.post({url: Api.edit, params});
}

/**
 * 保存或者更新
 * @param params
 */
export const reportEquipRepairConfirm = (params) => {
  return defHttp.put({url: Api.reportEquipRepairConfirm, params});
}

/**
 * 保存或者更新
 * @param params
 */
export const reportEquipEvaluate = (params) => {
  return defHttp.put({url: Api.reportEquipEvaluate, params});
}
/**
 * 保存或者更新
 * @param params
 */
export const reportEquipCancel = (params) => {
  defHttp.get({url: Api.reportEquipCancel, params});
}


/**
 * 保存或者更新
 * @param params
 */
export const equipRepair = (params) => {
  return defHttp.put({url: Api.equipRepair, params});
}


/**
 * 报修
 * @param params
 */
export const reportEquipRepair = (params) => {
  return defHttp.post({url: Api.reportEquipRepair, params});
}
