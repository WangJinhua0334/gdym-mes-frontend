import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mst/measuringType/list',
  save = '/mst/measuringType/add',
  edit = '/mst/measuringType/edit',
  deleteOne = '/mst/measuringType/delete',
  deleteBatch = '/mst/measuringType/deleteBatch',
  importExcel = '/mst/measuringType/importExcel',
  exportXls = '/mst/measuringType/exportXls',
  mstMeasuringList = '/mst/measuringType/mstMeasuringPageList',
  mstMeasuringSave = '/mst/measuringType/addMstMeasuring',
  mstMeasuringEdit = '/mst/measuringType/editMstMeasuring',
  mstMeasuringDeleteOne = '/mst/measuringType/deleteMstMeasuring',
  mstMeasuringDeleteBatch = '/mst/measuringType/deleteMapMstMeasuring',
  warehousing = '/mst/measuringType/warehousing',
  neck = '/mst/measuringType/neck',
  refund = '/mst/measuringType/refund',
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
 * 子列表接口
 * @param params
 */
export const mstMeasuringList = (params) => {
  if (params['typeId']) {
    return defHttp.get({ url: Api.mstMeasuringList, params });
  }
  return Promise.resolve({});
};
/**
 * 删除单个
 */
export const mstMeasuringDeleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.mstMeasuringDeleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const mstMeasuringDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.mstMeasuringDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const mstMeasuringSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.mstMeasuringEdit : Api.mstMeasuringSave;
  return defHttp.post({ url: url, params });
};

/**
 * 入库
 * @param params
 */
export const warehousing = (params, handleSuccess) => {
  return defHttp.post({ url: Api.warehousing, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 领用
 * @param params
 */
export const neck = (params, handleSuccess) => {
  return defHttp.post({ url: Api.neck, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 归还
 * @param params
 */
export const refund = (params, handleSuccess) => {
  return defHttp.post({ url: Api.refund, params }).then(() => {
    handleSuccess();
  });
};
